import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useButtonTexts } from '@/hooks/useButtonTexts';
import { Loader2 } from 'lucide-react';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface RegistrationPeriod {
  isOpen: boolean;
  startDate: string;
  endDate: string;
  academicYear: string;
}

const SPMBForm = () => {
  const { buttonTexts } = useButtonTexts();
  const [formData, setFormData] = useState<Record<string, any>>({
    nama_lengkap: '',
    program_pilihan: '',
    parent_name: '',
    phone: '',
    email: '',
    address: '',
    birth_date: ''
  });
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true, placeholder: 'Masukkan nama lengkap' },
    { id: 'program_pilihan', label: 'Program Pilihan', type: 'select', required: true, options: ['TKA/TPA', 'PAUD/KOBER', 'Diniyah'] },
    { id: 'parent_name', label: 'Nama Orang Tua/Wali', type: 'text', required: true, placeholder: 'Masukkan nama orang tua/wali' },
    { id: 'phone', label: 'Nomor Telepon', type: 'tel', required: true, placeholder: 'Masukkan nomor telepon' },
    { id: 'email', label: 'Email', type: 'email', required: false, placeholder: 'Masukkan email (opsional)' },
    { id: 'address', label: 'Alamat Lengkap', type: 'textarea', required: true, placeholder: 'Masukkan alamat lengkap' },
    { id: 'birth_date', label: 'Tanggal Lahir', type: 'date', required: false }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationPeriod, setRegistrationPeriod] = useState<RegistrationPeriod>({
    isOpen: true,
    startDate: '',
    endDate: '',
    academicYear: ''
  });
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFormConfig();
    loadRegistrationPeriod();
  }, []);

  const loadFormConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('ppdb_form_config')
        .select('fields')
        .eq('id', 1)
        .single();

      if (error) {
        console.log('Using default form configuration');
        return;
      }
      
      if (data && data.fields) {
        setFormFields(data.fields);
      }
    } catch (error) {
      console.error('Error loading form configuration:', error);
    }
  };

  const loadRegistrationPeriod = async () => {
    try {
      const { data, error } = await supabase
        .from('ppdb_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.log('Using default registration period settings');
        setIsLoading(false);
        return;
      }
      
      if (data) {
        setRegistrationPeriod({
          isOpen: data.is_open,
          startDate: data.start_date,
          endDate: data.end_date,
          academicYear: data.academic_year
        });
        setIsRegistrationOpen(data.is_open);
      }
    } catch (error) {
      console.error('Error loading registration period:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = formFields.filter(field => field.required);
    for (const field of requiredFields) {
      if (!formData[field.id]) {
        toast({
          title: "Error",
          description: `${field.label} harus diisi`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('ppdb_registrations')
        .insert(formData)
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Pendaftaran berhasil dikirim. Kami akan menghubungi Anda untuk proses selanjutnya.",
      });
      
      // Reset form
      const emptyFormData: Record<string, any> = {};
      formFields.forEach(field => {
        emptyFormData[field.id] = '';
      });
      setFormData(emptyFormData);
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim pendaftaran. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!isRegistrationOpen) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Pendaftaran SPMB Ditutup</CardTitle>
            <CardDescription className="text-center mt-2">
              Pendaftaran SPMB untuk tahun ajaran {registrationPeriod.academicYear} saat ini sedang ditutup.
            Silakan kembali pada periode pendaftaran berikutnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-4">Periode pendaftaran: {new Date(registrationPeriod.startDate).toLocaleDateString('id-ID')} - {new Date(registrationPeriod.endDate).toLocaleDateString('id-ID')}</p>
            <Button variant="outline" onClick={() => window.location.href = '#contact'}>
              {buttonTexts.hubungiKami}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-xl md:text-2xl">Formulir Pendaftaran SPMB</CardTitle>
        <CardDescription className="text-center">
          Tahun Ajaran {registrationPeriod.academicYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-1 md:space-y-2">
              <Label htmlFor={field.id} className="text-sm md:text-base">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === 'text' && (
                <Input
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="text-sm md:text-base"
                />
              )}
              
              {field.type === 'email' && (
                <Input
                  id={field.id}
                  type="email"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="text-sm md:text-base"
                />
              )}
              
              {field.type === 'tel' && (
                <Input
                  id={field.id}
                  type="tel"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="text-sm md:text-base"
                />
              )}
              
              {field.type === 'date' && (
                <Input
                  id={field.id}
                  type="date"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                  className="text-sm md:text-base"
                />
              )}
              
              {field.type === 'textarea' && (
                <Textarea
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={3}
                  className="text-sm md:text-base"
                />
              )}
              
              {field.type === 'select' && field.options && (
                <Select
                  value={formData[field.id] || ''}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                >
                  <SelectTrigger id={field.id} className="text-sm md:text-base">
                    <SelectValue placeholder={`Pilih ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option} className="text-sm md:text-base">{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          
          <Button 
            type="submit" 
            className="w-full gradient-primary text-white font-medium py-2 md:py-3 text-sm md:text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Mengirim...</span>
              </div>
            ) : (
              'Kirim Pendaftaran'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SPMBForm;