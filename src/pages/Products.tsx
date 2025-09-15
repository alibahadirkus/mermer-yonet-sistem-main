import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, X, FileText, Eye } from "lucide-react";
import Layout from "@/components/Layout";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/components/ui/use-toast';
import PDFViewer from "@/components/PDFViewer";

const Products = () => {
  const { products, categories } = useContent();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedPDF, setSelectedPDF] = useState<string | null>(null);
  const [pdfTitle, setPdfTitle] = useState<string>("");
  
  // Get categories for filter
  const categoryOptions = ["all", ...categories.map(cat => cat.name)];
  
  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Group products by category
  const groupedProducts = filteredProducts.reduce((groups, product) => {
    const category = product.category || 'Diğer';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {} as Record<string, typeof products>);

  const handlePDFView = (pdfPath: string, productName: string) => {
    setSelectedPDF(pdfPath);
    setPdfTitle(productName);
  };

  // Handle initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-elegant font-bold mb-4"
          >
            Mermer Koleksiyonumuz
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Doğanın zarafetini mekanlarınıza taşıyan eşsiz mermer çözümlerimizi keşfedin
          </motion.p>
        </div>
      </section>
      
      {/* Filter Bar */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 h-12 text-base"
                />
              </div>
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-3">
              <div className="hidden md:block w-48">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Kategori seç" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "Tüm Kategoriler" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="md:hidden h-12 gap-2"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4" />
                Filtrele
              </Button>
              
              {(searchTerm || category !== "all") && (
                <Button 
                  variant="ghost" 
                  className="h-12 gap-1 text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setSearchTerm("");
                    setCategory("all");
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtreleri Temizle</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex md:hidden" onClick={() => setIsFilterOpen(false)}>
          <div className="bg-white w-4/5 max-w-sm h-full p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Filtreler</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Kategoriler</h4>
                <div className="grid grid-cols-2 gap-2">
                  {categoryOptions.map((cat) => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => {
                        setCategory(cat);
                        setIsFilterOpen(false);
                      }}
                    >
                      {cat === "all" ? "Tümü" : cat}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-elegant font-bold text-gray-900 mb-4">
              Ürün Kategorilerimiz
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Geniş ürün yelpazemizde her ihtiyaca uygun mermer ve taş çözümleri sunuyoruz
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => setCategory(category.name)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-marble-600 to-marble-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xl">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-marble-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-marble-100 text-marble-800">
                      {products.filter(p => p.category === category.name).length} Ürün
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products by Category */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {isInitialLoad ? (
            <div className="space-y-12">
              {[...Array(3)].map((_, categoryIndex) => (
                <div key={categoryIndex}>
                  <Skeleton className="h-8 w-48 mb-6" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="h-64 w-full rounded-none" />
                        <CardContent className="p-4 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white rounded-lg shadow-sm"
            >
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
                <p className="text-gray-500 mb-6">Arama kriterlerinize uygun ürün bulunamadı. Filtreleri sıfırlayıp tekrar deneyin.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setCategory("all");
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
                <div key={categoryName}>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-elegant font-bold text-gray-900 mb-8 text-center"
                  >
                    {categoryName}
                  </motion.h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={product.image_path}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/marble-default.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                            {product.pdf_path && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handlePDFView(product.pdf_path!, product.name)}
                                className="flex items-center gap-2"
                              >
                                <FileText className="h-4 w-4" />
                                PDF Görüntüle
                              </Button>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
                          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{product.description}</p>
                          {product.pdf_path && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePDFView(product.pdf_path!, product.name)}
                              className="w-full flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              PDF Görüntüle
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {selectedPDF && (
        <PDFViewer
          pdfUrl={selectedPDF}
          isOpen={!!selectedPDF}
          onClose={() => setSelectedPDF(null)}
          title={pdfTitle}
        />
      )}
    </Layout>
  );
};

export default Products;
