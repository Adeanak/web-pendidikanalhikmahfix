import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';

const AdminAccess: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  // Secret access code (in production, this should be environment variable)
  const SECRET_CODE = 'ALHIKMAH2025ADMIN';
  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    // Check if user is blocked
    const blockTime = localStorage.getItem('admin-access-blocked');
    if (blockTime) {
      const now = new Date().getTime();
      const blocked = new Date(blockTime).getTime();
      if (now - blocked < 30 * 60 * 1000) { // 30 minutes block
        setIsBlocked(true);
      } else {
        localStorage.removeItem('admin-access-blocked');
        localStorage.removeItem('admin-access-attempts');
      }
    }

    // Get current attempts
    const savedAttempts = localStorage.getItem('admin-access-attempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      return;
    }

    if (accessCode === SECRET_CODE) {
      // Clear attempts and redirect to admin login
      localStorage.removeItem('admin-access-attempts');
      localStorage.removeItem('admin-access-blocked');
      navigate('/sistem-masuk');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('admin-access-attempts', newAttempts.toString());
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        localStorage.setItem('admin-access-blocked', new Date().toISOString());
      }
      
      setAccessCode('');
    }
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/90 border-red-500/50">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-400">Akses Diblokir</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-4">
              Terlalu banyak percobaan akses yang gagal. Silakan coba lagi dalam 30 menit.
            </p>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/90 border-0 shadow-2xl">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <CardTitle className="text-blue-400">Akses Admin</CardTitle>
          <p className="text-gray-400 text-sm">
            Masukkan kode akses untuk melanjutkan ke sistem login admin
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode" className="text-gray-300">
                Kode Akses
              </Label>
              <Input
                id="accessCode"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Masukkan kode akses"
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            
            {attempts > 0 && (
              <p className="text-red-400 text-sm">
                Percobaan gagal: {attempts}/{MAX_ATTEMPTS}
              </p>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isBlocked}
            >
              Verifikasi Akses
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-gray-400 hover:text-gray-300"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccess;