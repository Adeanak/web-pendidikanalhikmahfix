import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useButtonTexts } from '@/hooks/useButtonTexts';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { buttonTexts } = useButtonTexts();
  const [footerText, setFooterText] = useState('© 2025 Yayasan Pendidikan Al-Hikmah. All rights reserved.');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '#',
    instagram: '#',
    youtube: '#',
    twitter: '#'
  });
  const [developerContact, setDeveloperContact] = useState('https://wa.me/6285324142332');
  const [adminContact, setAdminContact] = useState('https://wa.me/6289677921985');
  const [contactPhone, setContactPhone] = useState('089677921985');
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.log('Using default footer text');
        return;
      }
      
      if (data && data.settings) {
        if (data.settings.footerText) {
          setFooterText(data.settings.footerText);
        }
        
        if (data.settings.socialMedia) {
          setSocialLinks({
            facebook: data.settings.socialMedia.facebook || '#',
            instagram: data.settings.socialMedia.instagram || '#',
            youtube: data.settings.socialMedia.youtube || '#',
            twitter: data.settings.socialMedia.twitter || '#'
          });
        }
        
        if (data.settings.developerContact) {
          setDeveloperContact(data.settings.developerContact);
        }
        
        if (data.settings.adminContact) {
          setAdminContact(data.settings.adminContact);
        }
        
        if (data.settings.contactPhone) {
          setContactPhone(data.settings.contactPhone);
        }
      }
    } catch (error) {
      console.error('Error loading website settings:', error);
    }
  };

  const programs = [
    { name: 'TKA/TPA', href: '/program/tka-tpa' },
    { name: 'Kober/PAUD', href: '/program/paud' },
    { name: 'Madrasah Diniyah', href: '/program/diniyah' },
  ];

  const quickLinks = [
    { name: 'Tentang Kami', href: '/tentang' },
    { name: 'Program', href: '/program' },
    { name: 'SPMB', href: '/spmb' },
    { name: 'Alumni', href: '/lulusan' },
    { name: 'Kontak', href: '/#contact' },
  ];

  return (
    <footer className="bg-gray-900 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="Al-Hikmah Logo" 
                  className="h-10 w-10 md:h-14 md:w-14 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold">Al-Hikmah</h3>
                <p className="text-gray-400 text-xs md:text-sm">Yayasan Pendidikan</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base">
              Membentuk generasi Qurani yang berakhlak mulia melalui pendidikan Islam yang berkualitas dan penuh kasih sayang.
            </p>
            <div className="flex space-x-3 md:space-x-4">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:text-blue-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:text-pink-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:text-red-600 transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:text-blue-400 transition-colors duration-200"
                aria-label="Twitter (X)"
              >
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Program Kami</h4>
            <ul className="space-y-2 md:space-y-3">
              {programs.map((program) => (
                <li key={program.name}>
                  <Link
                    to={program.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center text-sm md:text-base"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mr-2 md:mr-3"></div>
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Tautan Cepat</h4>
            <ul className="space-y-2 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center text-sm md:text-base"
                  >
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full mr-2 md:mr-3"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6">Hubungi Kami</h4>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm md:text-base">
                    Kp. Tanjung RT 03 RW 07<br />
                    Desa Tanjungsari<br />
                    Kecamatan Cangkuang<br />
                    Kabupaten Bandung
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 md:h-5 md:w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm md:text-base">{contactPhone}</p>
                  <a 
                    href={adminContact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    {buttonTexts.hubungiAdmin}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-purple-400 flex-shrink-0" />
                <p className="text-gray-300 text-sm md:text-base">info@alhikmah.ac.id</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm md:text-base">Senin - Jumat</p>
                  <p className="text-gray-300 text-sm md:text-base">08:00 - 16:00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-6 md:pt-8 mt-8 md:mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-xs md:text-sm mb-4 md:mb-0">
              <p>{footerText}</p>
            </div>
            <a 
              href={developerContact}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="/logodevandro.png" 
                alt="Developer Logo" 
                className="h-8 w-8 rounded-full"
              />
              <span className="text-sm text-gray-400">@Devandro Studio</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;