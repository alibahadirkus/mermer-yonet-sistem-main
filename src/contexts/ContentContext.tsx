import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product, News, Category, TeamMember, getProducts, addProduct, updateProduct, deleteProduct, getNews, addNews, updateNews, deleteNews, getReferences, addReference, updateReference, deleteReference, getCategories, addCategory, updateCategory, deleteCategory, getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../services/api';

// Types
export interface CompanyInfo {
  name: string;
  description: string;
  foundedYear: number;
  aboutText: string;
  mission: string;
  vision: string;
  address: string;
  phone: string;
  email: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  featured: boolean;
}

interface ContentContextType {
  products: Product[];
  applications: Application[];
  companyInfo: CompanyInfo;
  messages: ContactMessage[];
  news: News[];
  references: Reference[];
  categories: Category[];
  teamMembers: TeamMember[];
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  addProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: number, formData: FormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addApplication: (application: Omit<Application, 'id'>) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  updateCompanyInfo: (updates: Partial<CompanyInfo>) => void;
  addMessage: (message: Omit<ContactMessage, 'id'>) => void;
  deleteMessage: (id: string) => void;
  markMessageAsRead: (id: string) => void;
  addNews: (formData: FormData) => Promise<void>;
  updateNews: (id: number, formData: FormData) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
  addReference: (formData: FormData) => Promise<void>;
  updateReference: (id: number, formData: FormData) => Promise<void>;
  deleteReference: (id: number) => Promise<void>;
  addCategory: (name: string, description: string) => Promise<void>;
  updateCategory: (id: number, name: string, description: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  addTeamMember: (formData: FormData) => Promise<void>;
  updateTeamMember: (id: number, formData: FormData) => Promise<void>;
  deleteTeamMember: (id: number) => Promise<void>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Default values
const defaultCompanyInfo: CompanyInfo = {
  name: "AC Madencilik",
  description: "Mermer ve taş ürünleri satışı ve ihracatı ile faaliyet gösteren profesyonel bir madencilik şirketi.",
  foundedYear: 2008,
  aboutText: "AC Madencilik, 2008 yılında kurulan mermer sektöründeki öncü şirketlerden biridir. Yıllar boyunca kazandığı deneyim ve modern teknolojilerle birlikte sektörde öne çıkmıştır.",
  mission: "Mekanları zamansız sanat eserlerine dönüştüren olağanüstü mermer ürünleri sunmak.",
  vision: "Mermer mükemmelliği ve yeniliği için küresel standart olmak.",
  address: "Bandırma, Balıkesir",
  phone: "+90 266 715 42 80",
  email: "info@acmadencilik.com.tr"
};

const defaultApplications: Application[] = [
  {
    id: "1",
    name: "Mermer Katalog Uygulaması",
    description: "Tüm mermer ürünlerinizi tek bir yerde görüntüleyin",
    image: "https://images.unsplash.com/photo-1606744837755-ba900e135c7a",
    category: "UYGULAMA",
    featured: true
  },
  {
    id: "2",
    name: "Raporlama Sistemi",
    description: "Tüm raporlarınızı kolayca oluşturun ve yönetin",
    image: "https://images.unsplash.com/photo-1606298855672-1c604a2a85fb",
    category: "UYGULAMA",
    featured: false
  }
];

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [references, setReferences] = useState<Reference[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window !== 'undefined') {
      const savedApps = localStorage.getItem('applications');
      return savedApps ? JSON.parse(savedApps) : defaultApplications;
    }
    return defaultApplications;
  });
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    if (typeof window !== 'undefined') {
      const savedCompanyInfo = localStorage.getItem('companyInfo');
      return savedCompanyInfo ? JSON.parse(savedCompanyInfo) : defaultCompanyInfo;
    }
    return defaultCompanyInfo;
  });
  
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('messages');
      return savedMessages ? JSON.parse(savedMessages) : [];
    }
    return [];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching content from API...');
      const [productsData, newsData, referencesData, categoriesData, teamData] = await Promise.all([
        getProducts(),
        getNews(),
        getReferences(),
        getCategories(),
        getTeamMembers()
      ]);
      console.log('Products fetched:', productsData);
      console.log('Categories fetched:', categoriesData);
      setProducts(productsData);
      setNews(newsData);
      setReferences(referencesData);
      setCategories(categoriesData);
      setTeamMembers(teamData);
      setError(null);
    } catch (err) {
      setError('İçerik yüklenirken bir hata oluştu');
      console.error('İçerik yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData: FormData) => {
    try {
      const newProduct = await addProduct(formData);
      setProducts(prev => [...prev, newProduct]);
      
      toast({
        title: 'Başarılı',
        description: 'Ürün başarıyla eklendi.',
      });
    } catch (err) {
      setError('Ürün eklenirken bir hata oluştu');
      throw err;
    }
  };

  const handleUpdateProduct = async (id: number, formData: FormData) => {
    try {
      const updatedProduct = await updateProduct(id, formData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      
      toast({
        title: 'Başarılı',
        description: 'Ürün başarıyla güncellendi.',
      });
    } catch (err) {
      setError('Ürün güncellenirken bir hata oluştu');
      throw err;
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      
      toast({
        title: 'Başarılı',
        description: 'Ürün başarıyla silindi.',
      });
    } catch (err) {
      setError('Ürün silinirken bir hata oluştu');
      throw err;
    }
  };

  const handleAddNews = async (formData: FormData) => {
    try {
      const newNews = await addNews(formData);
      setNews(prev => [...prev, newNews]);
      
      toast({
        title: 'Başarılı',
        description: 'Haber başarıyla eklendi.',
      });
    } catch (err) {
      setError('Haber eklenirken bir hata oluştu');
      throw err;
    }
  };

  const handleUpdateNews = async (id: number, formData: FormData) => {
    try {
      const updatedNews = await updateNews(id, formData);
      setNews(prev => prev.map(n => n.id === id ? updatedNews : n));
      
      toast({
        title: 'Başarılı',
        description: 'Haber başarıyla güncellendi.',
      });
    } catch (err) {
      setError('Haber güncellenirken bir hata oluştu');
      throw err;
    }
  };

  const handleDeleteNews = async (id: number) => {
    try {
      await deleteNews(id);
      setNews(prev => prev.filter(n => n.id !== id));
      
      toast({
        title: 'Başarılı',
        description: 'Haber başarıyla silindi.',
      });
    } catch (err) {
      setError('Haber silinirken bir hata oluştu');
      throw err;
    }
  };

  const handleAddReference = async (formData: FormData) => {
    try {
      const newReference = await addReference(formData);
      setReferences(prev => [...prev, newReference]);
      
      toast({
        title: 'Başarılı',
        description: 'Referans başarıyla eklendi.',
      });
    } catch (err) {
      setError('Referans eklenirken bir hata oluştu');
      throw err;
    }
  };

  const handleUpdateReference = async (id: number, formData: FormData) => {
    try {
      const updatedReference = await updateReference(id, formData);
      setReferences(prev => prev.map(r => r.id === id ? updatedReference : r));
      
      toast({
        title: 'Başarılı',
        description: 'Referans başarıyla güncellendi.',
      });
    } catch (err) {
      setError('Referans güncellenirken bir hata oluştu');
      throw err;
    }
  };

  const handleDeleteReference = async (id: number) => {
    try {
      await deleteReference(id);
      setReferences(prev => prev.filter(r => r.id !== id));
      
      toast({
        title: 'Başarılı',
        description: 'Referans başarıyla silindi.',
      });
    } catch (err) {
      setError('Referans silinirken bir hata oluştu');
      throw err;
    }
  };

  const handleAddCategory = async (name: string, description: string) => {
    try {
      const newCategory = await addCategory(name, description);
      setCategories(prev => [...prev, newCategory]);
      
      toast({
        title: 'Başarılı',
        description: 'Kategori başarıyla eklendi.',
      });
    } catch (err) {
      setError('Kategori eklenirken bir hata oluştu');
      throw err;
    }
  };

  const handleUpdateCategory = async (id: number, name: string, description: string) => {
    try {
      const updatedCategory = await updateCategory(id, name, description);
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
      
      toast({
        title: 'Başarılı',
        description: 'Kategori başarıyla güncellendi.',
      });
    } catch (err) {
      setError('Kategori güncellenirken bir hata oluştu');
      throw err;
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: 'Başarılı',
        description: 'Kategori başarıyla silindi.',
      });
    } catch (err) {
      setError('Kategori silinirken bir hata oluştu');
      throw err;
    }
  };

  const updateCompanyInfo = (updates: Partial<CompanyInfo>) => {
    setCompanyInfo(prev => {
      const newInfo = { ...prev, ...updates };
      localStorage.setItem('companyInfo', JSON.stringify(newInfo));
      return newInfo;
    });
  };

  const addMessage = (message: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...message,
      date: new Date().toISOString(),
      read: false
    };
    setMessages(prev => {
      const newMessages = [...prev, newMessage];
      localStorage.setItem('messages', JSON.stringify(newMessages));
      return newMessages;
    });
  };

  const markMessageAsRead = (id: string) => {
    setMessages(prev => {
      const newMessages = prev.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      );
      localStorage.setItem('messages', JSON.stringify(newMessages));
      return newMessages;
    });
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => {
      const newMessages = prev.filter(msg => msg.id !== id);
      localStorage.setItem('messages', JSON.stringify(newMessages));
      return newMessages;
    });
  };

  const login = (username: string, password: string) => {
    // Basit bir admin kontrolü
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  // Team functions
  const handleAddTeamMember = async (formData: FormData) => {
    try {
      const newTeamMember = await addTeamMember(formData);
      setTeamMembers(prev => [...prev, newTeamMember]);
      toast({
        title: "Başarılı",
        description: "Ekip üyesi başarıyla eklendi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ekip üyesi eklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTeamMember = async (id: number, formData: FormData) => {
    try {
      const updatedTeamMember = await updateTeamMember(id, formData);
      setTeamMembers(prev => prev.map(member => 
        member.id === id ? updatedTeamMember : member
      ));
      toast({
        title: "Başarılı",
        description: "Ekip üyesi başarıyla güncellendi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ekip üyesi güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    try {
      await deleteTeamMember(id);
      setTeamMembers(prev => prev.filter(member => member.id !== id));
      toast({
        title: "Başarılı",
        description: "Ekip üyesi başarıyla silindi",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Ekip üyesi silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const value = {
    products,
    applications,
    companyInfo,
    messages,
    news,
    references,
    categories,
    teamMembers,
    isAdmin,
    setIsAdmin,
    addProduct: handleAddProduct,
    updateProduct: handleUpdateProduct,
    deleteProduct: handleDeleteProduct,
    addApplication: (application: Omit<Application, 'id'>) => {
      const newApplication = { ...application, id: Date.now().toString() };
      setApplications(prev => {
        const newApps = [...prev, newApplication];
        localStorage.setItem('applications', JSON.stringify(newApps));
        return newApps;
      });
    },
    updateApplication: (id: string, updates: Partial<Application>) => {
      setApplications(prev => {
        const newApps = prev.map(app => 
          app.id === id ? { ...app, ...updates } : app
        );
        localStorage.setItem('applications', JSON.stringify(newApps));
        return newApps;
      });
    },
    deleteApplication: (id: string) => {
      setApplications(prev => {
        const newApps = prev.filter(app => app.id !== id);
        localStorage.setItem('applications', JSON.stringify(newApps));
        return newApps;
      });
    },
    updateCompanyInfo,
    addMessage,
    deleteMessage,
    markMessageAsRead,
    addNews: handleAddNews,
    updateNews: handleUpdateNews,
    deleteNews: handleDeleteNews,
    addReference: handleAddReference,
    updateReference: handleUpdateReference,
    deleteReference: handleDeleteReference,
    addCategory: handleAddCategory,
    updateCategory: handleUpdateCategory,
    deleteCategory: handleDeleteCategory,
    addTeamMember: handleAddTeamMember,
    updateTeamMember: handleUpdateTeamMember,
    deleteTeamMember: handleDeleteTeamMember,
    login,
    logout,
    loading,
    error
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
