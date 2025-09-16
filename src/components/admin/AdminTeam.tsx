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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AdminNav from "./AdminNav";

const AdminTeam = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useContent();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [deletingMember, setDeletingMember] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    parent_id: "none",
    sort_order: 0,
    image: null as File | null
  });

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      department: "",
      parent_id: "none",
      sort_order: 0,
      image: null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('position', formData.position);
    data.append('department', formData.department);
    if (formData.parent_id && formData.parent_id !== 'none') {
      data.append('parent_id', formData.parent_id);
    }
    data.append('sort_order', formData.sort_order.toString());
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, data);
        setIsEditDialogOpen(false);
        setEditingMember(null);
      } else {
        await addTeamMember(data);
        setIsAddDialogOpen(false);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      department: member.department || "",
      parent_id: member.parent_id ? member.parent_id.toString() : "",
      sort_order: member.sort_order || 0,
      image: null
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deletingMember) {
      try {
        await deleteTeamMember(deletingMember.id);
        setIsDeleteDialogOpen(false);
        setDeletingMember(null);
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const openDeleteDialog = (member: any) => {
    setDeletingMember(member);
    setIsDeleteDialogOpen(true);
  };

  // Get parent options (members without parent_id)
  const parentOptions = teamMembers.filter(member => !member.parent_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Ekip Yönetimi</h2>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Ekip Üyesi Ekle
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>Pozisyon</TableHead>
                  <TableHead>Departman</TableHead>
                  <TableHead>Üst Yönetici</TableHead>
                  <TableHead>Sıra</TableHead>
                  <TableHead>Resim</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.department || "-"}</TableCell>
                    <TableCell>
                      {member.parent_id ? 
                        teamMembers.find(p => p.id === member.parent_id)?.name || "Bilinmiyor" 
                        : "Üst Yönetici"
                      }
                    </TableCell>
                    <TableCell>{member.sort_order}</TableCell>
                    <TableCell>
                      {member.image_path ? (
                        <img 
                          src={member.image_path} 
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(member)}
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
        </div>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (open) {
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Ekip Üyesi Ekle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="position">Pozisyon</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="department">Departman</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="parent_id">Üst Yönetici</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Üst yönetici seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Üst yönetici yok</SelectItem>
                  {parentOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort_order">Sıra</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="image">Resim</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">İptal</Button>
              </DialogClose>
              <Button type="submit">Ekle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingMember(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ekip Üyesini Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="edit_name">Ad Soyad</Label>
              <Input
                id="edit_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_position">Pozisyon</Label>
              <Input
                id="edit_position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_department">Departman</Label>
              <Input
                id="edit_department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_parent_id">Üst Yönetici</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Üst yönetici seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Üst yönetici yok</SelectItem>
                  {parentOptions.filter(m => m.id !== editingMember?.id).map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_sort_order">Sıra</Label>
              <Input
                id="edit_sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="edit_image">Resim</Label>
              <Input
                id="edit_image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              />
              {editingMember?.image_path && (
                <p className="text-sm text-gray-500 mt-1">
                  Mevcut resim: {editingMember.image_path}
                </p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">İptal</Button>
              </DialogClose>
              <Button type="submit">Güncelle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ekip Üyesini Sil</DialogTitle>
          </DialogHeader>
          <p>
            "{deletingMember?.name}" adlı ekip üyesini silmek istediğinizden emin misiniz?
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
            </DialogClose>
            <Button onClick={handleDelete} variant="destructive">
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTeam;
