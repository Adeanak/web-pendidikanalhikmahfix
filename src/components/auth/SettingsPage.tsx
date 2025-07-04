import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const SettingsPage = () => {
  const { user } = useAuth();

  const handleLoginSuccess = () => {
    // Login success is handled by the auth context
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
                <div className="relative bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg">
                  <img 
                    src="/logo.png" 
                    alt="Al-Hikmah Logo" 
                    className="h-16 w-16 object-contain"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Masuk ke Sistem
            </h1>
            <p className="text-gray-300 dark:text-gray-300 text-lg">
              Panel Admin Yayasan Al-Hikmah
            </p>
          </div>

          {/* Login/Register Card */}
          <Card className="backdrop-blur-sm bg-gray-800/90 dark:bg-gray-800/90 border-0 shadow-2xl">
            <CardContent className="p-0">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700/50 dark:bg-gray-700/50 rounded-t-lg h-14">
                  <TabsTrigger 
                    value="login" 
                    className="font-semibold text-base data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm data-[state=active]:text-blue-400 text-gray-300 transition-all duration-200"
                  >
                    Masuk
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="font-semibold text-base data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm data-[state=active]:text-blue-400 text-gray-300 transition-all duration-200"
                  >
                    Daftar
                  </TabsTrigger>
                </TabsList>
                
                <div className="p-8">
                  <TabsContent value="login" className="mt-0">
                    <LoginForm onLoginSuccess={handleLoginSuccess} />
                  </TabsContent>
                  
                  <TabsContent value="register" className="mt-0">
                    <RegisterForm />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-400">
              © 2025 Yayasan Al-Hikmah. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to hidden admin panel
  return <Navigate to="/sistem-admin-al-hikmah-2025" replace />;
};

export default SettingsPage;