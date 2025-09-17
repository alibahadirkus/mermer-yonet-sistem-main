import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/contexts/ContentContext";
import VideoPlayer from "@/components/VideoPlayer";
import { Play, Image, ExternalLink } from "lucide-react";
import { getVideoEmbedUrl, isVideoLink, getVideoThumbnail } from "@/utils/videoUtils";

const News = () => {
  const { companyInfo, news } = useContent();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});


  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-marble-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-elegant font-bold mb-4">Haberler</h1>
          <p className="text-lg text-marble-200">
            {companyInfo.name} ile ilgili güncel haberler ve gelişmeler
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  {item.video_path ? (
                    <video 
                      src={item.video_path} 
                      controls 
                      className="w-full h-full object-cover"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0
                      }}
                      onError={(e) => {
                        console.error('Video yükleme hatası:', e);
                        const target = e.target as HTMLVideoElement;
                        target.style.display = 'none';
                        // Hata durumunda resim göster
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <div class="text-center">
                                <p class="text-sm">Video yüklenemedi</p>
                                <p class="text-xs">Desteklenen formatlar: MP4, WebM, OGG</p>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    >
                      Tarayıcınız video etiketini desteklemiyor.
                    </video>
                  ) : item.video_link && isVideoLink(item.video_link) ? (
                    <div className="w-full h-full relative">
                      <iframe
                        src={getVideoEmbedUrl(item.video_link) || ''}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={item.title}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <a
                            href={item.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-500 text-white px-3 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-red-600 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Orijinal Videoyu Aç
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={item.image_path} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x400?text=Resim+Yok';
                        handleImageError(item.id.toString());
                      }}
                    />
                  )}
                  
                  {/* Media Type Indicator */}
                  <div className="absolute top-2 right-2">
                    {item.video_path ? (
                      <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        Video
                      </div>
                    ) : item.video_link ? (
                      <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Link
                      </div>
                    ) : (
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        Resim
                      </div>
                    )}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-marble-600 mb-2">
                    {new Date(item.created_at).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {item.summary && <p className="text-marble-700">{item.summary}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-marble-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-elegant font-bold mb-6">Güncel Haberlerden Haberdar Olun</h2>
          <p className="text-marble-600 max-w-2xl mx-auto mb-8">
            E-posta listemize katılın, {companyInfo.name} ile ilgili en güncel haberleri ve gelişmeleri ilk siz öğrenin.
          </p>
          <a href="/contact" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-md inline-block transition-colors">
            İletişime Geçin
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default News; 