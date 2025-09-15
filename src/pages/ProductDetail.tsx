
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useContent } from "@/contexts/ContentContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useContent();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ürün Bulunamadı</h2>
          <p className="mb-8">Aradığınız ürün mevcut değil.</p>
          <Button onClick={() => navigate('/products')}>
            Ürünlere Geri Dön
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Find related products (same category, excluding current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  
  return (
    <Layout>
      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link to="/products" className="flex items-center text-primary mb-8 hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Ürünlere Geri Dön
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-elegant font-bold">{product.name}</h1>
                {product.featured && (
                  <span className="bg-gold-100 text-gold-800 text-xs px-3 py-1 rounded-full">Öne Çıkan</span>
                )}
              </div>
              
              <p className="text-marble-600 text-lg mb-6">{product.category}</p>
              
              <div className="prose text-marble-800 mb-8">
                <p className="text-lg leading-relaxed">{product.description}</p>
                <p className="mt-4">
                  {product.name} mermerimiz, en kaliteli ocaklardan özenle temin edilir ve mükemmellikle işlenir. 
                  Her parça, mekanınızı gerçekten benzersiz kılan, kopyalanamaz doğal desenlere sahiptir.
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Kullanım Alanları:</h3>
                <ul className="list-disc list-inside text-marble-700 space-y-1">
                  <li>Mutfak tezgahları</li>
                  <li>Banyo lavaboları</li>
                  <li>Zemin kaplamaları</li>
                  <li>Duvar kaplamaları</li>
                  <li>Özel tasarım projeler</li>
                </ul>
              </div>
              
              <Link to="/contact">
                <Button className="bg-primary text-white w-full py-6 text-lg">
                  Bu Ürün Hakkında Bilgi Al
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-marble-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-elegant font-bold mb-8">Benzer Ürünler</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map(relProduct => (
                <Link to={`/products/${relProduct.id}`} key={relProduct.id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={relProduct.image} 
                        alt={relProduct.name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{relProduct.name}</h3>
                      <p className="text-sm text-marble-600">{relProduct.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ProductDetail;
