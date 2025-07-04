
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!loginData.username || !loginData.password) {
      toast({
        title: "Error",
        description: "Username dan password harus diisi",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const success = await login(loginData.username, loginData.password);
      
      if (success) {
        toast({
          title: "Login Berhasil!",
          description: "Selamat datang di Sistem Al-Hikmah",
        });
        onLoginSuccess();
      } else {
        toast({
          title: "Login Gagal",
          description: "Username atau password salah",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error Sistem",
        description: "Terjadi kesalahan pada sistem",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <Input
              id="username"
              type="text"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              required
              placeholder="Masukkan username"
              className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              required
              placeholder="Masukkan password"
              className="pl-10 pr-12 h-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" /> : <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Ingat saya
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Lupa password?
          </Link>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2" 
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <LogIn className="h-5 w-5" />
              <span>Masuk</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
