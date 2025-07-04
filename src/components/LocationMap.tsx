import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface LocationContent {
  locationTitle: string;
  locationDescription: string;
  locationAddress: string;
  locationPhone: string;
  locationHours: string;
  locationMapUrl: string;
}

const LocationMap = () => {
  const [content, setContent] = useState<LocationContent>({
    locationTitle: 'Lokasi Yayasan',
    locationDescription: 'Kunjungi kami di lokasi berikut',
    locationAddress: 'Kp. Tanjung RT 03 RW 07, Desa Tanjungsari, Kecamatan Cangkuang, Kabupaten Bandung',
    locationPhone: '089677921985',
    locationHours: '08:00 - 16:00 WIB',
    locationMapUrl: 'https://maps.app.goo.gl/yZpSwizJDcgAuFL78'
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.log('Using default location content');
        return;
      }
      
      if (data && data.settings) {
        const settings = data.settings;
        const homeContent = settings.homeContent;
        
        setContent({
          locationTitle: homeContent?.locationTitle || content.locationTitle,
          locationDescription: homeContent?.locationDescription || content.locationDescription,
          locationAddress: homeContent?.locationAddress || content.locationAddress,
          locationPhone: settings.contactPhone || homeContent?.locationPhone || content.locationPhone,
          locationHours: homeContent?.locationHours || content.locationHours,
          locationMapUrl: homeContent?.locationMapUrl || content.locationMapUrl
        });
      }
    } catch (error) {
      console.error('Error loading location content:', error);
    }
  };

  const openInMaps = () => {
    window.open(content.locationMapUrl, '_blank');
  };

  const openDirections = () => {
    window.open(content.locationMapUrl, '_blank');
  };

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center space-x-2 mb-3 md:mb-4">
            <MapPin className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {content.locationTitle}
            </h2>
          </div>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300">
            {content.locationDescription}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Map */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="aspect-video w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.0842784147746!2d107.62223231477396!3d-6.989657168965738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e0c0e0e0e0e0%3A0x0!2zNsKwNTknMjIuOCJTIDEwN8KwMzcnMjkuMyJF!5e0!3m2!1sen!2sid!4v1640000000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Yayasan Al-Hikmah"
              ></iframe>
            </div>
          </div>

          {/* Location Info */}
          <div className="space-y-4 md:space-y-6">
            <Card className="shadow-lg dark:bg-gray-800 transition-colors duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start space-x-3 md:space-x-4 mb-4 md:mb-6">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 md:mb-2">Alamat Lengkap</h3>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {content.locationAddress}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Telepon</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">{content.locationPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Jam Operasional</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">{content.locationHours}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  <Button
                    onClick={openInMaps}
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 text-xs md:text-sm py-2"
                  >
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Lihat di Maps
                  </Button>
                  <Button
                    onClick={openDirections}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/50 text-xs md:text-sm py-2"
                  >
                    <Navigation className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Petunjuk Arah
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800 transition-colors duration-300">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Informasi Transportasi
                </h3>
                <ul className="space-y-1 md:space-y-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Dapat diakses dengan kendaraan pribadi</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Tersedia area parkir yang luas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Dekat dengan fasilitas umum</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;