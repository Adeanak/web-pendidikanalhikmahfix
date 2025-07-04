import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Layout, BarChart } from 'lucide-react';

interface LayoutSettingsProps {
  settings: {
    showGraduates: boolean;
    showPPDB: boolean;
    showFloatingStats: boolean;
  };
  onSettingsChange: (updates: Partial<LayoutSettingsProps['settings']>) => void;
}

const LayoutSettings: React.FC<LayoutSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Layout className="h-5 w-5" />
          <span>Pengaturan Layout</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showGraduates">Tampilkan Section Lulusan</Label>
              <p className="text-sm text-gray-500">Menampilkan daftar lulusan di halaman utama</p>
            </div>
            <Switch
              id="showGraduates"
              checked={settings.showGraduates}
              onCheckedChange={(checked) => onSettingsChange({ showGraduates: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showPPDB">Tampilkan Section SPMB</Label>
              <p className="text-sm text-gray-500">Menampilkan informasi SPMB di halaman utama</p>
            </div>
            <Switch
              id="showPPDB"
              checked={settings.showPPDB}
              onCheckedChange={(checked) => onSettingsChange({ showPPDB: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showFloatingStats">Tampilkan Statistik Mengambang</Label>
              <p className="text-sm text-gray-500">Menampilkan statistik live di pojok kanan halaman</p>
            </div>
            <Switch
              id="showFloatingStats"
              checked={settings.showFloatingStats}
              onCheckedChange={(checked) => onSettingsChange({ showFloatingStats: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutSettings;