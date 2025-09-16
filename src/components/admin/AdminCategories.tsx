import React, { useState } from "react";
import { useContent } from "@/contexts/ContentContext";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminNav from "./AdminNav";

const AdminCategories = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useContent();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: ""
    });
  };

  const handleAddCategory = async () => {
    try {
      await addCategory(formData.name, formData.description);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory.id, formData.name, formData.description);
      resetForm();
      setEditingCategory(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kategori Yönetimi</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Yeni Kategori Ekle
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kategori Adı</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Oluşturulma Tarihi</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                <TableCell>
                  {new Date(category.created_at).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(category)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Kategori Ekle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Kategori Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Kategori adını girin"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Kategori açıklamasını girin"
                className="min-h-20"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
            </DialogClose>
            <Button 
              onClick={handleAddCategory}
              disabled={!formData.name}
            >
              Kategori Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategori Düzenle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Kategori Adı</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Kategori adını girin"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Açıklama</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Kategori açıklamasını girin"
                className="min-h-20"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
            </DialogClose>
            <Button 
              onClick={handleEditCategory}
              disabled={!formData.name}
            >
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyi Sil</DialogTitle>
          </DialogHeader>
          
          <p>
            "{deletingCategory?.name}" kategorisini silmek istediğinizden emin misiniz? 
            Bu işlem geri alınamaz ve bu kategoriye ait ürünler etkilenebilir.
          </p>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
            </DialogClose>
            <Button 
              onClick={handleDeleteCategory}
              variant="destructive"
            >
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
