const pdf2pic = require("pdf2pic");
const path = require("path");
const fs = require("fs");

// PDF dosyasını JPG'lere dönüştürme fonksiyonu
async function convertPdfToJpg(pdfPath, outputDir, options = {}) {
  try {
    // Çıktı dizinini oluştur
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // pdf2pic konfigürasyonu
    const convert = pdf2pic.fromPath(pdfPath, {
      density: options.density || 300,           // DPI (300 = yüksek kalite)
      saveFilename: options.saveFilename || "page", // Dosya adı formatı
      savePath: outputDir,                       // Çıktı dizini
      format: "jpg",                            // Çıktı formatı
      width: options.width || 2000,             // Genişlik (piksel)
      height: options.height || 2000,           // Yükseklik (piksel)
      quality: options.quality || 100           // Kalite (1-100)
    });

    console.log(`PDF dönüştürülüyor: ${pdfPath}`);
    console.log(`Çıktı dizini: ${outputDir}`);

    // Tüm sayfaları dönüştür
    const results = await convert.bulk(-1, {
      responseType: "image"
    });

    console.log(`✅ ${results.length} sayfa başarıyla dönüştürüldü!`);
    
    // Sonuçları listele
    results.forEach((result, index) => {
      console.log(`Sayfa ${index + 1}: ${result.path}`);
    });

    return results;

  } catch (error) {
    console.error("❌ Dönüştürme hatası:", error.message);
    throw error;
  }
}

// Komut satırından çalıştırma
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("Kullanım: node pdf-to-jpg.js <pdf-dosya-yolu> <çıktı-dizini> [seçenekler]");
    console.log("");
    console.log("Seçenekler:");
    console.log("  --density=300     DPI (varsayılan: 300)");
    console.log("  --width=2000      Genişlik (piksel)");
    console.log("  --height=2000     Yükseklik (piksel)");
    console.log("  --quality=100     Kalite 1-100 (varsayılan: 100)");
    console.log("");
    console.log("Örnek:");
    console.log("  node pdf-to-jpg.js ./public/pdfs/products/sample.pdf ./public/images/products/sample");
    console.log("  node pdf-to-jpg.js ./sample.pdf ./output --density=150 --quality=80");
    process.exit(1);
  }

  const pdfPath = args[0];
  const outputDir = args[1];
  
  // Seçenekleri parse et
  const options = {};
  args.slice(2).forEach(arg => {
    if (arg.startsWith('--density=')) {
      options.density = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--width=')) {
      options.width = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--height=')) {
      options.height = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--quality=')) {
      options.quality = parseInt(arg.split('=')[1]);
    }
  });

  // PDF dosyasının varlığını kontrol et
  if (!fs.existsSync(pdfPath)) {
    console.error(`❌ PDF dosyası bulunamadı: ${pdfPath}`);
    process.exit(1);
  }

  // Dönüştürmeyi başlat
  convertPdfToJpg(pdfPath, outputDir, options)
    .then(() => {
      console.log("🎉 Dönüştürme tamamlandı!");
    })
    .catch((error) => {
      console.error("💥 Hata:", error.message);
      process.exit(1);
    });
}

module.exports = { convertPdfToJpg };
