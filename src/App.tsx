import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ContentProvider } from "@/contexts/ContentContext";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import References from "./pages/References";
import AdminLogin from "./pages/admin/Login";
import AdminProducts from "./pages/admin/Products";
import AdminNews from "./pages/admin/News";
import AdminReferences from "./pages/admin/AdminReferences";
import AdminCategories from "./pages/admin/Categories";
import AdminTeam from "./pages/admin/Team";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import VirtualViewer from '@/pages/VirtualViewer';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ContentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/references" element={<References />} />
            <Route path="/news" element={<News />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/urunler" element={<AdminProducts />} />
            <Route path="/admin/haberler" element={<AdminNews />} />
            <Route path="/admin/referanslar" element={<AdminReferences />} />
            <Route path="/admin/kategoriler" element={<AdminCategories />} />
            <Route path="/admin/ekip" element={<AdminTeam />} />
            <Route path="/virtual-viewer" element={<VirtualViewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ContentProvider>
  </QueryClientProvider>
);

export default App;
