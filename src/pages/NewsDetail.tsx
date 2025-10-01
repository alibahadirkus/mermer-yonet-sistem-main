import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Image, Play, ExternalLink } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { News } from "@/services/api";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
          throw new Error('Haber bulunamadı');
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marble-600 mx-auto mb-4"></div>
            <p className="text-marble-600">Haber yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !news) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-marble-800 mb-4">Haber Bulunamadı</h1>
            <p className="text-marble-600 mb-6">{error || 'Aradığınız haber bulunamadı.'}</p>
            <Button onClick={() => navigate('/news')} className="bg-marble-600 hover:bg-marble-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Haberlere Dön
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-marble-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <Button 
            onClick={() => navigate('/news')} 
            variant="ghost" 
            className="text-white hover:text-marble-200 hover:bg-marble-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Haberlere Dön
          </Button>
          <h1 className="text-4xl md:text-5xl font-elegant font-bold mb-4">{news.title}</h1>
          <div className="flex items-center gap-4 text-marble-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(news.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="overflow-hidden">
            {/* Media Section */}
            {(news.image_path || news.video_path || news.video_link) && (
              <div className="relative">
                {news.video_path ? (
                  <div className="relative">
                    <VideoPlayer 
                      src={news.video_path} 
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Video
                      </div>
                    </div>
                  </div>
                ) : news.video_link ? (
                  <div className="relative">
                    <iframe
                      src={news.video_link}
                      className="w-full h-96"
                      title={news.title}
                      allowFullScreen
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Harici Video
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={news.image_path}
                      alt={news.title}
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Resim
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <CardContent className="p-8">
              {/* Summary */}
              {news.summary && (
                <div className="mb-6 p-4 bg-marble-50 rounded-lg border-l-4 border-marble-300">
                  <h3 className="font-semibold text-marble-800 mb-2">Özet</h3>
                  <p className="text-marble-700">{news.summary}</p>
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  className="text-marble-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>

              {/* Back Button */}
              <div className="mt-8 pt-6 border-t border-marble-200">
                <Button 
                  onClick={() => navigate('/news')} 
                  variant="outline"
                  className="bg-white hover:bg-marble-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tüm Haberlere Dön
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default NewsDetail;
