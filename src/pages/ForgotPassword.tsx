
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { executeQuery, executeSelect, saveDatabase } from '@/utils/database';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.email || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak sama",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Check if user exists
      const users = await executeSelect(
        'SELECT * FROM users WHERE username = ? AND email = ?',
        [formData.username, formData.email]
      );

      if (users.length === 0) {
        toast({
          title: "Error",
          description: "Username atau email tidak ditemukan",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create password reset request
      executeQuery(`
        INSERT INTO password_reset_requests (user_id, username, email, new_password, status, created_at) 
        VALUES (?, ?, ?, ?, 'pending', datetime('now'))
      `, [users[0].id, formData.username, formData.email, formData.newPassword]);

      saveDatabase();

      toast({
        title: "Permintaan Berhasil",
        description: "Permintaan reset password telah dikirim. Menunggu persetujuan dari Super Admin.",
      });

      setFormData({ username: '', email: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim permintaan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30"></div>
                <div className="relative bg-white p-3 rounded-full shadow-lg">
                  <img 
                    src="/logo.png" 
                    alt="Al-Hikmah Logo" 
                    className="h-12 w-12 object-contain"
                  />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600">
              Masukkan data Anda untuk reset password
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Masukkan username"
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Masukkan email"
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    placeholder="Masukkan password baru"
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Konfirmasi password baru"
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/pengaturan" 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali ke Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
