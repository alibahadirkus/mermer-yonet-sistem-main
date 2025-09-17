import React, { useState, useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { News } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminNav from '@/components/admin/AdminNav';

const News = () => {
  const { news, addNews, updateNews, deleteNews } = useContent();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imageFile: null as File | null,
    videoFile: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      if (formData.summary) {
        formDataToSend.append('summary', formData.summary);
      }
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }
      if (formData.videoFile) {
        formDataToSend.append('video', formData.videoFile);
      }

      if (editingNews) {
        await updateNews(editingNews.id, formDataToSend);
        toast({
          title: 'Başarılı',
          description: 'Haber başarıyla güncellendi.',
        });
      } else {
        await addNews(formDataToSend);
        toast({
          title: 'Başarılı',
          description: 'Haber başarıyla eklendi.',
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (news: News) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      content: news.content,
      summary: news.summary || '',
      file: null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteNews(id);
        toast({
          title: 'Başarılı',
          description: 'Haber başarıyla silindi.',
        });
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Haber silinirken bir hata oluştu.',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      summary: '',
      imageFile: null,
      videoFile: null,
    });
    setEditingNews(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Haber Yönetimi</h1>
      
        <div className="flex justify-between items-center mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Haber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingNews ? 'Haber Düzenle' : 'Yeni Haber Ekle'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Başlık</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Özet</label>
                  <Textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">İçerik</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Resim</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Video</label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFormData({ ...formData, videoFile: e.target.files?.[0] || null })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, WebM, OGG formatları desteklenir
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  {editingNews ? 'Güncelle' : 'Ekle'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Mevcut Haberler</h2>
          
          {news.length === 0 ? (
            <p className="text-gray-500">Henüz haber eklenmemiş.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      {item.summary && <p className="text-sm text-gray-600 mt-1">{item.summary}</p>}
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  {item.image_path && (
                    <div className="mt-4">
                      <img 
                        src={item.image_path} 
                        alt={item.title} 
                        className="h-48 w-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
