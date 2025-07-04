import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { Graduate } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface GraduateFormProps {
  graduate?: Graduate;
  onSubmit: (graduateData: Partial<Graduate>) => void;
  onCancel: () => void;
}

const GraduateForm: React.FC<GraduateFormProps> = ({ graduate, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: graduate?.name || '',
    program: graduate?.program || '' as Graduate['program'],
    graduation_year: graduate?.graduation_year || new Date().getFullYear(),
    achievement: graduate?.achievement || '',
    current_school: graduate?.current_school || '',
    photo: graduate?.photo || ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.program || !formData.graduation_year) {
      toast({
        title: "Error",
        description: "Nama, program, dan tahun kelulusan harus diisi",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `graduates/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      if (data) {
        setFormData({ ...formData, photo: data.publicUrl });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Gagal mengunggah foto",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Generate year options for the last 10 years
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {graduate ? 'Edit Lulusan' : 'Tambah Lulusan Baru'}
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center space-y-4">
            {formData.photo ? (
              <div className="relative">
                <img 
                  src={formData.photo} 
                  alt="Preview" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-100"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                  onClick={() => setFormData({ ...formData, photo: '' })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <Label htmlFor="photo" className="cursor-pointer">
              <div className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                <Upload className="h-4 w-4" />
                <span>{isUploading ? 'Mengunggah...' : 'Upload Foto'}</span>
              </div>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Program *</Label>
              <Select 
                value={formData.program} 
                onValueChange={(value: Graduate['program']) => setFormData({ ...formData, program: value })}
              >
                <SelectTrigger id="program">
                  <SelectValue placeholder="Pilih program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TKA/TPA">TKA/TPA</SelectItem>
                  <SelectItem value="PAUD/KOBER">PAUD/KOBER</SelectItem>
                  <SelectItem value="Diniyah">Diniyah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduation_year">Tahun Kelulusan *</Label>
              <Select 
                value={formData.graduation_year.toString()} 
                onValueChange={(value) => setFormData({ ...formData, graduation_year: parseInt(value) })}
              >
                <SelectTrigger id="graduation_year">
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_school">Sekolah Lanjutan</Label>
              <Input
                id="current_school"
                value={formData.current_school}
                onChange={(e) => setFormData({ ...formData, current_school: e.target.value })}
                placeholder="Contoh: SMP Al-Azhar"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="achievement">Prestasi</Label>
              <Textarea
                id="achievement"
                value={formData.achievement}
                onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                placeholder="Contoh: Juara 1 Lomba Tahfidz"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
              {graduate ? 'Update Lulusan' : 'Tambah Lulusan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GraduateForm;