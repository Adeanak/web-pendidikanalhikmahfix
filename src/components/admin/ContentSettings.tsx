
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Type } from 'lucide-react';

interface ContentSettingsProps {
  settings: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    aboutTitle: string;
    aboutContent: string;
    contactEmail: string;
    footerText: string;
  };
  onSettingsChange: (updates: Partial<ContentSettingsProps['settings']>) => void;
  onImageUpload: (field: string) => void;
}

const ContentSettings: React.FC<ContentSettingsProps> = ({
  settings,
  onSettingsChange,
  onImageUpload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Type className="h-5 w-5" />
          <span>Konten Website</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Judul Hero</Label>
            <Input
              id="heroTitle"
              value={settings.heroTitle}
              onChange={(e) => onSettingsChange({ heroTitle: e.target.value })}
              placeholder="Judul utama halaman"
            />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Subtitle Hero</Label>
            <Input
              id="heroSubtitle"
              value={settings.heroSubtitle}
              onChange={(e) => onSettingsChange({ heroSubtitle: e.target.value })}
              placeholder="Subtitle halaman"
            />
          </div>
          <div>
            <Label>Gambar Hero</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Button
                variant="outline"
                onClick={() => onImageUpload('heroImage')}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Gambar Hero
              </Button>
              {settings.heroImage && (
                <img src={settings.heroImage} alt="Hero" className="h-16 w-24 object-cover rounded" />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="aboutTitle">Judul Tentang Kami</Label>
            <Input
              id="aboutTitle"
              value={settings.aboutTitle}
              onChange={(e) => onSettingsChange({ aboutTitle: e.target.value })}
              placeholder="Judul section tentang kami"
            />
          </div>
          <div>
            <Label htmlFor="aboutContent">Konten Tentang Kami</Label>
            <Textarea
              id="aboutContent"
              value={settings.aboutContent}
              onChange={(e) => onSettingsChange({ aboutContent: e.target.value })}
              placeholder="Deskripsi tentang yayasan"
              rows={4}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactEmail">Email Kontak</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => onSettingsChange({ contactEmail: e.target.value })}
              placeholder="email@domain.com"
            />
          </div>
          <div>
            <Label htmlFor="footerText">Teks Footer</Label>
            <Input
              id="footerText"
              value={settings.footerText}
              onChange={(e) => onSettingsChange({ footerText: e.target.value })}
              placeholder="Copyright dan informasi footer"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentSettings;
