import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

// MySQL bağlantısı
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'websitedb',
  charset: 'utf8mb4'
});

// Database connection test
db.connect((err) => {
  if (err) {
    console.error('MySQL bağlantı hatası:', err);
    return;
  }
  console.log('MySQL veritabanına bağlandı');
});

// Resim ve PDF yükleme için multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = 'products';
    if (req.path.includes('news')) {
      type = 'news';
    } else if (req.path.includes('references')) {
      type = 'references';
    }
    
    // PDF dosyaları için ayrı klasör
    if (file.mimetype === 'application/pdf') {
      const dir = `public/pdfs/${type}`;
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

app.post('/api/news', upload.single('image'), (req, res) => {
  const { title, summary, content } = req.body;
  const image_path = req.file ? `/images/news/${req.file.filename}` : null;

  db.query(
    'INSERT INTO news (title, summary, content, image_path) VALUES (?, ?, ?, ?)',
    [title, summary, content, image_path],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: result.insertId, title, summary, content, image_path });
    }
  );
});

app.put('/api/news/:id', upload.single('image'), (req, res) => {
  const { title, summary, content } = req.body;
  const image_path = req.file ? `/images/news/${req.file.filename}` : req.body.image_path;

  db.query(
    'UPDATE news SET title = ?, summary = ?, content = ?, image_path = ? WHERE id = ?',
    [title, summary, content, image_path, req.params.id],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: req.params.id, title, summary, content, image_path });
    }
  );
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

// SPA için tüm route'ları frontend'e yönlendir (API route'larından sonra)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 