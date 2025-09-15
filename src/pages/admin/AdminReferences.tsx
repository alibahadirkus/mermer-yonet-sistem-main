import React, { useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminNav from '@/components/admin/AdminNav';
import { useNavigate } from 'react-router-dom';
import { Reference } from '@/services/api';

const AdminReferences = () => {
  const { references, addReference, updateReference, deleteReference } = useContent();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    id?: number;
    name: string;
    location: string;
    description: string;
    file: File | null;
  }>({
    name: '',
    location: '',
    description: '',
    file: null
  });

  const navigate = useNavigate();

  // Sayfa yüklendiğinde admin kontrolü yap
  React.useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('location', formData.location);
      data.append('description', formData.description);
      if (formData.file) {
        data.append('image', formData.file);
      }

      if (isEditing && formData.id) {
        await updateReference(formData.id, data);
      } else {
        await addReference(data);
      }

      resetForm();
      toast({
        title: 'Başarılı',
        description: isEditing ? 'Referans güncellendi' : 'Referans eklendi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (reference: Reference) => {
    setFormData({
      id: reference.id,
      name: reference.name,
      location: reference.location,
      description: reference.description,
      file: null
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu referansı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteReference(id);
        toast({
          title: 'Başarılı',
          description: 'Referans silindi',
        });
      } catch (error) {
        toast({
          title: 'Hata',
          description: 'Referans silinirken bir hata oluştu',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      file: null
    });
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-marble-900">Referans Yönetimi</h1>
          <Button 
            variant="outline" 
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            Çıkış Yap
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni Referans
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Referans Düzenle' : 'Yeni Referans'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Firma Adı</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Konum</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Açıklama</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Görsel</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  required={!isEditing}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  İptal
                </Button>
                <Button type="submit">
                  {isEditing ? 'Güncelle' : 'Ekle'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Mevcut Referanslar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {references.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.location}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                      )}
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
                        alt={item.name} 
                        className="h-48 w-full object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReferences; 