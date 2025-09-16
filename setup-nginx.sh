#!/bin/bash

# Nginx kurulum ve konfigürasyon scripti

echo "🚀 Nginx kurulumu başlatılıyor..."

# Sistem güncellemesi
sudo apt update

# Nginx kurulumu
sudo apt install nginx -y

# Nginx servisini başlat
sudo systemctl start nginx
sudo systemctl enable nginx

# Firewall ayarları
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable

# Mevcut default site'ı devre dışı bırak
sudo rm -f /etc/nginx/sites-enabled/default

# Nginx konfigürasyonunu kopyala
sudo cp nginx.conf /etc/nginx/sites-available/mermer-site
sudo ln -sf /etc/nginx/sites-available/mermer-site /etc/nginx/sites-enabled/

# Nginx konfigürasyonunu test et
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx konfigürasyonu başarılı!"
    
    # Nginx'i yeniden başlat
    sudo systemctl reload nginx
    
    echo "🎉 Nginx kurulumu tamamlandı!"
    echo "📝 Site adresiniz: http://$(curl -s ifconfig.me)"
    echo "🔧 Admin panel: http://$(curl -s ifconfig.me)/admin"
    echo "   Kullanıcı: admin"
    echo "   Şifre: admin123"
    echo ""
    echo "🌐 Erişim adresleri:"
    echo "   Ana sayfa: http://$(curl -s ifconfig.me)"
    echo "   Admin panel: http://$(curl -s ifconfig.me)/admin"
    echo "   API: http://$(curl -s ifconfig.me)/api"
else
    echo "❌ Nginx konfigürasyon hatası!"
    exit 1
fi
