import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Package, Newspaper, LogOut, Users, Tag, UserCheck } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

export default function AdminNav() {
  const location = useLocation();
  const { logout } = useContent();

  const navItems = [
    { to: '/admin/urunler', icon: <Package className="h-4 w-4" />, label: 'Ürünler' },
    { to: '/admin/kategoriler', icon: <Tag className="h-4 w-4" />, label: 'Kategoriler' },
    { to: '/admin/haberler', icon: <Newspaper className="h-4 w-4" />, label: 'Haberler' },
    { to: '/admin/referanslar', icon: <Users className="h-4 w-4" />, label: 'Referanslar' },
    { to: '/admin/ekip', icon: <UserCheck className="h-4 w-4" />, label: 'Ekip' },
  ];

  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-2">
          <Home className="h-5 w-5" />
          <span className="font-medium">Siteye Dön</span>
        </Link>
        
        <div className="h-6 w-px bg-gray-200 mx-2" />
        
        <div className="flex space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.to}
              asChild
              variant={location.pathname === item.to ? 'default' : 'ghost'}
              className="flex items-center space-x-2"
            >
              <Link to={item.to}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
      
      <Button
        variant="ghost"
        className="text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => {
          if (window.confirm('Çıkış yapmak istediğinize emin misiniz?')) {
            logout();
          }
        }}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Çıkış Yap
      </Button>
    </nav>
  );
}
