import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload, 
  Printer,
  FileDown
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import StudentForm from '@/components/students/StudentForm';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const StudentsAdmin = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');

  useEffect(() => {
    if (user) {
      loadStudents();
    }
  }, [user]);

  useEffect(() => {
    // Check if we're coming from a quick action in the dashboard
    if (location.state?.showForm) {
      setShowForm(true);
    }
  }, [location]);

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data siswa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (studentData: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          name: studentData.name!,
          program: studentData.program!,
          class: studentData.class!,
          parent_name: studentData.parent_name!,
          phone: studentData.phone!,
          address: studentData.address!,
          birth_date: studentData.birth_date,
          photo: studentData.photo,
          status: studentData.status || 'active'
        })
        .select()
        .single();

      if (error) throw error;

      loadStudents();
      setShowForm(false);
      toast({
        title: "Berhasil",
        description: "Siswa berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan siswa",
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = async (studentData: Partial<Student>) => {
    if (!editingStudent) return;
    
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: studentData.name,
          program: studentData.program,
          class: studentData.class,
          parent_name: studentData.parent_name,
          phone: studentData.phone,
          address: studentData.address,
          birth_date: studentData.birth_date,
          photo: studentData.photo,
          status: studentData.status
        })
        .eq('id', editingStudent.id);

      if (error) throw error;

      loadStudents();
      setShowForm(false);
      setEditingStudent(null);
      toast({
        title: "Berhasil",
        description: "Data siswa berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui data siswa",
        variant: "destructive",
      });
    }
  };

  const deleteStudent = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
      try {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', id);

        if (error) throw error;

        loadStudents();
        toast({
          title: "Berhasil",
          description: "Siswa berhasil dihapus",
        });
      } catch (error) {
        console.error('Error deleting student:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus siswa",
          variant: "destructive",
        });
      }
    }
  };

  const exportData = () => {
    const filteredData = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.parent_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgram = selectedProgram === 'all' || student.program === selectedProgram;
      return matchesSearch && matchesProgram;
    });

    const exportData = filteredData.map(student => ({
      'Nama': student.name,
      'Program': student.program,
      'Kelas': student.class,
      'Nama Orang Tua': student.parent_name,
      'Telepon': student.phone,
      'Alamat': student.address,
      'Tanggal Lahir': student.birth_date || '-',
      'Status': student.status === 'active' ? 'Aktif' : student.status === 'graduated' ? 'Lulus' : 'Tidak Aktif'
    }));

    if (exportFormat === 'csv') {
      exportToCSV(exportData);
    } else if (exportFormat === 'excel') {
      exportToExcel(exportData);
    } else if (exportFormat === 'pdf') {
      exportToPDF(exportData);
    }
  };

  const exportToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).join(',');
    const csvRows = [headers];
    
    data.forEach(row => {
      const values = Object.values(row).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      );
      csvRows.push(values.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `siswa-${selectedProgram !== 'all' ? selectedProgram : 'semua'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Siswa');
    XLSX.writeFile(workbook, `siswa-${selectedProgram !== 'all' ? selectedProgram : 'semua'}.xlsx`);
  };

  const exportToPDF = (data: any[]) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Data Siswa Al-Hikmah', 14, 15);
    
    // Add subtitle with program filter
    doc.setFontSize(12);
    doc.text(`Program: ${selectedProgram !== 'all' ? selectedProgram : 'Semua Program'}`, 14, 25);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
    
    // Create table
    const tableColumn = Object.keys(data[0]);
    const tableRows = data.map(item => Object.values(item));
    
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [63, 81, 181], textColor: 255 }
    });
    
    doc.save(`siswa-${selectedProgram !== 'all' ? selectedProgram : 'semua'}.pdf`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileContent = e.target?.result;
          const workbook = XLSX.read(fileContent, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          
          // Validate data structure
          if (json.length === 0) {
            throw new Error('File tidak berisi data');
          }
          
          // Check required fields
          const requiredFields = ['name', 'program', 'class', 'parent_name', 'phone', 'address'];
          const firstRow = json[0] as any;
          
          const missingFields = requiredFields.filter(field => 
            !Object.keys(firstRow).some(key => 
              key.toLowerCase().includes(field.toLowerCase())
            )
          );
          
          if (missingFields.length > 0) {
            throw new Error(`File tidak memiliki kolom wajib: ${missingFields.join(', ')}`);
          }
          
          // Map data to our structure
          const students = json.map((row: any) => {
            // Find the appropriate keys in the row
            const nameKey = Object.keys(row).find(key => key.toLowerCase().includes('nama') && !key.toLowerCase().includes('orang'));
            const programKey = Object.keys(row).find(key => key.toLowerCase().includes('program'));
            const classKey = Object.keys(row).find(key => key.toLowerCase().includes('kelas') || key.toLowerCase().includes('class'));
            const parentKey = Object.keys(row).find(key => key.toLowerCase().includes('orang tua') || key.toLowerCase().includes('wali'));
            const phoneKey = Object.keys(row).find(key => key.toLowerCase().includes('telepon') || key.toLowerCase().includes('phone'));
            const addressKey = Object.keys(row).find(key => key.toLowerCase().includes('alamat') || key.toLowerCase().includes('address'));
            const birthDateKey = Object.keys(row).find(key => key.toLowerCase().includes('lahir') || key.toLowerCase().includes('birth'));
            const statusKey = Object.keys(row).find(key => key.toLowerCase().includes('status'));
            
            // Extract values
            const name = row[nameKey || 'name'] || '';
            const program = row[programKey || 'program'] || '';
            const className = row[classKey || 'class'] || '';
            const parentName = row[parentKey || 'parent_name'] || '';
            const phone = row[phoneKey || 'phone'] || '';
            const address = row[addressKey || 'address'] || '';
            const birthDate = row[birthDateKey || 'birth_date'] || null;
            let status = row[statusKey || 'status'] || 'active';
            
            // Validate program value
            let validProgram: 'TKA/TPA' | 'PAUD/KOBER' | 'Diniyah';
            if (program.includes('TKA') || program.includes('TPA')) {
              validProgram = 'TKA/TPA';
            } else if (program.includes('PAUD') || program.includes('KOBER')) {
              validProgram = 'PAUD/KOBER';
            } else {
              validProgram = 'Diniyah';
            }
            
            // Validate status value
            if (status.toLowerCase().includes('aktif') || status.toLowerCase().includes('active')) {
              status = 'active';
            } else if (status.toLowerCase().includes('lulus') || status.toLowerCase().includes('graduate')) {
              status = 'graduated';
            } else {
              status = 'inactive';
            }
            
            return {
              name,
              program: validProgram,
              class: className,
              parent_name: parentName,
              phone,
              address,
              birth_date: birthDate,
              status
            };
          });
          
          // Insert data into Supabase
          const { data, error } = await supabase
            .from('students')
            .insert(students);
          
          if (error) throw error;
          
          toast({
            title: "Berhasil",
            description: `${students.length} data siswa berhasil diimpor`,
          });
          
          loadStudents();
        } catch (error: any) {
          console.error('Error processing file:', error);
          toast({
            title: "Error",
            description: error.message || "Gagal memproses file",
            variant: "destructive",
          });
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Error",
        description: "Gagal membaca file",
        variant: "destructive",
      });
    }
  };

  const printData = () => {
    const filteredData = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.parent_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgram = selectedProgram === 'all' || student.program === selectedProgram;
      return matchesSearch && matchesProgram;
    });
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Gagal membuka jendela cetak. Pastikan popup tidak diblokir.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate HTML content
    printWindow.document.write(`
      <html>
        <head>
          <title>Data Siswa Al-Hikmah</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 10px; }
            h2 { text-align: center; margin-bottom: 20px; color: #666; font-size: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .print-date { text-align: right; margin-bottom: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Data Siswa Al-Hikmah</h1>
          <h2>Program: ${selectedProgram !== 'all' ? selectedProgram : 'Semua Program'}</h2>
          <div class="print-date">Dicetak pada: ${new Date().toLocaleDateString('id-ID')}</div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Program</th>
                <th>Kelas</th>
                <th>Nama Orang Tua</th>
                <th>Telepon</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((student, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${student.name}</td>
                  <td>${student.program}</td>
                  <td>${student.class}</td>
                  <td>${student.parent_name}</td>
                  <td>${student.phone}</td>
                  <td>${student.status === 'active' ? 'Aktif' : student.status === 'graduated' ? 'Lulus' : 'Tidak Aktif'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    // Print and close
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
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

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parent_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || student.program === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  const programs = ['all', 'TKA/TPA', 'PAUD/KOBER', 'Diniyah'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {showForm ? (
          <StudentForm
            student={editingStudent}
            onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
            onCancel={() => {
              setShowForm(false);
              setEditingStudent(null);
            }}
          />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Siswa</h1>
                <p className="text-gray-600">Manajemen data siswa Al-Hikmah</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <label className="cursor-pointer flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Import</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".xlsx,.xls,.csv" 
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
                <div className="flex items-center gap-2">
                  <Select 
                    value={exportFormat} 
                    onValueChange={(value: any) => setExportFormat(value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    onClick={exportData}
                    className="flex items-center gap-2"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
                <Button 
                  variant="outline"
                  onClick={printData}
                  className="flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </Button>
                <Button 
                  className="gradient-primary"
                  onClick={() => setShowForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Siswa
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Cari nama siswa atau wali..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {programs.map((program) => (
                      <Button
                        key={program}
                        variant={selectedProgram === program ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedProgram(program)}
                        className={selectedProgram === program ? "gradient-primary" : ""}
                      >
                        {program === 'all' ? 'Semua' : program}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students List */}
            <div className="grid gap-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Memuat data...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">Tidak ada siswa yang ditemukan</p>
                  </CardContent>
                </Card>
              ) : (
                filteredStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            {student.photo ? (
                              <img 
                                src={student.photo} 
                                alt={student.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.class} • {student.parent_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{student.program}</Badge>
                              <Badge 
                                variant={student.status === 'active' ? 'default' : 'outline'}
                                className={student.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {student.status === 'active' ? 'Aktif' : student.status === 'graduated' ? 'Lulus' : 'Tidak Aktif'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingStudent(student);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteStudent(student.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Telepon</p>
                          <p className="font-medium">{student.phone || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Alamat</p>
                          <p className="font-medium truncate">{student.address || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tgl Lahir</p>
                          <p className="font-medium">{student.birth_date ? new Date(student.birth_date).toLocaleDateString('id-ID') : '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tgl Daftar</p>
                          <p className="font-medium">{new Date(student.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentsAdmin;