
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Palette } from 'lucide-react';

interface ColorSettingsProps {
  settings: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    enableDarkMode: boolean;
  };
  onSettingsChange: (updates: Partial<ColorSettingsProps['settings']>) => void;
}

const ColorSettings: React.FC<ColorSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Skema Warna</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="primaryColor">Warna Primer</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="color"
                id="primaryColor"
                value={settings.primaryColor}
                onChange={(e) => onSettingsChange({ primaryColor: e.target.value })}
                className="w-12 h-10 rounded border"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) => onSettingsChange({ primaryColor: e.target.value })}
                placeholder="#4F46E5"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="secondaryColor">Warna Sekunder</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="color"
                id="secondaryColor"
                value={settings.secondaryColor}
                onChange={(e) => onSettingsChange({ secondaryColor: e.target.value })}
                className="w-12 h-10 rounded border"
              />
              <Input
                value={settings.secondaryColor}
                onChange={(e) => onSettingsChange({ secondaryColor: e.target.value })}
                placeholder="#06B6D4"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="accentColor">Warna Aksen</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="color"
                id="accentColor"
                value={settings.accentColor}
                onChange={(e) => onSettingsChange({ accentColor: e.target.value })}
                className="w-12 h-10 rounded border"
              />
              <Input
                value={settings.accentColor}
                onChange={(e) => onSettingsChange({ accentColor: e.target.value })}
                placeholder="#F59E0B"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="darkMode"
            checked={settings.enableDarkMode}
            onCheckedChange={(checked) => onSettingsChange({ enableDarkMode: checked })}
          />
          <Label htmlFor="darkMode">Aktifkan Mode Gelap</Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorSettings;
