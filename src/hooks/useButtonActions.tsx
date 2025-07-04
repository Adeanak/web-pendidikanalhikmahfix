import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export const useButtonActions = () => {
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [adminContact, setAdminContact] = useState('6289677921985');

  useEffect(() => {
    loadAdminContact();
  }, []);

  const loadAdminContact = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      if (data?.settings?.adminContact) {
        // Extract phone number from WhatsApp URL
        const phoneMatch = data.settings.adminContact.match(/\d+/);
        if (phoneMatch) {
          setAdminContact(phoneMatch[0]);
        }
      }
    } catch (error) {
      console.error('Error loading admin contact:', error);
    }
  };

  const handleRegistration = () => {
    navigate('/spmb');
  };

  const handleVideoProfile = async () => {
    try {
      // Get video URL from website settings
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const videoUrl = data?.settings?.videoProfileUrl;
      
      if (!videoUrl) {
        toast({
          title: "Video Tidak Tersedia",
          description: "Video profil belum diunggah oleh admin.",
          variant: "destructive",
        });
        return;
      }
      
      // Create modal element
      const modalContainer = document.createElement('div');
      modalContainer.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
      modalContainer.id = 'video-modal';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'relative bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden';
      
      // Create video element
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.className = 'w-full aspect-video';
      videoElement.controls = true;
      videoElement.autoplay = true;
      
      // Create close button
      const closeButton = document.createElement('button');
      closeButton.className = 'absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors';
      closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
      closeButton.onclick = () => {
        document.body.removeChild(modalContainer);
        document.body.style.overflow = 'auto';
      };
      
      // Add elements to the DOM
      modalContent.appendChild(videoElement);
      modalContent.appendChild(closeButton);
      modalContainer.appendChild(modalContent);
      document.body.appendChild(modalContainer);
      document.body.style.overflow = 'hidden';
      
      // Close modal when clicking outside
      modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
          document.body.removeChild(modalContainer);
          document.body.style.overflow = 'auto';
        }
      });
      
      toast({
        title: "Video Profil",
        description: "Membuka video profil yayasan...",
      });
    } catch (error) {
      console.error('Error opening video profile:', error);
      toast({
        title: "Error",
        description: "Gagal membuka video profil. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  const handleProgramDetail = (programId: string) => {
    // Convert program title to URL-friendly ID
    let urlId = '';
    
    if (programId.includes('PAUD') || programId.includes('Kober')) {
      urlId = 'paud';
    } else if (programId.includes('TKA') || programId.includes('TPA')) {
      urlId = 'tka-tpa';
    } else if (programId.includes('Diniyah')) {
      urlId = 'diniyah';
    } else {
      // Default fallback
      urlId = programId.toLowerCase().replace(/\s+/g, '-');
    }
    
    navigate(`/program/${urlId}`);
  };

  const handleConsultation = () => {
    const message = "Halo, saya ingin berkonsultasi tentang program pendidikan di Yayasan Al-Hikmah";
    const whatsappUrl = `https://wa.me/${adminContact}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Konsultasi Gratis",
      description: "Menghubungi admin melalui WhatsApp...",
    });
    console.log("Opening WhatsApp consultation");
  };

  const handleScheduleVisit = () => {
    const message = "Halo, saya ingin mengatur jadwal kunjungan ke Yayasan Al-Hikmah";
    const whatsappUrl = `https://wa.me/${adminContact}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Jadwal Kunjungan",
      description: "Menghubungi admin untuk mengatur jadwal kunjungan...",
    });
    console.log("Schedule visit via WhatsApp");
  };

  const handleOnlineRegistration = () => {
    navigate('/spmb');
  };

  const handleDownloadBrochure = async () => {
    try {
      // Show loading toast
      toast({
        title: "Memproses",
        description: "Sedang mengambil brosur...",
      });

      // Get brochure URL from website settings
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      
      const brochureUrl = data?.settings?.brochureUrl;
      
      if (!brochureUrl) {
        // If no brochure URL is set, use a default PDF
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKEJyb3N1ciBZYXlhc2FuIEFsLUhpa21haCkKL0NyZWF0b3IgKFlheWFzYW4gQWwtSGlrbWFoKQovUHJvZHVjZXIgKFlheWFzYW4gQWwtSGlrbWFoKQovQ3JlYXRpb25EYXRlIChEOjIwMjQwMTAxMTIwMDAwKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs0IDAgUl0KPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA1IDAgUgo+Pgo+PgovQ29udGVudHMgNiAwIFIKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoyIDc1MiBUZAooQnJvc3VyIFlheWFzYW4gQWwtSGlrbWFoKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA3CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMTU4IDAwMDAwIG4gCjAwMDAwMDAyMDggMDAwMDAgbiAKMDAwMDAwMDI2MyAwMDAwMCBuIAowMDAwMDAwNDI2IDAwMDAwIG4gCjAwMDAwMDA0ODMgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA3Ci9Sb290IDIgMCBSCi9JbmZvIDEgMCBSCj4+CnN0YXJ0eHJlZgo1NzUKJSVFT0Y=';
        link.download = 'Brosur-Yayasan-Al-Hikmah.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Berhasil",
          description: "Brosur yayasan berhasil didownload!",
        });
        return;
      }
      
      // Download the brochure from the URL
      const response = await fetch(brochureUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Brosur-Yayasan-Al-Hikmah.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Berhasil",
        description: "Brosur yayasan berhasil didownload!",
      });
    } catch (error) {
      console.error('Error downloading brochure:', error);
      toast({
        title: "Error",
        description: "Gagal mengunduh brosur. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  const handleContactAlumni = () => {
    toast({
      title: "Hubungi Alumni",
      description: "Menghubungi jaringan alumni...",
    });
    console.log("Contact alumni network");
  };

  const handleContactAdmin = () => {
    const message = "Halo Admin, saya ingin bertanya tentang Yayasan Al-Hikmah";
    const whatsappUrl = `https://wa.me/${adminContact}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Hubungi Admin",
      description: "Menghubungi admin melalui WhatsApp...",
    });
    console.log("Contact admin via WhatsApp");
  };

  return {
    handleRegistration,
    handleVideoProfile,
    handleProgramDetail,
    handleConsultation,
    handleScheduleVisit,
    handleOnlineRegistration,
    handleDownloadBrochure,
    handleContactAlumni,
    handleContactAdmin,
  };
};

export default useButtonActions;