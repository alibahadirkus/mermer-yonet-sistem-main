import React from "react";
import Layout from "@/components/Layout";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Target, 
  Eye, 
  Calendar,
  Trophy,
  Factory,
  Globe,
  Laptop,
  Leaf
} from 'lucide-react';

const About = () => {
  const { companyInfo } = useContent();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-elegant font-bold text-center mb-8 marble-border pb-4">
          Hakkımızda
        </h1>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-elegant font-bold text-center mb-6 marble-border pb-2">AC Madencilik Misyon & Vizyon</h2>
            <div className="bg-marble-50 rounded-xl shadow p-6 md:p-8">
              <h3 className="text-xl font-bold text-gold-700 mb-2">Misyonumuz</h3>
              <p className="text-marble-800 mb-4">
                Çevreye saygılı olmak, sağlık ve emniyeti her zaman ön planda tutmak, kalite ve sağlamlığı temin etmek, müşteri memnuniyetini artırmak, güvenilirliği koruyarak dinamik ve hızlı çalışma performansını azimle sürdürmek, yeniliklere açık sürekli bir gelişme içinde olmaktır.
              </p>
              <h3 className="text-xl font-bold text-gold-700 mb-2">Vizyonumuz</h3>
              <p className="text-marble-800">
                Çağımızın evrensel koşullarına uyumlu bir şekilde ileriye doğru yol alırken, ülkenin kalkınması ve toplum refahına katkıda bulunan özel sektör kuruluşlarının önde gelenleri arasında yer almaktır.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-elegant font-bold mb-4">Yolculuğumuz</h2>
            <p className="text-marble-800 mb-6 leading-relaxed">
              {companyInfo.aboutText}
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-gold-100 text-gold-800 rounded-full p-2 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Misyonumuz</h3>
                  <p className="text-marble-700">{companyInfo.mission}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-gold-100 text-gold-800 rounded-full p-2 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Vizyonumuz</h3>
                  <p className="text-marble-700">{companyInfo.vision}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img 
              src="/images/marble2.jpg" 
              alt="Mermer Arka Plan" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-marble-900/80 to-transparent flex items-end p-8">
              <div className="text-white">
                <h3 className="text-2xl font-elegant font-bold mb-2">Hakkımızda</h3>
                <p className="text-marble-200">Mermer sektöründeki deneyimimiz ve kalitemiz</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      
        </div>
      </div>
    </Layout>
  );
};

export default About;
