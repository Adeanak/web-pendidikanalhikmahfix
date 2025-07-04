import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, UserPlus, RefreshCw, User, Mail, Shield, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { executeQuery, executeSelect, saveDatabase } from '@/utils/database';

const RegisterForm: React.FC = () => {
  const [registerData, setRegisterData] = useState({
    username: '', password: '', confirmPassword: '', name: '', email: '', role: 'teacher'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState({ question: '', answer: 0, userAnswer: '' });

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    switch (operator) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case '*': answer = num1 * num2; break;
      default: answer = num1 + num2;
    }
    
    setCaptcha({
      question: `${num1} ${operator} ${num2} = ?`,
      answer,
      userAnswer: ''
    });
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!registerData.name || !registerData.username || !registerData.password || !registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak sama",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (parseInt(captcha.userAnswer) !== captcha.answer) {
      toast({
        title: "Error",
        description: "Jawaban captcha salah",
        variant: "destructive",
      });
      generateCaptcha();
      setLoading(false);
      return;
    }

    try {
      const existingUsers = await executeSelect(
        'SELECT * FROM users WHERE username = ?',
        [registerData.username]
      );

      if (existingUsers.length > 0) {
        toast({
          title: "Registrasi Gagal",
          description: "Username sudah digunakan",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      executeQuery(`
        INSERT INTO users (username, password, role, name, email) 
        VALUES (?, ?, ?, ?, ?)
      `, [registerData.username, registerData.password, registerData.role, registerData.name, registerData.email]);

      const userResult = executeSelect('SELECT id FROM users WHERE username = ?', [registerData.username]);
      const userId = userResult[0]?.id;

      if (userId) {
        executeQuery(`
          INSERT INTO permissions (user_id, can_edit_students, can_edit_teachers, can_edit_graduates, can_view_reports, can_manage_ppdb) 
          VALUES (?, 0, 0, 0, 0, 0)
        `, [userId]);
      }

      saveDatabase();

      toast({
        title: "Registrasi Berhasil",
        description: "Akun Anda telah dibuat. Menunggu persetujuan dari Super Admin.",
      });

      setRegisterData({ username: '', password: '', confirmPassword: '', name: '', email: '', role: 'teacher' });
      generateCaptcha();
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Buat Akun Baru</h2>
        <p className="text-gray-600 dark:text-gray-300">Bergabunglah dengan sistem Al-Hikmah</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                id="name"
                type="text"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                required
                placeholder="Masukkan nama lengkap"
                className="pl-10 h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                id="email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                placeholder="Masukkan email"
                className="pl-10 h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</Label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 z-10" />
            <Select 
              value={registerData.role} 
              onValueChange={(value) => setRegisterData({...registerData, role: value})}
            >
              <SelectTrigger className="pl-10 h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ketua_yayasan">Ketua Yayasan</SelectItem>
                <SelectItem value="kepala_sekolah">Kepala Sekolah</SelectItem>
                <SelectItem value="teacher">Pengajar</SelectItem>
                <SelectItem value="parent">Wali Santri</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              id="username"
              type="text"
              value={registerData.username}
              onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
              required
              placeholder="Masukkan username"
              className="pl-10 h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                required
                placeholder="Masukkan password"
                className="pl-10 pr-10 h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" /> : <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Konfirmasi Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                required
                placeholder="Masukkan ulang password"
                className="pl-10 pr-10 h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400 dark:text-gray-500" /> : <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Verifikasi (Captcha)</Label>
          <div className="flex items-center space-x-3">
            <div className="flex-1 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-2 border-dashed border-blue-200 dark:border-gray-500 text-center">
              <span className="font-mono text-lg font-bold text-gray-700 dark:text-gray-200">{captcha.question}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateCaptcha}
              className="px-3 h-11 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Input
            type="number"
            value={captcha.userAnswer}
            onChange={(e) => setCaptcha({...captcha, userAnswer: e.target.value})}
            required
            placeholder="Masukkan jawaban"
            className="h-11 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
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
              <UserPlus className="h-5 w-5" />
              <span>Daftar</span>
            </>
          )}
        </Button>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-300 text-sm font-bold">!</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">Catatan Penting</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                Akun Anda perlu disetujui oleh Super Admin untuk mendapatkan akses penuh ke sistem.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
