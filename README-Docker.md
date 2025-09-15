# Mermer Yönetim Sistemi - Docker Kurulumu

Bu proje Docker kullanarak çalıştırılabilir. Tüm servisler (Frontend, Backend, MySQL) Docker container'larında çalışır.

## Gereksinimler

- Docker
- Docker Compose

## Kurulum ve Çalıştırma

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd mermer-yonet-sistem-main
```

### 2. Docker Container'larını Başlatın
```bash
# Tüm servisleri build et ve başlat
npm run docker:up

# Veya manuel olarak
docker-compose up -d
```

### 3. Servisleri Kontrol Edin
```bash
# Container durumlarını kontrol et
docker-compose ps

# Logları görüntüle
npm run docker:logs
```

## Erişim Adresleri

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3000/api
- **MySQL:** localhost:3306
  - Kullanıcı: `root`
  - Şifre: `root`
  - Veritabanı: `websitedb`

## Admin Panel

- **URL:** http://localhost:8080/admin
- **Kullanıcı Adı:** `admin`
- **Şifre:** `admin123`

## Docker Komutları

```bash
# Container'ları durdur
npm run docker:down

# Container'ları yeniden başlat
npm run docker:restart

# Logları görüntüle
npm run docker:logs

# Sadece build et
npm run docker:build
```

## Veritabanı

MySQL veritabanı otomatik olarak oluşturulur ve örnek verilerle doldurulur. Veriler `docker/mysql/init.sql` dosyasından yüklenir.

## Dosya Yapısı

```
├── docker-compose.yml          # Docker Compose konfigürasyonu
├── Dockerfile.frontend         # Frontend Dockerfile
├── Dockerfile.backend          # Backend Dockerfile
├── docker/
│   └── mysql/
│       └── init.sql           # Veritabanı init scripti
└── .dockerignore              # Docker ignore dosyası
```

## Sorun Giderme

### Container'lar Başlamıyor
```bash
# Logları kontrol edin
docker-compose logs

# Container'ları temizleyin ve yeniden başlatın
docker-compose down -v
docker-compose up -d
```

### Veritabanı Bağlantı Hatası
```bash
# MySQL container'ının çalıştığını kontrol edin
docker-compose ps mysql

# MySQL loglarını kontrol edin
docker-compose logs mysql
```

### Port Çakışması
Eğer portlar kullanımda ise, `docker-compose.yml` dosyasındaki port numaralarını değiştirin.

## Geliştirme

Geliştirme sırasında değişiklikleri görmek için:

```bash
# Sadece backend'i yeniden başlat
docker-compose restart backend

# Sadece frontend'i yeniden başlat
docker-compose restart frontend
```
