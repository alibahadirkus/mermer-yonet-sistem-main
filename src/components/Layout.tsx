import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Navigation from './Navigation';
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";
import { Menu, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { companyInfo, isAdmin, setIsAdmin } = useContent();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/products', label: 'Ürünlerimiz' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/team', label: 'Ekibimiz' },
    { href: '/references', label: 'Referanslarımız' },
    { href: '/news', label: 'Haberler' },
    { href: '/contact', label: 'İletişim' },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b border-marble-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/ae66d9f3-34f6-4152-babb-d29ecf4dd8f4.png" 
                alt="AC Madencilik Logo" 
                className="h-10 w-auto"
              />
            </div>
            <h1 className="text-xl font-elegant font-bold tracking-wide text-marble-950">{companyInfo.name}</h1>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href} 
                className={`text-marble-800 hover:text-gold-600 transition-colors ${isActive(item.href) ? 'font-semibold border-b-2 border-gold-500' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-marble-800 hover:text-gold-600 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
              onClick={() => {
                console.log('Menu button clicked, current state:', isMobileMenuOpen);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-marble-100 shadow-lg z-20">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href} 
                  className={`text-marble-800 hover:text-gold-600 transition-colors py-2 px-4 rounded-md ${isActive(item.href) ? 'bg-gold-50 font-semibold text-gold-600' : 'hover:bg-gray-50'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-marble-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-elegant text-lg mb-4 text-gold-300">{companyInfo.name} Hakkında</h3>
              <p className="text-marble-200 text-sm">{companyInfo.description}</p>
            </div>
            
            <div>
              <h3 className="font-elegant text-lg mb-4 text-gold-300">Hızlı Linkler</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-marble-200 hover:text-gold-300 text-sm transition-colors">Ana Sayfa</Link></li>
                <li><Link to="/products" className="text-marble-200 hover:text-gold-300 text-sm transition-colors">Ürünlerimiz</Link></li>
                <li><Link to="/about" className="text-marble-200 hover:text-gold-300 text-sm transition-colors">Hakkımızda</Link></li>
                <li><Link to="/team" className="text-marble-200 hover:text-gold-300 text-sm transition-colors">Ekibimiz</Link></li>
                <li><Link to="/contact" className="text-marble-200 hover:text-gold-300 text-sm transition-colors">İletişim</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-elegant text-lg mb-4 text-gold-300">İletişim</h3>
              <address className="not-italic text-sm">
                <p className="text-marble-200 mb-1">{companyInfo.address}</p>
                <p className="text-marble-200 mb-1">Telefon: {companyInfo.phone}</p>
                <p className="text-marble-200">E-posta: {companyInfo.email}</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-marble-700 mt-8 pt-4 text-center text-sm text-marble-400">
            <p>&copy; {new Date().getFullYear()} {companyInfo.name}. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
