import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircle } from 'lucide-react';

interface ButtonTextSettingsProps {
  settings: {
    buttonTexts: {
      hubungiAdmin: string;
      konsultasiGratis: string;
      jadwalKunjungan: string;
      hubungiKami: string;
      downloadBrosur: string;
      daftarSekarang: string;
    };
  };
  onSettingsChange: (updates: Partial<ButtonTextSettingsProps['settings']>) => void;
}

const ButtonTextSettings: React.FC<ButtonTextSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleButtonTextChange = (key: string, value: string) => {
    onSettingsChange({
      buttonTexts: {
        ...settings.buttonTexts,
        [key]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Teks Tombol & Label</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hubungiAdmin">Teks Tombol "Hubungi Admin"</Label>
            <Input
              id="hubungiAdmin"
              value={settings.buttonTexts.hubungiAdmin}
              onChange={(e) => handleButtonTextChange('hubungiAdmin', e.target.value)}
              placeholder="Hubungi Admin"
            />
          </div>
          
          <div>
            <Label htmlFor="konsultasiGratis">Teks Tombol "Konsultasi Gratis"</Label>
            <Input
              id="konsultasiGratis"
              value={settings.buttonTexts.konsultasiGratis}
              onChange={(e) => handleButtonTextChange('konsultasiGratis', e.target.value)}
              placeholder="Konsultasi Gratis"
            />
          </div>
          
          <div>
            <Label htmlFor="jadwalKunjungan">Teks Tombol "Jadwal Kunjungan"</Label>
            <Input
              id="jadwalKunjungan"
              value={settings.buttonTexts.jadwalKunjungan}
              onChange={(e) => handleButtonTextChange('jadwalKunjungan', e.target.value)}
              placeholder="Jadwal Kunjungan"
            />
          </div>
          
          <div>
            <Label htmlFor="hubungiKami">Teks Tombol "Hubungi Kami"</Label>
            <Input
              id="hubungiKami"
              value={settings.buttonTexts.hubungiKami}
              onChange={(e) => handleButtonTextChange('hubungiKami', e.target.value)}
              placeholder="Hubungi Kami"
            />
          </div>
          
          <div>
            <Label htmlFor="downloadBrosur">Teks Tombol "Download Brosur"</Label>
            <Input
              id="downloadBrosur"
              value={settings.buttonTexts.downloadBrosur}
              onChange={(e) => handleButtonTextChange('downloadBrosur', e.target.value)}
              placeholder="Download Brosur"
            />
          </div>
          
          <div>
            <Label htmlFor="daftarSekarang">Teks Tombol "Daftar Sekarang"</Label>
            <Input
              id="daftarSekarang"
              value={settings.buttonTexts.daftarSekarang}
              onChange={(e) => handleButtonTextChange('daftarSekarang', e.target.value)}
              placeholder="Daftar Sekarang"
            />
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Informasi</h4>
          <p className="text-sm text-blue-700">
            Teks tombol ini akan diterapkan di seluruh website. Pastikan teks yang Anda masukkan sesuai dengan fungsi tombol tersebut.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ButtonTextSettings;