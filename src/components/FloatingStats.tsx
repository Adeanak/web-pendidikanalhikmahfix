import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLocation } from 'react-router-dom';

const FloatingStats = () => {
  const [stats, setStats] = useState({ views: 0, comments: 0, registrations: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Load initial stats
    loadStats();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateStats();
    }, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('visitor_stats')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Failed to load stats:', error);
        return;
      }
      
      if (data) {
        setStats({
          views: data.views,
          comments: data.comments,
          registrations: data.registrations
        });
      }
      
      // Increment views
      const today = new Date().toDateString();
      const lastVisit = localStorage.getItem('al-hikmah-last-visit');
      
      if (lastVisit !== today) {
        incrementViews();
        localStorage.setItem('al-hikmah-last-visit', today);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const incrementViews = async () => {
    try {
      const { data } = await supabase
        .from('visitor_stats')
        .select('views')
        .eq('id', 1)
        .single();
      
      if (data) {
        const { error } = await supabase
          .from('visitor_stats')
          .update({ views: data.views + 1, updated_at: new Date().toISOString() })
          .eq('id', 1);
        
        if (error) throw error;
        
        setStats(prev => ({ ...prev, views: prev.views + 1 }));
      }
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  const updateStats = async () => {
    try {
      // Simulate random increments
      const viewsIncrement = Math.floor(Math.random() * 2) + 1;
      const commentsIncrement = Math.random() > 0.8 ? 1 : 0;
      const registrationsIncrement = Math.random() > 0.9 ? 1 : 0;

      const newStats = {
        views: stats.views + viewsIncrement,
        comments: stats.comments + commentsIncrement,
        registrations: stats.registrations + registrationsIncrement
      };

      setStats(newStats);

      // Update database
      await supabase
        .from('visitor_stats')
        .update({
          views: newStats.views,
          comments: newStats.comments,
          registrations: newStats.registrations,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };

  // Only show on homepage
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <section className="py-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 dark:border-blue-900 p-4 md:p-6 transition-all duration-300">
          <h3 className="text-base md:text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-3 md:mb-4 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Statistik Live
          </h3>
          
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Eye className="h-3 w-3 md:h-4 md:w-4 text-blue-500 mr-1" />
                <span className={`text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 transition-all duration-300 ${
                  isAnimating ? 'scale-125' : ''
                }`}>
                  {stats.views.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pengunjung</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <MessageCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
                <span className={`text-base md:text-lg font-bold text-green-600 dark:text-green-400 transition-all duration-300 ${
                  isAnimating ? 'scale-125' : ''
                }`}>
                  {stats.comments}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Komentar</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <UserPlus className="h-3 w-3 md:h-4 md:w-4 text-purple-500 mr-1" />
                <span className={`text-base md:text-lg font-bold text-purple-600 dark:text-purple-400 transition-all duration-300 ${
                  isAnimating ? 'scale-125' : ''
                }`}>
                  {stats.registrations}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Pendaftar</p>
            </div>
          </div>
          
          <div className="mt-2 md:mt-3 text-center">
            <div className="flex items-center justify-center space-x-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Update otomatis setiap 10 detik</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FloatingStats;