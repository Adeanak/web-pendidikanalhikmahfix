import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Calendar, Settings, Download, Plus, Edit, Trash2, CheckCircle, XCircle, FileDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface SPMBRegistration {
  id: number;
  nama_lengkap: string;
  program_pilihan: string;
  parent_name: string;
  phone: string;
  email?: string;
  address: string;
  birth_date?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface TestSchedule {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  program: string;
}

const PPDBAdmin = () => {
  const { user, loading } = useAuth();
  const [registrations, setRegistrations] = useState<SPMBRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<SPMBRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTestScheduleOpen, setIsTestScheduleOpen] = useState(false);
  const [formConfig, setFormConfig] = useState<FormField[]>([
    { id: 'nama_lengkap', label: 'Nama Lengkap', type: 'text', required: true, placeholder: 'Masukkan nama lengkap' },
    { id: 'program_pilihan', label: 'Program Pilihan', type: 'select', required: true, options: ['TKA/TPA', 'PAUD/KOBER', 'Diniyah'] },
    { id: 'parent_name', label: 'Nama Orang Tua/Wali', type: 'text', required: true, placeholder: 'Masukkan nama orang tua/wali' },
    { id: 'phone', label: 'Nomor Telepon', type: 'tel', required: true, placeholder: 'Masukkan nomor telepon' },
    { id: 'email', label: 'Email', type: 'email', required: false, placeholder: 'Masukkan email (opsional)' },
    { id: 'address', label: 'Alamat Lengkap', type: 'textarea', required: true, placeholder: 'Masukkan alamat lengkap' },
    { id: 'birth_date', label: 'Tanggal Lahir', type: 'date', required: false }
  ]);
  const [testSchedules, setTestSchedules] = useState<TestSchedule[]>([
    {
      id: 1,
      title: 'Tes Masuk TKA/TPA',
      date: '2025-07-15',
      time: '08:00 - 11:00',
      location: 'Gedung Utama Al-Hikmah',
      description: 'Tes baca Al-Quran dan wawancara orang tua',
      program: 'TKA/TPA'
    },
    {
      id: 2,
      title: 'Tes Masuk PAUD/KOBER',
      date: '2025-07-16',
      time: '08:00 - 11:00',
      location: 'Gedung Utama Al-Hikmah',
      description: 'Tes kesiapan sekolah dan wawancara orang tua',
      program: 'PAUD/KOBER'
    },
    {
      id: 3,
      title: 'Tes Masuk Diniyah',
      date: '2025-07-17',
      time: '13:00 - 16:00',
      location: 'Gedung Utama Al-Hikmah',
      description: 'Tes pengetahuan agama dasar dan wawancara',
      program: 'Diniyah'
    }
  ]);
  const [newTestSchedule, setNewTestSchedule] = useState<Omit<TestSchedule, 'id'>>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    program: ''
  });
  const [editingTestSchedule, setEditingTestSchedule] = useState<TestSchedule | null>(null);
  const [registrationPeriod, setRegistrationPeriod] = useState({
    isOpen: true,
    startDate: '2025-01-01',
    endDate: '2025-07-31',
    academicYear: '2025/2026'
  });

  useEffect(() => {
    if (user) {
      loadRegistrations();
      loadTestSchedules();
      loadRegistrationPeriod();
    }
  }, [user]);

  useEffect(() => {
    if (registrations.length > 0) {
      filterRegistrations();
    }
  }, [searchTerm, statusFilter, registrations]);

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ppdb_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setRegistrations(data || []);
      setFilteredRegistrations(data || []);
    } catch (error) {
      console.error('Error loading SPMB registrations:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pendaftaran",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTestSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('ppdb_test_schedules')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        // If table doesn't exist yet, we'll use the default schedules
        console.log('Using default test schedules');
        return;
      }
      
      if (data && data.length > 0) {
        setTestSchedules(data);
      }
    } catch (error) {
      console.error('Error loading test schedules:', error);
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
        // If table doesn't exist yet, we'll use the default settings
        console.log('Using default registration period settings');
        return;
      }
      
      if (data) {
        setRegistrationPeriod({
          isOpen: data.is_open,
          startDate: data.start_date,
          endDate: data.end_date,
          academicYear: data.academic_year
        });
      }
    } catch (error) {
      console.error('Error loading registration period:', error);
    }
  };

  const filterRegistrations = () => {
    let filtered = [...registrations];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(reg => 
        reg.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.phone.includes(searchTerm)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }
    
    setFilteredRegistrations(filtered);
  };

  const updateRegistrationStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('ppdb_registrations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      loadRegistrations();
      toast({
        title: "Berhasil",
        description: `Status pendaftaran berhasil diubah menjadi ${status === 'approved' ? 'diterima' : 'ditolak'}`,
      });
    } catch (error) {
      console.error('Error updating registration status:', error);
      toast({
        title: "Error",
        description: "Gagal mengubah status pendaftaran",
        variant: "destructive",
      });
    }
  };

  const saveFormConfig = async () => {
    try {
      // Check if ppdb_form_config table exists, if not create it
      const { error: tableError } = await supabase
        .from('ppdb_form_config')
        .select('id')
        .limit(1);

      if (tableError) {
        // Create the table
        await supabase.rpc('create_ppdb_form_config_table');
      }

      // Save the form configuration
      const { error } = await supabase
        .from('ppdb_form_config')
        .upsert({ id: 1, fields: formConfig });

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Konfigurasi formulir berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving form configuration:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan konfigurasi formulir",
        variant: "destructive",
      });
    }
  };

  const saveTestSchedule = async () => {
    try {
      // Check if ppdb_test_schedules table exists, if not create it
      const { error: tableError } = await supabase
        .from('ppdb_test_schedules')
        .select('id')
        .limit(1);

      if (tableError) {
        // Create the table
        await supabase.rpc('create_ppdb_test_schedules_table');
      }

      if (editingTestSchedule) {
        // Update existing schedule
        const { error } = await supabase
          .from('ppdb_test_schedules')
          .update({
            title: newTestSchedule.title,
            date: newTestSchedule.date,
            time: newTestSchedule.time,
            location: newTestSchedule.location,
            description: newTestSchedule.description,
            program: newTestSchedule.program
          })
          .eq('id', editingTestSchedule.id);

        if (error) throw error;
      } else {
        // Add new schedule
        const { error } = await supabase
          .from('ppdb_test_schedules')
          .insert({
            title: newTestSchedule.title,
            date: newTestSchedule.date,
            time: newTestSchedule.time,
            location: newTestSchedule.location,
            description: newTestSchedule.description,
            program: newTestSchedule.program
          });

        if (error) throw error;
      }
      
      loadTestSchedules();
      setNewTestSchedule({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        program: ''
      });
      setEditingTestSchedule(null);
      setIsTestScheduleOpen(false);
      
      toast({
        title: "Berhasil",
        description: "Jadwal tes berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving test schedule:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan jadwal tes",
        variant: "destructive",
      });
    }
  };

  const deleteTestSchedule = async (id: number) => {
    try {
      const { error } = await supabase
        .from('ppdb_test_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      loadTestSchedules();
      toast({
        title: "Berhasil",
        description: "Jadwal tes berhasil dihapus",
      });
    } catch (error) {
      console.error('Error deleting test schedule:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus jadwal tes",
        variant: "destructive",
      });
    }
  };

  const saveRegistrationPeriod = async () => {
    try {
      // Check if ppdb_settings table exists, if not create it
      const { error: tableError } = await supabase
        .from('ppdb_settings')
        .select('id')
        .limit(1);

      if (tableError) {
        // Create the table
        await supabase.rpc('create_ppdb_settings_table');
      }

      // Save the registration period settings
      const { error } = await supabase
        .from('ppdb_settings')
        .upsert({
          id: 1,
          is_open: registrationPeriod.isOpen,
          start_date: registrationPeriod.startDate,
          end_date: registrationPeriod.endDate,
          academic_year: registrationPeriod.academicYear
        });

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Periode pendaftaran berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving registration period:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan periode pendaftaran",
        variant: "destructive",
      });
    }
  };

  const exportRegistrationsToCSV = () => {
    try {
      // Convert registrations to CSV
      const headers = ['ID', 'Nama Lengkap', 'Program', 'Nama Orang Tua', 'Telepon', 'Email', 'Alamat', 'Tanggal Lahir', 'Status', 'Tanggal Daftar'];
      const csvRows = [headers.join(',')];
      
      filteredRegistrations.forEach(reg => {
        const row = [
          reg.id,
          `"${reg.nama_lengkap}"`,
          `"${reg.program_pilihan}"`,
          `"${reg.parent_name}"`,
          `"${reg.phone}"`,
          `"${reg.email || ''}"`,
          `"${reg.address.replace(/"/g, '""')}"`,
          reg.birth_date || '',
          reg.status,
          new Date(reg.created_at).toLocaleDateString('id-ID')
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `pendaftar-spmb-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Berhasil",
        description: "Data pendaftar berhasil diexport ke CSV",
      });
    } catch (error) {
      console.error('Error exporting registrations:', error);
      toast({
        title: "Error",
        description: "Gagal mengexport data pendaftar",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SPMB (Seleksi Penerimaan Mahasiswa Baru)</h1>
            <p className="text-gray-600 dark:text-gray-300">Kelola pendaftaran mahasiswa baru</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={exportRegistrationsToCSV}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendaftar Baru</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrations.filter(r => r.status === 'pending').length}</div>
              <p className="text-xs text-muted-foreground">Menunggu review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diterima</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrations.filter(r => r.status === 'approved').length}</div>
              <p className="text-xs text-muted-foreground">
                {registrations.length > 0 
                  ? `${Math.round((registrations.filter(r => r.status === 'approved').length / registrations.length) * 100)}% dari total` 
                  : '0% dari total'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dalam Review</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrations.filter(r => r.status === 'pending').length}</div>
              <p className="text-xs text-muted-foreground">Perlu tindakan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Periode SPMB</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{registrationPeriod.academicYear}</div>
              <p className="text-xs text-muted-foreground">
                {registrationPeriod.isOpen ? 'Aktif' : 'Tidak Aktif'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="registrations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="registrations">Pendaftar</TabsTrigger>
            <TabsTrigger value="form">Formulir Pendaftaran</TabsTrigger>
            <TabsTrigger value="schedule">Jadwal Tes</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Pendaftar</CardTitle>
                <CardDescription>
                  Kelola semua pendaftar SPMB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Cari nama pendaftar atau orang tua..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('all')}
                    >
                      Semua
                    </Button>
                    <Button
                      variant={statusFilter === 'pending' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('pending')}
                    >
                      Pending
                    </Button>
                    <Button
                      variant={statusFilter === 'approved' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('approved')}
                    >
                      Diterima
                    </Button>
                    <Button
                      variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('rejected')}
                    >
                      Ditolak
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Memuat data...</p>
                  </div>
                ) : filteredRegistrations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Tidak ada data pendaftar yang ditemukan</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Orang Tua</TableHead>
                          <TableHead>Kontak</TableHead>
                          <TableHead>Tanggal Daftar</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRegistrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell className="font-medium">{registration.nama_lengkap}</TableCell>
                            <TableCell>{registration.program_pilihan}</TableCell>
                            <TableCell>{registration.parent_name}</TableCell>
                            <TableCell>{registration.phone}</TableCell>
                            <TableCell>{new Date(registration.created_at).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  registration.status === 'approved' ? 'default' :
                                  registration.status === 'rejected' ? 'destructive' : 'outline'
                                }
                              >
                                {registration.status === 'approved' ? 'Diterima' :
                                 registration.status === 'rejected' ? 'Ditolak' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {registration.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                      onClick={() => updateRegistrationStatus(registration.id, 'approved')}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                      onClick={() => updateRegistrationStatus(registration.id, 'rejected')}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Konfigurasi Formulir Pendaftaran</CardTitle>
                <CardDescription>
                  Atur field yang akan ditampilkan pada formulir pendaftaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {formConfig.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{field.label}</h3>
                          <p className="text-sm text-gray-500">
                            Tipe: {field.type} | {field.required ? 'Wajib' : 'Opsional'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newConfig = [...formConfig];
                              newConfig[index].required = !newConfig[index].required;
                              setFormConfig(newConfig);
                            }}
                          >
                            {field.required ? 'Jadikan Opsional' : 'Jadikan Wajib'}
                          </Button>
                          {index > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newConfig = [...formConfig];
                                [newConfig[index - 1], newConfig[index]] = [newConfig[index], newConfig[index - 1]];
                                setFormConfig(newConfig);
                              }}
                            >
                              Naik
                            </Button>
                          )}
                          {index < formConfig.length - 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newConfig = [...formConfig];
                                [newConfig[index], newConfig[index + 1]] = [newConfig[index + 1], newConfig[index]];
                                setFormConfig(newConfig);
                              }}
                            >
                              Turun
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`field-label-${index}`}>Label Field</Label>
                          <Input
                            id={`field-label-${index}`}
                            value={field.label}
                            onChange={(e) => {
                              const newConfig = [...formConfig];
                              newConfig[index].label = e.target.value;
                              setFormConfig(newConfig);
                            }}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`field-type-${index}`}>Tipe Field</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: any) => {
                              const newConfig = [...formConfig];
                              newConfig[index].type = value;
                              setFormConfig(newConfig);
                            }}
                          >
                            <SelectTrigger id={`field-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="tel">Telepon</SelectItem>
                              <SelectItem value="date">Tanggal</SelectItem>
                              <SelectItem value="textarea">Text Area</SelectItem>
                              <SelectItem value="select">Dropdown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {field.type === 'select' && (
                          <div className="md:col-span-2">
                            <Label htmlFor={`field-options-${index}`}>Opsi (pisahkan dengan koma)</Label>
                            <Input
                              id={`field-options-${index}`}
                              value={field.options?.join(', ') || ''}
                              onChange={(e) => {
                                const newConfig = [...formConfig];
                                newConfig[index].options = e.target.value.split(',').map(opt => opt.trim());
                                setFormConfig(newConfig);
                              }}
                            />
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <Label htmlFor={`field-placeholder-${index}`}>Placeholder</Label>
                          <Input
                            id={`field-placeholder-${index}`}
                            value={field.placeholder || ''}
                            onChange={(e) => {
                              const newConfig = [...formConfig];
                              newConfig[index].placeholder = e.target.value;
                              setFormConfig(newConfig);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormConfig([...formConfig, {
                          id: `field-${Date.now()}`,
                          label: 'Field Baru',
                          type: 'text',
                          required: false,
                          placeholder: 'Placeholder'
                        }]);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Field
                    </Button>
                    <Button onClick={saveFormConfig}>Simpan Konfigurasi</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Jadwal Tes Masuk</CardTitle>
                    <CardDescription>
                      Atur jadwal tes masuk untuk calon siswa
                    </CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingTestSchedule(null);
                    setNewTestSchedule({
                      title: '',
                      date: '',
                      time: '',
                      location: '',
                      description: '',
                      program: ''
                    });
                    setIsTestScheduleOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Jadwal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testSchedules.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Belum ada jadwal tes yang ditambahkan</p>
                    </div>
                  ) : (
                    testSchedules.map((schedule) => (
                      <div key={schedule.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{schedule.title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              <div>
                                <p className="text-sm text-gray-500">Tanggal: {new Date(schedule.date).toLocaleDateString('id-ID')}</p>
                                <p className="text-sm text-gray-500">Waktu: {schedule.time}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Lokasi: {schedule.location}</p>
                                <p className="text-sm text-gray-500">Program: {schedule.program}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{schedule.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingTestSchedule(schedule);
                                setNewTestSchedule({
                                  title: schedule.title,
                                  date: schedule.date,
                                  time: schedule.time,
                                  location: schedule.location,
                                  description: schedule.description,
                                  program: schedule.program
                                });
                                setIsTestScheduleOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteTestSchedule(schedule.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Dialog open={isTestScheduleOpen} onOpenChange={setIsTestScheduleOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTestSchedule ? 'Edit Jadwal Tes' : 'Tambah Jadwal Tes Baru'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="test-title">Judul Tes</Label>
                    <Input
                      id="test-title"
                      value={newTestSchedule.title}
                      onChange={(e) => setNewTestSchedule({...newTestSchedule, title: e.target.value})}
                      placeholder="Contoh: Tes Masuk TKA/TPA"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="test-date">Tanggal</Label>
                      <Input
                        id="test-date"
                        type="date"
                        value={newTestSchedule.date}
                        onChange={(e) => setNewTestSchedule({...newTestSchedule, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="test-time">Waktu</Label>
                      <Input
                        id="test-time"
                        value={newTestSchedule.time}
                        onChange={(e) => setNewTestSchedule({...newTestSchedule, time: e.target.value})}
                        placeholder="Contoh: 08:00 - 11:00"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="test-location">Lokasi</Label>
                    <Input
                      id="test-location"
                      value={newTestSchedule.location}
                      onChange={(e) => setNewTestSchedule({...newTestSchedule, location: e.target.value})}
                      placeholder="Contoh: Gedung Utama Al-Hikmah"
                    />
                  </div>
                  <div>
                    <Label htmlFor="test-program">Program</Label>
                    <Select
                      value={newTestSchedule.program}
                      onValueChange={(value) => setNewTestSchedule({...newTestSchedule, program: value})}
                    >
                      <SelectTrigger id="test-program">
                        <SelectValue placeholder="Pilih program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TKA/TPA">TKA/TPA</SelectItem>
                        <SelectItem value="PAUD/KOBER">PAUD/KOBER</SelectItem>
                        <SelectItem value="Diniyah">Diniyah</SelectItem>
                        <SelectItem value="Semua Program">Semua Program</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="test-description">Deskripsi</Label>
                    <Textarea
                      id="test-description"
                      value={newTestSchedule.description}
                      onChange={(e) => setNewTestSchedule({...newTestSchedule, description: e.target.value})}
                      placeholder="Deskripsi tentang tes yang akan dilaksanakan"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsTestScheduleOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={saveTestSchedule}>
                      {editingTestSchedule ? 'Update' : 'Simpan'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Periode SPMB</CardTitle>
                <CardDescription>
                  Atur periode pendaftaran SPMB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Status Pendaftaran</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Aktifkan atau nonaktifkan pendaftaran SPMB</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={registrationPeriod.isOpen ? 'text-green-600' : 'text-red-600'}>
                        {registrationPeriod.isOpen ? 'Dibuka' : 'Ditutup'}
                      </span>
                      <Button
                        variant={registrationPeriod.isOpen ? 'destructive' : 'default'}
                        onClick={() => setRegistrationPeriod({...registrationPeriod, isOpen: !registrationPeriod.isOpen})}
                      >
                        {registrationPeriod.isOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="academic-year">Tahun Ajaran</Label>
                      <Input
                        id="academic-year"
                        value={registrationPeriod.academicYear}
                        onChange={(e) => setRegistrationPeriod({...registrationPeriod, academicYear: e.target.value})}
                        placeholder="Contoh: 2025/2026"
                      />
                    </div>
                    <div>
                      <Label htmlFor="start-date">Tanggal Mulai</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={registrationPeriod.startDate}
                        onChange={(e) => setRegistrationPeriod({...registrationPeriod, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">Tanggal Selesai</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={registrationPeriod.endDate}
                        onChange={(e) => setRegistrationPeriod({...registrationPeriod, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button onClick={saveRegistrationPeriod} className="w-full">
                    Simpan Pengaturan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => {
                      // Approve all pending registrations
                      if (window.confirm('Apakah Anda yakin ingin menyetujui semua pendaftar yang masih pending?')) {
                        const pendingIds = registrations
                          .filter(r => r.status === 'pending')
                          .map(r => r.id);
                        
                        if (pendingIds.length === 0) {
                          toast({
                            title: "Info",
                            description: "Tidak ada pendaftar yang masih pending",
                          });
                          return;
                        }
                        
                        Promise.all(
                          pendingIds.map(id => 
                            supabase
                              .from('ppdb_registrations')
                              .update({ status: 'approved' })
                              .eq('id', id)
                          )
                        )
                        .then(() => {
                          loadRegistrations();
                          toast({
                            title: "Berhasil",
                            description: `${pendingIds.length} pendaftar telah disetujui`,
                          });
                        })
                        .catch(error => {
                          console.error('Error approving all registrations:', error);
                          toast({
                            title: "Error",
                            description: "Gagal menyetujui semua pendaftar",
                            variant: "destructive",
                          });
                        });
                      }
                    }}
                  >
                    <CheckCircle className="h-8 w-8 mb-2 text-green-600" />
                    <span>Setujui Semua Pending</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-6 flex flex-col items-center justify-center"
                    onClick={() => {
                      // Export all data to CSV
                      exportRegistrationsToCSV();
                    }}
                  >
                    <Download className="h-8 w-8 mb-2 text-blue-600" />
                    <span>Export Semua Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default PPDBAdmin;