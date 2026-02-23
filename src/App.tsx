import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminPreferencesProvider } from "@/contexts/AdminPreferencesContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { TrackingScripts } from "@/components/TrackingScripts";
import Index from "./pages/Index";
import Empreendimentos from "./pages/Empreendimentos";
import EmpreendimentoDetalhes from "./pages/EmpreendimentoDetalhes";
import CasaDetalhes from "./pages/CasaDetalhes";
import Select from "./pages/Select";
import SelectCasaDetalhes from "./pages/SelectCasaDetalhes";
import CasaDetalhesUnificado from "./pages/CasaDetalhesUnificado";
import Business from "./pages/Business";
import SobreNos from "./pages/SobreNos";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contato from "./pages/Contato";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PasswordReset from "./pages/auth/PasswordReset";
import UpdatePassword from "./pages/auth/UpdatePassword";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Contatos from "./pages/admin/Contatos";
import AdminEmpreendimentos from "./pages/admin/Empreendimentos";
import EmpreendimentoForm from "./pages/admin/EmpreendimentoForm";
import AdminCasas from "./pages/admin/Casas";
import CasaForm from "./pages/admin/CasaForm";
import AdminBlog from "./pages/admin/Blog";
import BlogForm from "./pages/admin/BlogForm";
import Banners from "./pages/admin/Banners";
import BannerForm from "./pages/admin/BannerForm";
import SelectAdmin from "./pages/admin/Select";
import BusinessAdmin from "./pages/admin/Business";
import SobreNosAdmin from "./pages/admin/SobreNos";
import Configuracoes from "./pages/admin/Configuracoes";
import Perfil from "./pages/admin/Perfil";
import Preferencias from "./pages/admin/Preferencias";
import SelectCasaForm from "./pages/admin/SelectCasaForm";
import BusinessCasaForm from "./pages/admin/BusinessCasaForm";
import BusinessCasaDetalhes from "./pages/BusinessCasaDetalhes";
import Usuarios from "./pages/admin/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <TrackingScripts />
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="page-transition">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
          <Route path="/empreendimentos" element={<Empreendimentos />} />
          <Route path="/empreendimentos/:slug" element={<EmpreendimentoDetalhes />} />
          <Route path="/empreendimentos/:empreendimentoSlug/:casaSlug" element={<CasaDetalhes />} />
          <Route path="/select" element={<Select />} />
          <Route path="/select/:slug" element={<SelectCasaDetalhes />} />
          <Route path="/business" element={<Business />} />
          <Route path="/business/:slug" element={<BusinessCasaDetalhes />} />
          <Route path="/casas/:slug" element={<CasaDetalhesUnificado />} />
              <Route path="/sobre-nos" element={<SobreNos />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contato" element={<Contato />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/password-reset" element={<PasswordReset />} />
              <Route path="/auth/update-password" element={<UpdatePassword />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminPreferencesProvider>
                  <AdminLayout />
                </AdminPreferencesProvider>
              }>
                <Route index element={<Dashboard />} />
                <Route path="contatos" element={<Contatos />} />
                <Route path="empreendimentos" element={<AdminEmpreendimentos />} />
                <Route path="empreendimentos/new" element={<EmpreendimentoForm />} />
                <Route path="empreendimentos/edit/:id" element={<EmpreendimentoForm />} />
                <Route path="casas" element={<AdminCasas />} />
                <Route path="casas/new" element={<CasaForm />} />
                <Route path="casas/edit/:id" element={<CasaForm />} />
                <Route path="select" element={<SelectAdmin />} />
                <Route path="select/new" element={<SelectCasaForm />} />
                <Route path="select/edit/:id" element={<SelectCasaForm />} />
                <Route path="business" element={<BusinessAdmin />} />
                <Route path="business/new" element={<BusinessCasaForm />} />
                <Route path="business/edit/:id" element={<BusinessCasaForm />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="blog/novo" element={<BlogForm />} />
                <Route path="blog/:id" element={<BlogForm />} />
                <Route path="banners" element={<Banners />} />
                <Route path="banners/novo" element={<BannerForm />} />
                <Route path="banners/:id" element={<BannerForm />} />
                <Route path="sobre-nos" element={<SobreNosAdmin />} />
                <Route path="configuracoes" element={<Configuracoes />} />
                <Route path="perfil" element={<Perfil />} />
                <Route path="preferencias" element={<Preferencias />} />
                <Route path="usuarios" element={<Usuarios />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
