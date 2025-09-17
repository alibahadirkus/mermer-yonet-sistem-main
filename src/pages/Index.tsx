import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useContent } from "@/contexts/ContentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const Index = () => {
  const { products, companyInfo } = useContent();
  const featuredProducts = products.filter(product => product.featured);
  
  return (
    <Layout>
      {/* Hero Section with Video Background */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <video 
            autoPlay 
            muted 
            loop 
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1589833870464-a77ee1183f65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
          >
            <source src="/videos/video.mp4" type="video/mp4" />
            Tarayıcınız video etiketini desteklemiyor.
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl animate-fadeIn">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-elegant text-white font-bold leading-tight mb-6 drop-shadow-lg">
              Mekanlara Zamansız Zarafet Katıyoruz
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 drop-shadow-md">
              Lüks evler ve mekanlar için premium mermer çözümleri
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-4 sm:px-8 sm:py-6 rounded-md w-full sm:w-auto">
                  Koleksiyonumuzu Keşfedin
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white hover:bg-white/20 text-white px-6 py-4 sm:px-8 sm:py-6 rounded-md w-full sm:w-auto">
                  Bize Ulaşın
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Carousel Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-elegant font-bold text-center mb-10 marble-border pb-4">
            Premium Mermer Koleksiyonumuz
          </h2>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl">
                    <img 
                      src="/images/acmaden3.jpeg" 
                      alt="Luxury Marble" 
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  <h3 className="text-center text-xl font-elegant mt-4">lola White</h3>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl">
                    <img 
  src="/images/acmaden2.jpeg"                     alt="Calacatta" 
 
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  <h3 className="text-center text-xl font-elegant mt-4">Calacatta</h3>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl">
                    <img 
  src="/images/acmaden1.jpeg"                     alt="Arcana" 
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  <h3 className="text-center text-xl font-elegant mt-4">Arcana</h3>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>
      
      {/* About Summary Section */}
      <section className="py-20 bg-marble-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl sm:text-3xl font-elegant font-bold mb-6 marble-border pb-4">{companyInfo.name} Hakkında</h2>
              <p className="text-marble-800 mb-6 leading-relaxed">
                {companyInfo.aboutText}
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-gold-500 text-gold-600 hover:bg-gold-50">
                  Hakkımızda Daha Fazla Bilgi Edinin
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 h-80 rounded-lg overflow-hidden shadow-xl">
              <img 
                src="images/marble4.jpg" 
                alt="Marble workshop" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
 
      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-elegant font-bold text-center mb-12 marble-border pb-4">
            Öne Çıkan Koleksiyonlarımız
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-elegant font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-marble-600 mb-4">{product.category}</p>
                  <p className="text-marble-800 mb-4 line-clamp-2">{product.description}</p>
                  <Link to={`/products/${product.id}`}>
                    <Button variant="outline" size="sm" className="w-full border-gold-300 text-gold-800 hover:bg-gold-50">
                      Detayları Görüntüle
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products">
              <Button className="bg-primary text-white px-8">
                Tüm Ürünleri Görüntüle
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section with Marble Background */}
      <section className="py-16 bg-marble-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1578859654394-6558734eefc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
            alt="Marble Texture" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-elegant font-bold mb-6">Mekanınızı Lüks Mermerlerle Dönüştürün</h2>
          <p className="text-marble-200 max-w-2xl mx-auto mb-8">
            Proje gereksinimlerinizi görüşmek ve ihtiyaçlarınıza uygun mükemmel mermer çözümünü keşfetmek için bugün uzman ekibimizle iletişime geçin.
          </p>
          <Link to="/contact">
            <Button className="bg-gold-500 hover:bg-gold-600 text-white px-8">
              İletişime Geçin
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
