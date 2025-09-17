import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// import pdf from 'pdf-parse'; // Bu modül sorunlu, kaldırıldı
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS yapılandırması
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081', 
  'http://localhost:8082',
  'http://frontend:8080',
  'http://77.223.133.173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyalar için
app.use('/images', express.static('public/images'));
app.use('/pdfs', express.static('public/pdfs'));
app.use('/src', express.static('public'));

// Frontend static dosyalarını serve et
app.use(express.static('dist'));

// MySQL bağlantısı - Connection pooling ile
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'websitedb',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Database connection test
db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
    return;
  }
  console.log('MySQL veritabanına bağlandı');
  connection.release();
});

// Resim ve PDF yükleme için multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = 'products';
    if (req.path.includes('news')) {
      type = 'news';
    } else if (req.path.includes('references')) {
      type = 'references';
    } else if (req.path.includes('team')) {
      type = 'team';
    }
    
    // PDF dosyaları için ayrı klasör
    if (file.mimetype === 'application/pdf') {
      const dir = `public/pdfs/${type}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    } else if (file.mimetype.startsWith('video/')) {
      // Video dosyaları için ayrı klasör
      const dir = `public/videos/${type}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    } else {
      const dir = `public/images/${type}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// API Routes
app.get('/api/products', (req, res) => {
  console.log('Products API called');
  db.query('SELECT * FROM products ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Database error in products:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Products fetched successfully:', results.length);
    res.json(results);
  });
});

app.post('/api/products', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), (req, res) => {
  const { name, description, category } = req.body;
  const image_path = req.files?.image ? `/images/products/${req.files.image[0].filename}` : null;
  const pdf_path = req.files?.pdf ? `/pdfs/products/${req.files.pdf[0].filename}` : null;

  db.query(
    'INSERT INTO products (name, description, image_path, category, pdf_path) VALUES (?, ?, ?, ?, ?)',
    [name, description, image_path, category, pdf_path],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, name, description, image_path, category, pdf_path });
    }
  );
});

app.put('/api/products/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), (req, res) => {
  const { name, description, category } = req.body;
  const image_path = req.files?.image ? `/images/products/${req.files.image[0].filename}` : req.body.image_path;
  const pdf_path = req.files?.pdf ? `/pdfs/products/${req.files.pdf[0].filename}` : req.body.pdf_path;

  db.query(
    'UPDATE products SET name = ?, description = ?, image_path = ?, category = ?, pdf_path = ? WHERE id = ?',
    [name, description, image_path, category, pdf_path, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, name, description, image_path, category, pdf_path });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Ürün başarıyla silindi' });
  });
});

// Haberler için API endpoint'leri
app.get('/api/news', (req, res) => {
  db.query('SELECT * FROM news ORDER BY created_at DESC', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/news', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  const { title, summary, content, video_link, custom_date } = req.body;
  const image_path = req.files?.image ? `/images/news/${req.files.image[0].filename}` : null;
  const video_path = req.files?.video ? `/videos/news/${req.files.video[0].filename}` : null;
  
  // Custom date varsa kullan, yoksa şu anki tarihi kullan
  const news_date = custom_date ? new Date(custom_date) : new Date();

  db.query(
    'INSERT INTO news (title, summary, content, image_path, video_path, video_link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, summary, content, image_path, video_path, video_link, news_date],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, title, summary, content, image_path, video_path, video_link, created_at: news_date });
    }
  );
});

app.put('/api/news/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  const { title, summary, content, video_link, custom_date } = req.body;
  const image_path = req.files?.image ? `/images/news/${req.files.image[0].filename}` : req.body.image_path;
  const video_path = req.files?.video ? `/videos/news/${req.files.video[0].filename}` : req.body.video_path;
  
  // Custom date varsa kullan, yoksa mevcut tarihi koru
  const news_date = custom_date ? new Date(custom_date) : null;

  if (news_date) {
    db.query(
      'UPDATE news SET title = ?, summary = ?, content = ?, image_path = ?, video_path = ?, video_link = ?, created_at = ? WHERE id = ?',
      [title, summary, content, image_path, video_path, video_link, news_date, req.params.id],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: req.params.id, title, summary, content, image_path, video_path, video_link, created_at: news_date });
      }
    );
  } else {
    db.query(
      'UPDATE news SET title = ?, summary = ?, content = ?, image_path = ?, video_path = ?, video_link = ? WHERE id = ?',
      [title, summary, content, image_path, video_path, video_link, req.params.id],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: req.params.id, title, summary, content, image_path, video_path, video_link });
      }
    );
  }
});

app.delete('/api/news/:id', (req, res) => {
  db.query('DELETE FROM news WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Haber başarıyla silindi' });
  });
});

// Referanslar için API endpoint'leri
app.get('/api/references', (req, res) => {
  db.query('SELECT * FROM company_references ORDER BY created_at DESC', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/references', upload.single('image'), (req, res) => {
  const { name, description, location } = req.body;
  const image_path = req.file ? `/images/references/${req.file.filename}` : null;

  db.query(
    'INSERT INTO company_references (name, description, location, image_path) VALUES (?, ?, ?, ?)',
    [name, description, location, image_path],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, name, description, location, image_path });
    }
  );
});

app.put('/api/references/:id', upload.single('image'), (req, res) => {
  const { name, description, location } = req.body;
  const image_path = req.file ? `/images/references/${req.file.filename}` : req.body.image_path;

  db.query(
    'UPDATE company_references SET name = ?, description = ?, location = ?, image_path = ? WHERE id = ?',
    [name, description, location, image_path, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, name, description, location, image_path });
    }
  );
});

app.delete('/api/references/:id', (req, res) => {
  db.query('DELETE FROM company_references WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Referans başarıyla silindi' });
  });
});

// Kategoriler için API endpoint'leri
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories ORDER BY name ASC', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  
  db.query(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name, description],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, name, description });
    }
  );
});

app.put('/api/categories/:id', (req, res) => {
  const { name, description } = req.body;
  
  db.query(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, name, description });
    }
  );
});

app.delete('/api/categories/:id', (req, res) => {
  db.query('DELETE FROM categories WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Kategori başarıyla silindi' });
  });
});

// Team API endpoints
app.get('/api/team', (req, res) => {
  db.query('SELECT * FROM team_members ORDER BY sort_order, created_at', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/team', upload.single('image'), (req, res) => {
  const { name, position, department, parent_id, sort_order } = req.body;
  const image_path = req.file ? `/images/team/${req.file.filename}` : null;

  db.query(
    'INSERT INTO team_members (name, position, department, image_path, parent_id, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
    [name, position, department, image_path, parent_id || null, sort_order || 0],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, name, position, department, image_path, parent_id, sort_order });
    }
  );
});

app.put('/api/team/:id', upload.single('image'), (req, res) => {
  const { name, position, department, parent_id, sort_order } = req.body;
  const image_path = req.file ? `/images/team/${req.file.filename}` : req.body.existing_image;

  db.query(
    'UPDATE team_members SET name = ?, position = ?, department = ?, image_path = ?, parent_id = ?, sort_order = ? WHERE id = ?',
    [name, position, department, image_path, parent_id || null, sort_order || 0, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, name, position, department, image_path, parent_id, sort_order });
    }
  );
});

app.delete('/api/team/:id', (req, res) => {
  db.query('DELETE FROM team_members WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Ekip üyesi başarıyla silindi' });
  });
});

// PDF işleme için yardımcı fonksiyonlar
const execAsync = promisify(exec);

// PDF'yi sayfalara ayırma fonksiyonu
async function convertPdfToImages(pdfPath, outputDir) {
  try {
    // Çıktı dizinini oluştur
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // ImageMagick ile PDF'yi JPG'lere dönüştür
    const command = `magick "${pdfPath}" "${outputDir}/page-%d.jpg"`;
    await execAsync(command);
    
    // Oluşturulan dosyaları listele
    const files = fs.readdirSync(outputDir).filter(file => file.endsWith('.jpg'));
    return files.sort((a, b) => {
      const aNum = parseInt(a.match(/\d+/)[0]);
      const bNum = parseInt(b.match(/\d+/)[0]);
      return aNum - bNum;
    });
  } catch (error) {
    console.error('PDF dönüştürme hatası:', error);
    throw error;
  }
}

// PDF'den metin çıkarma fonksiyonu (geçici olarak devre dışı)
async function extractTextFromPdf(pdfPath) {
  try {
    // Geçici olarak boş string döndür
    console.log('PDF metin çıkarma geçici olarak devre dışı');
    return '';
  } catch (error) {
    console.error('PDF metin çıkarma hatası:', error);
    throw error;
  }
}

// PDF'den ürün isimlerini çıkarma fonksiyonu (basit regex ile)
function extractProductNames(text) {
  // Bu fonksiyon PDF içeriğine göre özelleştirilebilir
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const productNames = [];
  
  // Basit bir pattern - gerçek kullanımda daha gelişmiş olmalı
  lines.forEach(line => {
    const trimmed = line.trim();
    // Büyük harfle başlayan ve belirli uzunlukta olan satırları ürün adı olarak kabul et
    if (trimmed.length > 3 && trimmed.length < 100 && 
        /^[A-ZÇĞIİÖŞÜ][a-zçğıiöşü\s\d\-\.]+$/.test(trimmed)) {
      productNames.push(trimmed);
    }
  });
  
  return productNames;
}

// PDF'den ürün ekleme endpoint'i
app.post('/api/products/from-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF dosyası gerekli' });
    }

    const { category } = req.body;
    const pdfPath = req.file.path;
    const pdfName = path.parse(req.file.originalname).name;
    
    // PDF'yi sayfalara ayır
    const outputDir = path.join(__dirname, 'public', 'images', 'products', pdfName);
    const imageFiles = await convertPdfToImages(pdfPath, outputDir);
    
    // PDF'den metin çıkar
    const text = await extractTextFromPdf(pdfPath);
    const productNames = extractProductNames(text);
    
    // Her sayfa için ürün oluştur
    const createdProducts = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = `/images/products/${pdfName}/${imageFiles[i]}`;
      const productName = productNames[i] || `${pdfName} - Sayfa ${i + 1}`;
      const description = `PDF'den otomatik oluşturulan ürün - ${pdfName}`;
      
      // Veritabanına ekle
      const insertResult = await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO products (name, description, image_path, category) VALUES (?, ?, ?, ?)',
          [productName, description, imagePath, category || 'PDF'],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
      
      createdProducts.push({
        id: insertResult.insertId,
        name: productName,
        description,
        image_path: imagePath,
        category: category || 'PDF'
      });
    }
    
    // Geçici PDF dosyasını sil
    fs.unlinkSync(pdfPath);
    
    res.json({
      message: `${createdProducts.length} ürün başarıyla oluşturuldu`,
      products: createdProducts,
      extractedText: text.substring(0, 500) + '...' // İlk 500 karakter
    });
    
  } catch (error) {
    console.error('PDF ürün ekleme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// SPA için tüm route'ları frontend'e yönlendir (API route'larından sonra)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 