import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  GraduationCap, 
  Download, 
  Upload, 
  Printer,
  FileDown
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Graduate } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import GraduateForm from '@/components/admin/GraduateForm';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const GraduatesAdmin = () => {
  const { user, loading } = useAuth();
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGraduate, setEditingGraduate] = useState<Graduate | null>(null);
  const [years, setYears] = useState<string[]>(['all']);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');

  useEffect(() => {
    if (user) {
      loadGraduates();
    }
  }, [user]);

  const loadGraduates = async () => {
    try {
      const { data, error } = await supabase
        .from('graduates')
        .select('*')
        .order('graduation_year', { ascending: false })
        .order('name', { ascending: true });

      if (error) throw error;
      
      setGraduates(data || []);
      
      // Extract unique years for filtering
      const uniqueYears = Array.from(
        new Set((data || []).map(g => g.graduation_year.toString()))
      ).sort((a, b) => parseInt(b) - parseInt(a));
      
      setYears(['all', ...uniqueYears]);
    } catch (error) {
      console.error('Error loading graduates:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data lulusan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGraduate = async (graduateData: Partial<Graduate>) => {
    try {
      const { data, error } = await supabase
        .from('graduates')
        .insert({
          name: graduateData.name!,
          program: graduateData.program!,
          graduation_year: graduateData.graduation_year!,
          achievement: graduateData.achievement || null,
          current_school: graduateData.current_school || null,
          photo: graduateData.photo || null
        })
        .select()
        .single();

      if (error) throw error;

      loadGraduates();
      setShowForm(false);
      toast({
        title: "Berhasil",
        description: "Lulusan berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error adding graduate:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan lulusan",
        variant: "destructive",
      });
    }
  };

  const handleEditGraduate = async (graduateData: Partial<Graduate>) => {
    if (!editingGraduate) return;
    
    try {
      const { error } = await supabase
        .from('graduates')
        .update({
          name: graduateData.name,
          program: graduateData.program,
          graduation_year: graduateData.graduation_year,
          achievement: graduateData.achievement || null,
          current_school: graduateData.current_school || null,
          photo: graduateData.photo || null
        })
        .eq('id', editingGraduate.id);

      if (error) throw error;

      loadGraduates();
      setShowForm(false);
      setEditingGraduate(null);
      toast({
        title: "Berhasil",
        description: "Data lulusan berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating graduate:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui data lulusan",
        variant: "destructive",
      });
    }
  };

  const deleteGraduate = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data lulusan ini?')) {
      try {
        const { error } = await supabase
          .from('graduates')
          .delete()
          .eq('id', id);

        if (error) throw error;

        loadGraduates();
        toast({
          title: "Berhasil",
          description: "Data lulusan berhasil dihapus",
        });
      } catch (error) {
        console.error('Error deleting graduate:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus data lulusan",
          variant: "destructive",
        });
      }
    }
  };

  const exportData = () => {
    const filteredData = graduates.filter(graduate => {
      const matchesSearch = graduate.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'all' || graduate.graduation_year.toString() === selectedYear;
      return matchesSearch && matchesYear;
    });

    const exportData = filteredData.map(graduate => ({
      'Nama': graduate.name,
      'Program': graduate.program,
      'Tahun Lulus': graduate.graduation_year,
      'Prestasi': graduate.achievement || '-',
      'Sekolah Lanjutan': graduate.current_school || '-'
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
    link.setAttribute('download', `lulusan-${selectedYear !== 'all' ? selectedYear : 'semua'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lulusan');
    XLSX.writeFile(workbook, `lulusan-${selectedYear !== 'all' ? selectedYear : 'semua'}.xlsx`);
  };

  const exportToPDF = (data: any[]) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Data Lulusan Al-Hikmah', 14, 15);
    
    // Add subtitle with year filter
    doc.setFontSize(12);
    doc.text(`Tahun: ${selectedYear !== 'all' ? selectedYear : 'Semua Tahun'}`, 14, 25);
    
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
    
    doc.save(`lulusan-${selectedYear !== 'all' ? selectedYear : 'semua'}.pdf`);
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
          const requiredFields = ['name', 'program', 'graduation_year'];
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
          const graduates = json.map((row: any) => {
            // Find the appropriate keys in the row
            const nameKey = Object.keys(row).find(key => key.toLowerCase().includes('nama'));
            const programKey = Object.keys(row).find(key => key.toLowerCase().includes('program'));
            const yearKey = Object.keys(row).find(key => key.toLowerCase().includes('tahun') || key.toLowerCase().includes('year'));
            const achievementKey = Object.keys(row).find(key => key.toLowerCase().includes('prestasi') || key.toLowerCase().includes('achievement'));
            const schoolKey = Object.keys(row).find(key => key.toLowerCase().includes('sekolah') || key.toLowerCase().includes('school'));
            
            // Extract values
            const name = row[nameKey || 'name'] || '';
            const program = row[programKey || 'program'] || '';
            const graduationYear = parseInt(row[yearKey || 'graduation_year']) || new Date().getFullYear();
            const achievement = row[achievementKey || 'achievement'] || null;
            const currentSchool = row[schoolKey || 'current_school'] || null;
            
            // Validate program value
            let validProgram: 'TKA/TPA' | 'PAUD/KOBER' | 'Diniyah';
            if (program.includes('TKA') || program.includes('TPA')) {
              validProgram = 'TKA/TPA';
            } else if (program.includes('PAUD') || program.includes('KOBER')) {
              validProgram = 'PAUD/KOBER';
            } else {
              validProgram = 'Diniyah';
            }
            
            return {
              name,
              program: validProgram,
              graduation_year: graduationYear,
              achievement,
              current_school: currentSchool
            };
          });
          
          // Insert data into Supabase
          const { data, error } = await supabase
            .from('graduates')
            .insert(graduates);
          
          if (error) throw error;
          
          toast({
            title: "Berhasil",
            description: `${graduates.length} data lulusan berhasil diimpor`,
          });
          
          loadGraduates();
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
    const filteredData = graduates.filter(graduate => {
      const matchesSearch = graduate.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = selectedYear === 'all' || graduate.graduation_year.toString() === selectedYear;
      return matchesSearch && matchesYear;
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
          <title>Data Lulusan Al-Hikmah</title>
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
          <h1>Data Lulusan Al-Hikmah</h1>
          <h2>Tahun: ${selectedYear !== 'all' ? selectedYear : 'Semua Tahun'}</h2>
          <div class="print-date">Dicetak pada: ${new Date().toLocaleDateString('id-ID')}</div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Program</th>
                <th>Tahun Lulus</th>
                <th>Prestasi</th>
                <th>Sekolah Lanjutan</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map((graduate, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${graduate.name}</td>
                  <td>${graduate.program}</td>
                  <td>${graduate.graduation_year}</td>
                  <td>${graduate.achievement || '-'}</td>
                  <td>${graduate.current_school || '-'}</td>
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

  const filteredGraduates = graduates.filter(graduate => {
    const matchesSearch = graduate.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || graduate.graduation_year.toString() === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {showForm ? (
          <GraduateForm
            graduate={editingGraduate}
            onSubmit={editingGraduate ? handleEditGraduate : handleAddGraduate}
            onCancel={() => {
              setShowForm(false);
              setEditingGraduate(null);
            }}
          />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Lulusan</h1>
                <p className="text-gray-600">Manajemen data lulusan Al-Hikmah</p>
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
                  Tambah Lulusan
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
                        placeholder="Cari nama lulusan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {years.map((year) => (
                      <Button
                        key={year}
                        variant={selectedYear === year ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedYear(year)}
                        className={selectedYear === year ? "gradient-primary" : ""}
                      >
                        {year === 'all' ? 'Semua' : year}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Graduates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Memuat data...</p>
                </div>
              ) : filteredGraduates.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">Tidak ada lulusan yang ditemukan</p>
                  </CardContent>
                </Card>
              ) : (
                filteredGraduates.map((graduate) => (
                  <Card key={graduate.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        {graduate.photo ? (
                          <img 
                            src={graduate.photo} 
                            alt={graduate.name}
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="h-10 w-10 text-white" />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900 mb-2">{graduate.name}</h3>
                        <Badge variant="secondary" className="mb-3">{graduate.program}</Badge>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-500">Tahun Lulus</p>
                            <p className="font-medium">{graduate.graduation_year}</p>
                          </div>
                          {graduate.current_school && (
                            <div>
                              <p className="text-gray-500">Sekolah Sekarang</p>
                              <p className="font-medium">{graduate.current_school}</p>
                            </div>
                          )}
                          {graduate.achievement && (
                            <div>
                              <p className="text-gray-500">Prestasi</p>
                              <p className="font-medium">{graduate.achievement}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingGraduate(graduate);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteGraduate(graduate.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default GraduatesAdmin;