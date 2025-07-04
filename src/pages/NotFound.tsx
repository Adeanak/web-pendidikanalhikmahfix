
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-white mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <Link to="/">
            <Button className="flex items-center gap-2 gradient-primary">
              <Home className="h-4 w-4" />
              Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
