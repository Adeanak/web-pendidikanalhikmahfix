
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Monitor, Smartphone, MapPin } from 'lucide-react';

interface PreviewSectionProps {
  settings: {
    siteName: string;
    siteDescription: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    heroTitle: string;
    heroSubtitle: string;
    footerText: string;
    address: {
      kampung: string;
      rt: string;
      rw: string;
      desa: string;
      kecamatan: string;
      kabupaten: string;
    };
  };
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  getFullAddress: () => string;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  settings,
  previewMode,
  onPreviewModeChange,
  getFullAddress
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Preview Website</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPreviewModeChange('desktop')}
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPreviewModeChange('mobile')}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div 
            className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${
              previewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
            }`}
          >
            <div 
              className="p-6"
              style={{
                backgroundColor: settings.primaryColor,
                color: 'white'
              }}
            >
              <div className="flex items-center space-x-3">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="h-12 w-12 object-contain rounded" />
                ) : (
                  <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs">LOGO</span>
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold">{settings.siteName}</h1>
                  <p className="text-sm opacity-90">{settings.siteDescription}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{color: settings.primaryColor}}>
                  {settings.heroTitle}
                </h2>
                <p className="text-gray-600">{settings.heroSubtitle}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg" style={{backgroundColor: settings.primaryColor + '10'}}>
                  <h3 className="font-semibold" style={{color: settings.primaryColor}}>PAUD/KOBER</h3>
                  <p className="text-sm text-gray-600">Program Pendidikan Anak Usia Dini</p>
                </div>
                <div className="p-4 rounded-lg" style={{backgroundColor: settings.secondaryColor + '10'}}>
                  <h3 className="font-semibold" style={{color: settings.secondaryColor}}>TKA/TPA</h3>
                  <p className="text-sm text-gray-600">Taman Kanak-kanak Al-Quran</p>
                </div>
                <div className="p-4 rounded-lg" style={{backgroundColor: settings.accentColor + '10'}}>
                  <h3 className="font-semibold" style={{color: settings.accentColor}}>Diniyah</h3>
                  <p className="text-sm text-gray-600">Madrasah Diniyah</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {getFullAddress()}
                </div>
                <div className="text-center text-sm text-gray-500">{settings.footerText}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewSection;
