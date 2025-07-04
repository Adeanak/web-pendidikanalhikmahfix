import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Programs from '@/components/Programs';
import About from '@/components/About';
import SPMB from '@/components/SPMB';
import MessagesRating from '@/components/MessagesRating';
import LocationMap from '@/components/LocationMap';
import Footer from '@/components/Footer';
import FloatingStats from '@/components/FloatingStats';
import { initDatabase } from '@/utils/database';
import { supabase } from '@/lib/supabase';
import Graduates from '@/components/Graduates';
import VideoModal from '@/components/VideoModal';

const Index = () => {
  const [settings, setSettings] = useState({
    showGraduates: true,
    showSPMB: true,
    showFloatingStats: true
  });
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    initDatabase();
    loadSettings();
    // Ensure page starts at top
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Scroll to contact section if hash is present
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.log('Using default website settings');
        return;
      }
      
      if (data && data.settings) {
        setSettings({
          showGraduates: data.settings.showGraduates !== undefined ? data.settings.showGraduates : true,
          showSPMB: data.settings.showSPMB !== undefined ? data.settings.showSPMB : true,
          showFloatingStats: data.settings.showFloatingStats !== undefined ? data.settings.showFloatingStats : true
        });
        
        if (data.settings.videoProfileUrl) {
          setVideoUrl(data.settings.videoProfileUrl);
        }
      }
    } catch (error) {
      console.error('Error loading website settings:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Programs />
      <About />
      {settings.showSPMB && (
        <div id="contact">
          <SPMB />
        </div>
      )}
      {settings.showGraduates && <Graduates />}
      <MessagesRating />
      <LocationMap />
      {settings.showFloatingStats && <FloatingStats />}
      <Footer />
      
      {/* Video Modal */}
      {videoUrl && (
        <VideoModal 
          videoUrl={videoUrl} 
          isOpen={showVideoModal} 
          onClose={() => setShowVideoModal(false)} 
        />
      )}
    </div>
  );
};

export default Index;