import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, Users, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const ReportsAdmin = () => {
  const { user, loading } = useAuth();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalTeachers: 0,
    totalGraduates: 0,
    graduatesThisYear: 0
  });
  const [studentData, setStudentData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStats();
      loadChartData();
    }
  }, [user, selectedYear]);

  const loadStats = async () => {
    try {
      // Get total students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, status');
      
      if (studentsError) throw studentsError;
      
      // Get total teachers
      const { data: teachers, error: teachersError } = await supabase
        .from('teachers')
        .select('id');
      
      if (teachersError) throw teachersError;
      
      // Get total graduates
      const { data: graduates, error: graduatesError } = await supabase
        .from('graduates')
        .select('id, graduation_year');
      
      if (graduatesError) throw graduatesError;
      
      const currentYear = parseInt(selectedYear);
      
      setStats({
        totalStudents: students?.length || 0,
        activeStudents: students?.filter(s => s.status === 'active').length || 0,
        totalTeachers: teachers?.length || 0,
        totalGraduates: graduates?.length || 0,
        graduatesThisYear: graduates?.filter(g => g.graduation_year === currentYear).length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadChartData = async () => {
    try {
      setIsLoading(true);
      
      // Get students by program for pie chart
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('program, status');
      
      if (studentsError) throw studentsError;
      
      // Process program distribution data
      const programCounts = {
        'TKA/TPA': 0,
        'PAUD/KOBER': 0,
        'Diniyah': 0
      };
      
      students?.forEach(student => {
        if (programCounts[student.program] !== undefined) {
          programCounts[student.program]++;
        }
      });
      
      const programChartData = [
        { name: 'TKA/TPA', value: programCounts['TKA/TPA'], color: '#8B5CF6' },
        { name: 'PAUD/KOBER', value: programCounts['PAUD/KOBER'], color: '#06B6D4' },
        { name: 'Diniyah', value: programCounts['Diniyah'], color: '#10B981' },
      ];
      
      setProgramData(programChartData);
      
      // Generate monthly data for bar chart
      // This would typically come from a database query aggregating by month
      // For now, we'll generate sample data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = months.map(month => {
        return {
          month,
          'TKA/TPA': Math.floor(Math.random() * 10) + 10,
          'PAUD/KOBER': Math.floor(Math.random() * 8) + 8,
          'Diniyah': Math.floor(Math.random() * 12) + 15
        };
      });
      
      setStudentData(monthlyData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading chart data:', error);
      setIsLoading(false);
    }
  };

  const exportReportToCSV = (reportType: string) => {
    try {
      let csvContent = '';
      let fileName = '';
      
      if (reportType === 'students') {
        // Headers
        csvContent = 'Program,Jumlah Siswa\n';
        
        // Data
        programData.forEach(program => {
          csvContent += `${program.name},${program.value}\n`;
        });
        
        fileName = `laporan-siswa-${selectedYear}.csv`;
      } else if (reportType === 'monthly') {
        // Headers
        csvContent = 'Bulan,TKA/TPA,PAUD/KOBER,Diniyah\n';
        
        // Data
        studentData.forEach(data => {
          csvContent += `${data.month},${data['TKA/TPA']},${data['PAUD/KOBER']},${data['Diniyah']}\n`;
        });
        
        fileName = `laporan-bulanan-${selectedYear}.csv`;
      } else {
        // Summary report
        csvContent = 'Metrik,Nilai\n';
        csvContent += `Total Siswa,${stats.totalStudents}\n`;
        csvContent += `Siswa Aktif,${stats.activeStudents}\n`;
        csvContent += `Total Pengajar,${stats.totalTeachers}\n`;
        csvContent += `Total Lulusan,${stats.totalGraduates}\n`;
        csvContent += `Lulusan Tahun ${selectedYear},${stats.graduatesThisYear}\n`;
        
        fileName = `laporan-ringkasan-${selectedYear}.csv`;
      }
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Berhasil",
        description: "Laporan berhasil diexport ke CSV",
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Error",
        description: "Gagal mengexport laporan",
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
            <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
            <p className="text-gray-600">Analisis data dan statistik lembaga</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              onClick={() => exportReportToCSV('summary')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">{stats.activeStudents} aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lulusan</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGraduates}</div>
              <p className="text-xs text-muted-foreground">{stats.graduatesThisYear} di {selectedYear}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Kelulusan</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalStudents > 0 
                  ? `${Math.round((stats.graduatesThisYear / stats.totalStudents) * 100)}%` 
                  : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">Tahun {selectedYear}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pengajar Aktif</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Profesional</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Perkembangan Siswa per Bulan</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportReportToCSV('monthly')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="TKA/TPA" fill="#8B5CF6" />
                    <Bar dataKey="PAUD/KOBER" fill="#06B6D4" />
                    <Bar dataKey="Diniyah" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Distribusi Siswa per Program</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => exportReportToCSV('students')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={programData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {programData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Report Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => exportReportToCSV('monthly')}
              >
                <Calendar className="h-6 w-6 mb-2" />
                Laporan Bulanan
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => exportReportToCSV('students')}
              >
                <Users className="h-6 w-6 mb-2" />
                Laporan Siswa
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => exportReportToCSV('summary')}
              >
                <TrendingUp className="h-6 w-6 mb-2" />
                Laporan Ringkasan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ReportsAdmin;