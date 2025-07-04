import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, User, BookOpen, UserPlus, Calendar, TrendingUp, Award } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalTeachers: 0,
    totalGraduates: 0,
    totalPrograms: 3,
    pendingSPMB: 0,
    newStudentsThisMonth: 0,
    graduatesThisYear: 0
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentActivities();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Get total students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, status, created_at');
      
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
      
      // Get pending SPMB registrations
      const { data: pendingPPDB, error: ppdbError } = await supabase
        .from('ppdb_registrations')
        .select('id')
        .eq('status', 'pending');

      if (ppdbError) throw ppdbError;
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      
      // Filter for new students this month
      const newStudentsThisMonth = students?.filter(student => {
        const createdDate = new Date(student.created_at);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      }).length || 0;
      
      // Filter for graduates this year
      const graduatesThisYear = graduates?.filter(graduate => 
        graduate.graduation_year === currentYear
      ).length || 0;
      
      setStats({
        totalStudents: students?.length || 0,
        activeStudents: students?.filter(s => s.status === 'active').length || 0,
        totalTeachers: teachers?.length || 0,
        totalGraduates: graduates?.length || 0,
        totalPrograms: 3,
        pendingSPMB: pendingPPDB?.length || 0,
        newStudentsThisMonth,
        graduatesThisYear
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setIsLoading(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      // Get recent students
      const { data: recentStudents, error: studentsError } = await supabase
        .from('students')
        .select('name, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (studentsError) throw studentsError;
      
      // Get recent SPMB registrations
      const { data: recentPPDB, error: ppdbError } = await supabase
        .from('ppdb_registrations')
        .select('id, nama_lengkap, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (ppdbError) throw ppdbError;
      
      const activities = [
        ...(recentStudents || []).map((s: any) => ({
          name: s.name,
          created_at: s.created_at,
          type: 'student'
        })),
        ...(recentPPDB || []).map((p: any) => ({
          name: p.nama_lengkap,
          created_at: p.created_at,
          type: 'spmb'
        }))
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      setRecentActivities(activities);
    } catch (error) {
      console.error('Error loading recent activities:', error);
    }
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'addStudent':
        navigate('/pengaturan', { state: { activeTab: 'students', showForm: true } });
        break;
      case 'manageSPMB':
        navigate('/pengaturan', { state: { activeTab: 'ppdb' } });
        break;
      case 'viewReports':
        navigate('/pengaturan', { state: { activeTab: 'reports' } });
        break;
      case 'settings':
        navigate('/pengaturan', { state: { activeTab: 'settings' } });
        break;
      default:
        break;
    }
  };

  const statCards = [
    {
      title: 'Total Siswa',
      value: stats.totalStudents,
      subtitle: `${stats.activeStudents} aktif`,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      change: `+${stats.newStudentsThisMonth} bulan ini`
    },
    {
      title: 'Total Pengajar',
      value: stats.totalTeachers,
      subtitle: 'Staf aktif',
      icon: User,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      change: 'Semua aktif'
    },
    {
      title: 'Total Lulusan',
      value: stats.totalGraduates,
      subtitle: `${stats.graduatesThisYear} tahun ini`,
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      change: 'Berprestasi'
    },
    {
      title: 'SPMB Pending',
      value: stats.pendingSPMB,
      subtitle: 'Menunggu review',
      icon: UserPlus,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      change: 'Perlu tindakan'
    }
  ];

  const quickActions = [
    { 
      title: 'Tambah Siswa Baru', 
      icon: Users, 
      color: 'bg-blue-500', 
      action: () => handleQuickAction('addStudent') 
    },
    { 
      title: 'Kelola SPMB', 
      icon: UserPlus, 
      color: 'bg-green-500', 
      action: () => handleQuickAction('manageSPMB') 
    },
    { 
      title: 'Lihat Laporan', 
      icon: BookOpen, 
      color: 'bg-purple-500', 
      action: () => handleQuickAction('viewReports') 
    },
    { 
      title: 'Pengaturan', 
      icon: Award, 
      color: 'bg-orange-500', 
      action: () => handleQuickAction('settings') 
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Selamat Datang di Dashboard Al-Hikmah</h1>
            <p className="text-blue-100 text-lg">Kelola sistem pendidikan dengan mudah dan efisien</p>
          </div>
          <div className="hidden md:block">
            <Calendar className="h-16 w-16 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${stat.bgColor} border-0 dark:bg-gray-800/90 dark:border-gray-700`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 dark:bg-gray-800/90 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Award className="h-5 w-5 text-blue-600" />
              <span>Aksi Cepat</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-700 p-4 h-auto text-gray-900 dark:text-white"
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{action.title}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 dark:bg-gray-800/90 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Aktivitas Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : recentActivities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">Belum ada aktivitas terbaru</p>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className={`p-2 rounded-full ${activity.type === 'student' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-green-100 dark:bg-green-900/50'}`}>
                      {activity.type === 'student' ? (
                        <Users className={`h-4 w-4 ${activity.type === 'student' ? 'text-blue-600' : 'text-green-600'}`} />
                      ) : (
                        <UserPlus className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.type === 'student' ? 'Siswa baru terdaftar' : 'Pendaftar SPMB baru'}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Overview */}
      <Card className="dark:bg-gray-800/90 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <span>Program Pendidikan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['TKA/TPA', 'Kober/PAUD', 'Madrasah Diniyah'].map((program, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
              return (
                <div key={program} className="text-center">
                  <div className={`w-16 h-16 ${colors[index]} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{program}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Program pendidikan berkualitas</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDashboard;