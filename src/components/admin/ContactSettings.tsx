import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface ContactSettingsProps {
  settings: {
    contactEmail: string;
    contactPhone: string;
    contactPhone2: string;
    adminContact: string;
    developerContact: string;
    address: {
      kampung: string;
      rt: string;
      rw: string;
      desa: string;
      kecamatan: string;
      kabupaten: string;
    };
    socialMedia: {
      facebook: string;
      instagram: string;
      youtube: string;
      twitter: string;
    };
  };
  onSettingsChange: (updates: Partial<ContactSettingsProps['settings']>) => void;
  getFullAddress: () => string;
}

const ContactSettings: React.FC<ContactSettingsProps> = ({
  settings,
  onSettingsChange,
  getFullAddress
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Informasi Kontak & Alamat</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
            <Label htmlFor="contactPhone">Nomor Telepon 1</Label>
            <Input
              id="contactPhone"
              value={settings.contactPhone}
              onChange={(e) => onSettingsChange({ contactPhone: e.target.value })}
              placeholder="089677921985"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="contactPhone2">Nomor Telepon 2 (HP/WA)</Label>
            <Input
              id="contactPhone2"
              value={settings.contactPhone2}
              onChange={(e) => onSettingsChange({ contactPhone2: e.target.value })}
              placeholder="0812-3456-7890"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Alamat Yayasan</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="kampung">Kampung/Jalan</Label>
              <Input
                id="kampung"
                value={settings.address.kampung}
                onChange={(e) => onSettingsChange({
                  address: {...settings.address, kampung: e.target.value}
                })}
                placeholder="Kp. Tanjung"
              />
            </div>
            <div>
              <Label htmlFor="rt">RT</Label>
              <Input
                id="rt"
                value={settings.address.rt}
                onChange={(e) => onSettingsChange({
                  address: {...settings.address, rt: e.target.value}
                })}
                placeholder="03"
              />
            </div>
            <div>
              <Label htmlFor="rw">RW</Label>
              <Input
                id="rw"
                value={settings.address.rw}
                onChange={(e) => onSettingsChange({
                  address: {...settings.address, rw: e.target.value}
                })}
                placeholder="07"
              />
            </div>
            <div>
              <Label htmlFor="desa">Desa/Kelurahan</Label>
              <Input
                id="desa"
                value={settings.address.desa}
                onChange={(e) => onSettingsChange({
                  address: {...settings.address, desa: e.target.value}
                })}
                placeholder="Desa Tanjungsari"
              />
            </div>
            <div>
              <Label htmlFor="kecamatan">Kecamatan</Label>
              <Input
                id="kecamatan"
                value={settings.address.kecamatan}
                onChange={(e) => onSettingsChange({
                  address: {...settings.address, kecamatan: e.target.value}
                })}
                placeholder="Kecamatan Cangkuang"
              />
            </div>
            <div>
              <Label htmlFor="kabupaten">Kabupaten/Kota</Label>
              <Input
                id="kabupaten"
                value={settings.address.kabupaten}
                onChange={(e) => onSettingsChange({
                  address: {...settings.address, kabupaten: e.target.value}
                })}
                placeholder="Kabupaten Bandung"
              />
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium text-gray-700">Preview Alamat Lengkap:</Label>
            <p className="mt-1 text-sm text-gray-600">{getFullAddress()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Kontak WhatsApp</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adminContact">WhatsApp Admin (089677921985)</Label>
              <Input
                id="adminContact"
                value={settings.adminContact}
                onChange={(e) => onSettingsChange({ adminContact: e.target.value })}
                placeholder="https://wa.me/6289677921985"
              />
            </div>
            <div>
              <Label htmlFor="developerContact">WhatsApp Developer (085324142332)</Label>
              <Input
                id="developerContact"
                value={settings.developerContact}
                onChange={(e) => onSettingsChange({ developerContact: e.target.value })}
                placeholder="https://wa.me/6285324142332"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Media Sosial</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={settings.socialMedia.facebook}
                onChange={(e) => onSettingsChange({
                  socialMedia: {...settings.socialMedia, facebook: e.target.value}
                })}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={settings.socialMedia.instagram}
                onChange={(e) => onSettingsChange({
                  socialMedia: {...settings.socialMedia, instagram: e.target.value}
                })}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={settings.socialMedia.youtube}
                onChange={(e) => onSettingsChange({
                  socialMedia: {...settings.socialMedia, youtube: e.target.value}
                })}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter (X)</Label>
              <Input
                id="twitter"
                value={settings.socialMedia.twitter}
                onChange={(e) => onSettingsChange({
                  socialMedia: {...settings.socialMedia, twitter: e.target.value}
                })}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSettings;