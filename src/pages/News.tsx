import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/contexts/ContentContext";
import VideoPlayer from "@/components/VideoPlayer";
import { Play, Image } from "lucide-react";

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
                    <VideoPlayer 
                      src={item.video_path} 
                      title={item.title}
                      className="w-full h-full"
                    />
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