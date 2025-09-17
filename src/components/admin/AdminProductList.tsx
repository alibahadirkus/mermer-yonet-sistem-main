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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, FileText, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminProductList = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addProductsFromPdf } = useContent();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);
  const [pdfResult, setPdfResult] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "none",
    image: null as File | null,
    pdf: null as File | null
  });

  const [pdfFormData, setPdfFormData] = useState({
    pdf: null as File | null,
    category: "none"
  });

  // Categories are now loaded from the context

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "none",
      image: null,
      pdf: null
    });
  };
  
  const handleAddProduct = async () => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (formData.category && formData.category !== 'none') {
        data.append('category', formData.category);
      }
      if (formData.image) data.append('image', formData.image);
      if (formData.pdf) data.append('pdf', formData.pdf);

      await addProduct(data);
      resetForm();
      setIsAddDialogOpen(false);
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla eklendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (formData.category && formData.category !== 'none') {
        data.append('category', formData.category);
      }
      if (formData.image) data.append('image', formData.image);
      if (formData.pdf) data.append('pdf', formData.pdf);

      await updateProduct(editingProduct.id, data);
      resetForm();
      setEditingProduct(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla güncellendi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi.",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category || "none",
      image: null,
      pdf: null
    });
    setIsEditDialogOpen(true);
  };

  const handlePdfUpload = async () => {
    if (!pdfFormData.pdf) {
      toast({
        title: "Hata",
        description: "Lütfen bir PDF dosyası seçin.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = new FormData();
      data.append('pdf', pdfFormData.pdf);
      if (pdfFormData.category && pdfFormData.category !== 'none') {
        data.append('category', pdfFormData.category);
      }

      const result = await addProductsFromPdf(data);
      setPdfResult(result);
      setPdfFormData({ pdf: null, category: "none" });
      setIsPdfDialogOpen(false);
      
      toast({
        title: "Başarılı",
        description: result.message,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "PDF'den ürün eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const resetPdfForm = () => {
    setPdfFormData({ pdf: null, category: "none" });
    setPdfResult(null);
  };

  const openDeleteDialog = (product: any) => {
    setDeletingProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ürün Yönetimi</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsPdfDialogOpen(true)} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            PDF'den Ürün Ekle
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yeni Ürün Ekle
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resim</TableHead>
              <TableHead>Ürün Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>PDF</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img 
                    src={product.image_path} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/marble-default.jpg';
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                <TableCell>
                  {product.pdf_path ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(product.pdf_path, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Görüntüle
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-400">PDF yok</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(product)}
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

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle>Yeni Ürün Ekle</DialogTitle>
            </DialogHeader>
            
          <div className="space-y-4">
              <div>
              <Label htmlFor="name">Ürün Adı</Label>
                <Input
                  id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ürün adını girin"
                />
              </div>
              
              <div>
              <Label htmlFor="category">Kategori</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kategori seçin</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
              
              <div>
              <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ürün açıklamasını girin"
                  className="min-h-24"
                />
              </div>
              
              <div>
              <Label htmlFor="image">Ürün Resmi</Label>
                <Input
                  id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                />
              </div>
              
            <div>
              <Label htmlFor="pdf">PDF Dosyası (Opsiyonel)</Label>
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData({...formData, pdf: e.target.files?.[0] || null})}
              />
            </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
              <Button variant="outline">İptal</Button>
              </DialogClose>
              <Button 
                onClick={handleAddProduct}
              disabled={!formData.name || !formData.category || !formData.image}
              >
              Ürün Ekle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
                          <DialogHeader>
            <DialogTitle>Ürün Düzenle</DialogTitle>
                          </DialogHeader>
                          
          <div className="space-y-4">
                              <div>
              <Label htmlFor="edit-name">Ürün Adı</Label>
                                <Input
                                  id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ürün adını girin"
                                />
                              </div>
                              
                              <div>
              <Label htmlFor="edit-category">Kategori</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kategori seçin</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                              </div>
                              
                              <div>
              <Label htmlFor="edit-description">Açıklama</Label>
                                <Textarea
                                  id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Ürün açıklamasını girin"
                                  className="min-h-24"
                                />
                              </div>
                              
                              <div>
              <Label htmlFor="edit-image">Yeni Ürün Resmi (Opsiyonel)</Label>
                                <Input
                                  id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                                />
              {editingProduct?.image_path && (
                <p className="text-sm text-gray-500 mt-1">
                  Mevcut resim: {editingProduct.image_path}
                </p>
              )}
                              </div>
                              
            <div>
              <Label htmlFor="edit-pdf">Yeni PDF Dosyası (Opsiyonel)</Label>
              <Input
                id="edit-pdf"
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData({...formData, pdf: e.target.files?.[0] || null})}
              />
              {editingProduct?.pdf_path && (
                <p className="text-sm text-gray-500 mt-1">
                  Mevcut PDF: {editingProduct.pdf_path}
                </p>
              )}
                              </div>
                            </div>
                          
                          <DialogFooter>
                            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
                            </DialogClose>
            <Button 
              onClick={handleEditProduct}
              disabled={!formData.name || !formData.category}
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
            <DialogTitle>Ürünü Sil</DialogTitle>
                          </DialogHeader>
          
          <p>
            "{deletingProduct?.name}" ürününü silmek istediğinizden emin misiniz? 
            Bu işlem geri alınamaz.
          </p>
          
                          <DialogFooter>
                            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
                            </DialogClose>
                            <Button 
              onClick={handleDeleteProduct}
                              variant="destructive" 
                            >
              Sil
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

      {/* PDF Upload Dialog */}
      <Dialog open={isPdfDialogOpen} onOpenChange={(open) => {
        setIsPdfDialogOpen(open);
        if (!open) resetPdfForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>PDF'den Ürün Ekle</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pdf-file">PDF Dosyası</Label>
              <Input
                id="pdf-file"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFormData({...pdfFormData, pdf: e.target.files?.[0] || null})}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                PDF dosyası her sayfa için ayrı bir ürün oluşturacaktır.
              </p>
                    </div>

            <div>
              <Label htmlFor="pdf-category">Kategori</Label>
              <Select 
                value={pdfFormData.category} 
                onValueChange={(value) => setPdfFormData({...pdfFormData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Kategori seçin</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {pdfResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">İşlem Tamamlandı!</h4>
                <p className="text-green-700 text-sm mb-2">{pdfResult.message}</p>
                <div className="text-xs text-green-600">
                  <p><strong>Çıkarılan metin (ilk 200 karakter):</strong></p>
                  <p className="mt-1 font-mono bg-white p-2 rounded border">
                    {pdfResult.extractedText.substring(0, 200)}...
                  </p>
                </div>
        </div>
      )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">İptal</Button>
            </DialogClose>
            <Button 
              onClick={handlePdfUpload}
              disabled={!pdfFormData.pdf}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              PDF'den Ürün Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductList;