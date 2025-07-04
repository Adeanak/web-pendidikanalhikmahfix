
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image } from 'lucide-react';

interface BrandingSettingsProps {
  settings: {
    siteName: string;
    siteDescription: string;
    logo: string;
    favicon: string;
    fontFamily: string;
  };
  onSettingsChange: (updates: Partial<BrandingSettingsProps['settings']>) => void;
  onImageUpload: (field: string) => void;
}

const BrandingSettings: React.FC<BrandingSettingsProps> = ({
  settings,
  onSettingsChange,
  onImageUpload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Image className="h-5 w-5" />
          <span>Identitas Brand</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="siteName">Nama Situs</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => onSettingsChange({ siteName: e.target.value })}
              placeholder="Nama yayasan atau lembaga"
            />
          </div>
          <div>
            <Label htmlFor="siteDescription">Deskripsi Situs</Label>
            <Input
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => onSettingsChange({ siteDescription: e.target.value })}
              placeholder="Deskripsi singkat"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Logo Utama</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Button
                variant="outline"
                onClick={() => onImageUpload('logo')}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              {settings.logo && (
                <img src={settings.logo} alt="Logo" className="h-10 w-10 object-contain rounded" />
              )}
            </div>
          </div>
          <div>
            <Label>Favicon</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Button
                variant="outline"
                onClick={() => onImageUpload('favicon')}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Favicon
              </Button>
              {settings.favicon && (
                <img src={settings.favicon} alt="Favicon" className="h-6 w-6 object-contain rounded" />
              )}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="fontFamily">Font Utama</Label>
          <select
            id="fontFamily"
            value={settings.fontFamily}
            onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="Poppins">Poppins</option>
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Nunito">Nunito</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandingSettings;
