import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/products', label: 'Ürünler' },
    { href: '/applications', label: 'Uygulamalar' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/team', label: 'Takımımız' },
    { href: '/contact', label: 'İletişim' },
    { href: '/virtual-viewer', label: 'Sanal Görselleştirme' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gold-800">AC Madencilik</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  ${location.pathname === item.href
                    ? 'bg-gold-100 text-gold-800'
                    : 'text-gray-700 hover:text-gold-800'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
