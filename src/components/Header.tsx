import React, { useState, useEffect } from 'react';
import { Menu, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Teacher } from '@/types';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const location = useLocation();

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      setTeachers(data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  };

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Program', href: '/program' },
    { name: 'Tentang', href: '/tentang' },
    { name: 'Pengajar', href: '/pengajar' },
    { name: 'SPMB', href: '/spmb' },
    { name: 'Lulusan', href: '/lulusan' },
    { name: 'Album', href: '/album' },
  ];

  // Check if a navigation item is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm dark:bg-gray-900/95 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-4">
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Al-Hikmah Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Al-Hikmah</h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Yayasan Pendidikan</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-6 mx-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-gray-700 hover:text-hikmah-primary transition-colors duration-200 font-medium dark:text-gray-200 dark:hover:text-blue-400 px-3 py-2 rounded-md ${
                  isActive(item.href) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-hikmah-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 ${
                    isActive(item.href) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;