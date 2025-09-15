
import React from "react";
import { useNavigate } from "react-router-dom";
import { useContent } from "@/contexts/ContentContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProductList from "@/components/admin/AdminProductList";
import AdminCompanyInfo from "@/components/admin/AdminCompanyInfo";
import AdminMessages from "@/components/admin/AdminMessages";

const Admin = () => {
  const { isAdmin, setIsAdmin } = useContent();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin) return null;
  
  return (
    <div className="min-h-screen bg-marble-50">
      {/* Admin Header */}
      <header className="bg-marble-900 text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 gold-gradient rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold">Yönetici Paneli</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline" 
              onClick={() => setIsAdmin(false)}
              className="text-white border-white hover:bg-marble-800"
            >
              Çıkış Yap
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-marble-800"
            >
              Siteyi Görüntüle
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products" className="px-6">Ürünler</TabsTrigger>
            <TabsTrigger value="company-info" className="px-6">Şirket Bilgileri</TabsTrigger>
            <TabsTrigger value="messages" className="px-6">Mesajlar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="bg-white p-6 rounded-lg shadow-md">
            <AdminProductList />
          </TabsContent>
          
          <TabsContent value="company-info" className="bg-white p-6 rounded-lg shadow-md">
            <AdminCompanyInfo />
          </TabsContent>
          
          <TabsContent value="messages" className="bg-white p-6 rounded-lg shadow-md">
            <AdminMessages />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
