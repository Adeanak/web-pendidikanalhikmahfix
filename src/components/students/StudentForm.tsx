import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Loader2 } from 'lucide-react';
import { Student } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface StudentFormProps {
  student?: Student;
  onSubmit: (studentData: Partial<Student>) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    program: student?.program || '' as Student['program'],
    class: student?.class || '',
    parent_name: student?.parent_name || '',
    phone: student?.phone || '',
    address: student?.address || '',
    birth_date: student?.birth_date || '',
    status: student?.status || 'active' as Student['status'],
    photo: student?.photo || ''
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.program || !formData.parent_name) {
      toast({
        title: "Error",
        description: "Nama, program, dan nama orang tua harus diisi",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `student-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `students/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      setFormData({ ...formData, photo: publicUrl });

      toast({
        title: "Berhasil",
        description: "Foto berhasil diupload",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload foto",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = async () => {
    if (formData.photo && formData.photo.includes('supabase')) {
      try {
        // Extract file path from URL
        const url = new URL(formData.photo);
        const filePath = url.pathname.split('/').slice(-2).join('/');
        
        // Delete from storage
        await supabase.storage
          .from('photos')
          .remove([filePath]);
      } catch (error) {
        console.error('Error removing photo:', error);
      }
    }
    
    setFormData({ ...formData, photo: '' });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {student ? 'Edit Siswa' : 'Tambah Siswa Baru'}
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
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                  onClick={removePhoto}
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
            )}
            <Label htmlFor="photo" className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mengupload...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Foto</span>
                  </>
                )}
              </div>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
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
              <Select value={formData.program} onValueChange={(value: Student['program']) => setFormData({ ...formData, program: value })}>
                <SelectTrigger>
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
              <Label htmlFor="class">Kelas</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="Contoh: Kelas A, Kelas 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Tanggal Lahir</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent_name">Nama Orang Tua *</Label>
              <Input
                id="parent_name"
                value={formData.parent_name}
                onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                placeholder="Masukkan nama orang tua"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08123456789"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Masukkan alamat lengkap"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Student['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="graduated">Lulus</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" className="gradient-primary" disabled={isUploading}>
              {student ? 'Update Siswa' : 'Tambah Siswa'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;