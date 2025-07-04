import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import GraduatesPage from "./pages/GraduatesPage";
import AlbumPage from "./pages/AlbumPage";
import SPMBPage from "./pages/SPMBPage";
import ProgramsPage from "./pages/ProgramsPage";
import AboutPage from "./pages/AboutPage";
import TeachersPage from "./pages/TeachersPage";
import MessagePage from "./pages/MessagePage";
import ProgramDetailPage from "./pages/ProgramDetailPage";
import AdminPanel from "./components/admin/AdminPanel";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminAccess from "./components/auth/AdminAccess";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sistem-masuk" element={<Settings />} />
                  <Route path="/akses-admin-alhikmah" element={<AdminAccess />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/lulusan" element={<GraduatesPage />} />
                <Route path="/album" element={<AlbumPage />} />
                <Route path="/spmb" element={<SPMBPage />} />
                <Route path="/program" element={<ProgramsPage />} />
                <Route path="/program/:programId" element={<ProgramDetailPage />} />
                <Route path="/tentang" element={<AboutPage />} />
                <Route path="/pengajar" element={<TeachersPage />} />
                <Route path="/pesan" element={<MessagePage />} />
                <Route path="/sistem-admin-al-hikmah-2025/*" element={
                    <ProtectedRoute allowedRoles={['super_admin', 'ketua_yayasan', 'kepala_sekolah', 'teacher']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;