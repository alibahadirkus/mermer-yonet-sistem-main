# Nginx Kurulum Rehberi

Bu rehber, projeyi 80 portundan yayınlamak için Nginx kurulumunu açıklar.

## 🚀 Hızlı Kurulum

### 1. Projeyi Güncelleyin
```bash
git pull origin main
```

### 2. Docker Container'larını Başlatın
```bash
sudo docker-compose up -d
```

### 3. Nginx Kurulum Scriptini Çalıştırın
```bash
chmod +x setup-nginx.sh
sudo ./setup-nginx.sh
```

## 🔧 Manuel Kurulum

### 1. Nginx Kurulumu
```bash
sudo apt update
sudo apt install nginx -y
```

### 2. Nginx Konfigürasyonu
```bash
# Mevcut default site'ı kaldır
sudo rm -f /etc/nginx/sites-enabled/default

# Yeni konfigürasyonu kopyala
sudo cp nginx.conf /etc/nginx/sites-available/mermer-site
sudo ln -sf /etc/nginx/sites-available/mermer-site /etc/nginx/sites-enabled/

# Konfigürasyonu test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl reload nginx
```

### 3. Firewall Ayarları
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable
```

## 🌐 Erişim Adresleri

- **Ana Sayfa:** http://sunucu-ip
- **Admin Panel:** http://sunucu-ip/admin
  - Kullanıcı: `admin`
  - Şifre: `admin123`
- **API:** http://sunucu-ip/api

## 🔍 Sorun Giderme

### Nginx Durumunu Kontrol Edin
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Logları Kontrol Edin
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Docker Container'larını Kontrol Edin
```bash
sudo docker-compose ps
sudo docker-compose logs
```

### Port Kullanımını Kontrol Edin
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :8080
sudo netstat -tlnp | grep :3000
```

## 📋 Nginx Konfigürasyon Özellikleri

- **Reverse Proxy:** Frontend ve Backend'i 80 portundan yayınlar
- **Static Files:** Resimler ve PDF'ler için özel routing
- **Gzip Compression:** Dosya boyutunu küçültür
- **Security Headers:** Güvenlik başlıkları
- **Load Balancing:** Gelecekte birden fazla backend için hazır

## 🔄 Güncelleme

```bash
# Projeyi güncelle
git pull origin main

# Container'ları yeniden başlat
sudo docker-compose down
sudo docker-compose up -d

# Nginx'i yeniden başlat
sudo systemctl reload nginx
```
