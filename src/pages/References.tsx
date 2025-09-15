import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useContent } from "@/contexts/ContentContext";
import { getReferences } from "@/services/api";
import type { Reference } from "@/services/api";

const References = () => {
  const { companyInfo } = useContent();
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const data = await getReferences();
        setReferences(data);
        setLoading(false);
      } catch (err) {
        setError('Referanslar yüklenirken bir hata oluştu');
        setLoading(false);
        console.error('Referanslar yüklenirken hata:', err);
      }
    };

    fetchReferences();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-marble-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-elegant font-bold mb-4">Referanslarımız</h1>
          <p className="text-lg text-marble-200">
            {companyInfo.name} olarak gerçekleştirdiğimiz başarılı projeler ve mutlu müşterilerimiz
          </p>
        </div>
      </section>

      {/* References Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {references.map((reference) => (
              <Card key={reference.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={reference.image_path} 
                    alt={reference.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/marble-default.jpg';
                    }}
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-elegant font-bold mb-2">{reference.name}</h3>
                  <p className="text-gold-600 font-medium mb-2">{reference.location}</p>
                  <p className="text-marble-600">{reference.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-marble-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1578859654394-6558734eefc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
            alt="Marble Texture" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-elegant font-bold mb-6">Projeniz İçin Bizimle İletişime Geçin</h2>
          <p className="text-marble-200 max-w-2xl mx-auto mb-8">
            Sizin için özel çözümler üretmek ve projenizi hayata geçirmek için hazırız.
          </p>
          <a href="/contact" className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-md inline-block transition-colors">
            İletişime Geçin
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default References; 