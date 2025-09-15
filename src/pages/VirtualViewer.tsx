import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '@/contexts/ContentContext';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Share2, Camera } from 'lucide-react';
import MarbleVisualizer3D from '@/components/MarbleVisualizer3D';

// Örnek şablonlar
const templates = {
  kitchen: [
    { 
      id: 'kitchen1', 
      name: 'Modern Mutfak', 
      image: '/images/interiors/modern-kitchen.jpg',
      maskPath: 'M 0 300 L 1000 300 L 1000 400 L 0 400 Z'
    },
    { 
      id: 'kitchen2', 
      name: 'Klasik Mutfak', 
      image: '/images/interiors/classic-kitchen.jpg',
      maskPath: 'M 0 300 L 1000 300 L 1000 400 L 0 400 Z'
    },
  ],
  livingroom: [
    {
      id: 'livingroom1',
      name: 'Modern Salon',
      image: '/images/interiors/modern-living.jpg',
      maskPath: 'M 0 500 L 1000 500 L 1000 800 L 0 800 Z'
    },
    {
      id: 'livingroom2',
      name: 'Klasik Salon',
      image: '/images/interiors/classic-living.jpg',
      maskPath: 'M 0 500 L 1000 500 L 1000 800 L 0 800 Z'
    }
  ],
  bathroom: [
    {
      id: 'bathroom1',
      name: 'Modern Banyo',
      image: '/images/interiors/modern-bathroom.jpg',
      maskPath: 'M 0 200 L 800 200 L 800 800 L 0 800 Z'
    },
    {
      id: 'bathroom2',
      name: 'Lüks Banyo',
      image: '/images/interiors/luxury-bathroom.jpg',
      maskPath: 'M 0 200 L 800 200 L 800 800 L 0 800 Z'
    }
  ],
  stairs: [
    { 
      id: 'stairs1', 
      name: 'Modern Merdiven', 
      image: '/images/interiors/modern-stairs.jpg',
      maskPath: 'M 200 100 L 800 100 L 800 700 L 200 700 Z'
    },
    { 
      id: 'stairs2', 
      name: 'Klasik Merdiven', 
      image: '/images/interiors/classic-stairs.jpg',
      maskPath: 'M 200 100 L 800 100 L 800 700 L 200 700 Z'
    },
  ],
};

// Kategoriler
const categories = [
  { id: 'COANTE', name: 'Coante' },
  { id: 'DOLOMİT', name: 'Dolomit' },
  { id: 'BEJLER', name: 'Bejler' },
  { id: 'NG STONE', name: 'NG Stone' },
  { id: 'TRAVERTEN', name: 'Traverten' },
  { id: 'MERMER', name: 'Mermer' },
  { id: 'YERLİ GRANİT', name: 'Yerli Granit' },
];

const surfaceTypes = [
  { id: 'counter', name: 'Tezgah' },
  { id: 'floor', name: 'Zemin' },
  { id: 'wall', name: 'Duvar' },
  { id: 'cabinet', name: 'Kapak' }
];

const VirtualViewer = () => {
  const { products, loading } = useContent();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compareProduct, setCompareProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState<'kitchen' | 'livingroom' | 'bathroom' | 'stairs'>('kitchen');
  const [surfaceType, setSurfaceType] = useState<'counter' | 'floor' | 'wall' | 'cabinet'>('counter');
  const [viewAngle, setViewAngle] = useState<'front' | 'side' | 'top'>('front');
  const [splitView, setSplitView] = useState(false);
  const [splitPosition, setSplitPosition] = useState(1);

  // Seçili kategoriye göre ürünleri filtrele
  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : [];

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleCompareSelect = (product) => {
    setCompareProduct(product);
    setSplitView(true);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedProduct(null);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    // Reset the selected product when changing modes
    setSelectedProduct(null);
  };

  const handleViewAngleChange = (angle: 'front' | 'side' | 'top') => {
    setViewAngle(angle);
  };

  const handleScreenshot = () => {
    // Screenshot fonksiyonu eklenecek
    console.log('Screenshot alındı');
  };

  return (
    <Layout>
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-elegant font-bold mb-4"
          >
            3D Mermer Görselleştirme
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Mermer ürünlerimizi 3 boyutlu ortamda görselleştirin ve tasarımınızı hayata geçirin
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-elegant font-bold text-center mb-8 marble-border pb-4">
          Sanal Görselleştirici
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Mekan Seçimi</h3>
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mekan seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kitchen">Mutfak</SelectItem>
                    <SelectItem value="livingroom">Salon</SelectItem>
                    <SelectItem value="bathroom">Banyo</SelectItem>
                    <SelectItem value="stairs">Merdiven</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Yüzey Seçimi</h3>
                <Select value={surfaceType} onValueChange={(value: any) => setSurfaceType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Yüzey seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {surfaceTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Görüntüleme Açısı</h3>
                <div className="flex gap-2">
                  <Button
                    variant={viewAngle === 'front' ? 'default' : 'outline'}
                    onClick={() => handleViewAngleChange('front')}
                  >
                    Önden
                  </Button>
                  <Button
                    variant={viewAngle === 'side' ? 'default' : 'outline'}
                    onClick={() => handleViewAngleChange('side')}
                  >
                    Yandan
                  </Button>
                  <Button
                    variant={viewAngle === 'top' ? 'default' : 'outline'}
                    onClick={() => handleViewAngleChange('top')}
                  >
                    Üstten
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Kategori Seçimi</label>
                  {splitView && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSplitView(false);
                        setCompareProduct(null);
                      }}
                    >
                      Karşılaştırmayı Kapat
                    </Button>
                  )}
                </div>

                <Select value={selectedCategory || ''} onValueChange={handleCategorySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Mermer Seçimi</label>
                    {selectedProduct && !splitView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSplitView(true)}
                      >
                        Karşılaştır
                      </Button>
                    )}
                  </div>

                  {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="h-32 bg-gray-200 animate-pulse" />
                          <div className="p-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : !selectedCategory ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Lütfen önce bir kategori seçin</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Bu kategoride ürün bulunamadı</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {filteredProducts.map(product => (
                        <Card 
                          key={product.id}
                          className={`cursor-pointer transition-all ${
                            (selectedProduct?.id === product.id || compareProduct?.id === product.id) ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => splitView ? handleCompareSelect(product) : handleProductSelect(product)}
                        >
                          <img
                            src={product.image_path}
                            alt={product.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-2">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">3D Görselleştirme</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleScreenshot}>
                    <Camera className="w-4 h-4 mr-2" />
                    Ekran Görüntüsü
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Paylaş
                  </Button>
                </div>
              </div>

              <MarbleVisualizer3D
                marbleTexture={selectedProduct?.image_path}
                compareTexture={compareProduct?.image_path}
                roomType={viewMode}
                surfaceType={surfaceType}
                viewAngle={viewAngle}
                splitView={splitView}
                splitPosition={splitPosition}
              />

              {/* Selected product info */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProduct && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <img
                        src={selectedProduct.image_path}
                        alt={selectedProduct.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{selectedProduct.name}</h4>
                        <p className="text-sm text-gray-600">
                          Kategori: {categories.find(c => c.id === selectedCategory)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {compareProduct && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <img
                        src={compareProduct.image_path}
                        alt={compareProduct.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-semibold">{compareProduct.name}</h4>
                        <p className="text-sm text-gray-600">
                          Kategori: {categories.find(c => c.id === selectedCategory)?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VirtualViewer; 