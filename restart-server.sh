#!/bin/bash

echo "🚀 Mermer Yönetim Sistemi - Sunucu Yeniden Başlatma"
echo "=================================================="

# Projeyi güncelle
echo "📥 Proje güncelleniyor..."
git pull origin main

# Docker container'ları durdur
echo "🛑 Docker container'ları durduruluyor..."
sudo docker-compose down

# Docker image'ları yeniden build et
echo "🔨 Docker image'ları yeniden build ediliyor..."
sudo docker-compose build --no-cache

# Docker container'ları yeniden başlat
echo "🔄 Docker container'ları başlatılıyor..."
sudo docker-compose up -d

# Container durumlarını kontrol et
echo "📊 Container durumları:"
sudo docker-compose ps

# Logları göster
echo "📋 Son loglar:"
echo "Backend logs:"
sudo docker logs mermer_backend --tail 10

echo ""
echo "Frontend logs:"
sudo docker logs mermer_frontend --tail 10

echo ""
echo "Nginx logs:"
sudo docker logs mermer_nginx --tail 10

echo ""
echo "✅ İşlem tamamlandı!"
echo "🌐 Site adresi: http://$(curl -s ifconfig.me)"
echo "🔧 Admin panel: http://$(curl -s ifconfig.me)/admin"
echo "   Kullanıcı: admin"
echo "   Şifre: admin123"
