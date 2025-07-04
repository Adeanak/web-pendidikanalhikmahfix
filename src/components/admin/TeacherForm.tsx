import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { Teacher } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (teacherData: Partial<Teacher>) => void;
  onCancel: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    position: teacher?.position || '',
    program: teacher?.program || '' as Teacher['program'],
    education: teacher?.education || '',
    experience: teacher?.experience || '',
    photo: teacher?.photo || ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.position || !formData.program || !formData.education || !formData.experience) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi kecuali foto",
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
      const filePath = `teachers/${fileName}`;
      
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

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {teacher ? 'Edit Pengajar' : 'Tambah Pengajar Baru'}
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
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
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
              <div className="flex items-center space-x-2 text-green-600 hover:text-green-700">
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
              <Label htmlFor="position">Posisi/Jabatan *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Contoh: Pengajar TKA/TPA"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Program *</Label>
              <Select 
                value={formData.program} 
                onValueChange={(value: Teacher['program']) => setFormData({ ...formData, program: value })}
              >
                <SelectTrigger id="program">
                  <SelectValue placeholder="Pilih program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TKA/TPA">TKA/TPA</SelectItem>
                  <SelectItem value="PAUD/KOBER">PAUD/KOBER</SelectItem>
                  <SelectItem value="Diniyah">Diniyah</SelectItem>
                  <SelectItem value="All">Semua Program</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Pendidikan *</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Contoh: S1 Pendidikan Agama Islam"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="experience">Pengalaman *</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Contoh: 5 tahun mengajar di pesantren"
                rows={3}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-teal-600">
              {teacher ? 'Update Pengajar' : 'Tambah Pengajar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeacherForm;