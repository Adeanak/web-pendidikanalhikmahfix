import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, GraduationCap, FileText, ClipboardList, School, UserCheck, Shield, LogOut, Bell, Search, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import EnhancedDashboard from '@/components/admin/EnhancedDashboard';
import StudentsAdmin from '@/pages/admin/StudentsAdmin';
import TeachersAdmin from '@/pages/admin/TeachersAdmin';
import GraduatesAdmin from '@/pages/admin/GraduatesAdmin';
import SPMBAdmin from '@/pages/admin/SPMBAdmin';
import ReportsAdmin from '@/pages/admin/ReportsAdmin';
import SettingsAdmin from '@/pages/admin/SettingsAdmin';
import MessageAdmin from '@/pages/admin/MessageAdmin';
import GlobalSearch from '@/components/admin/GlobalSearch';
import NotificationSystem from '@/components/admin/NotificationSystem';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';
import { useLocation, Navigate } from 'react-router-dom';
import RoleBasedAccess, { PERMISSIONS } from '@/components/auth/RoleBasedAccess';

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/pengaturan" replace />;
  }

  useEffect(() => {
    // Load unread notification count
    loadUnreadNotificationCount();
    
    // Set up real-time subscription for notifications
    const notificationSubscription = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, () => {
        loadUnreadNotificationCount();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(notificationSubscription);
    };
  }, [user]);

  useEffect(() => {
    // Check if we're coming from a quick action in the dashboard
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location]);

  const loadUnreadNotificationCount = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .eq('is_read', false);
        
      if (error) throw error;
      
      setUnreadNotifications(data?.length || 0);
    } catch (error) {
      console.error('Error loading unread notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'ketua_yayasan': return 'Ketua Yayasan';
      case 'kepala_sekolah': return 'Kepala Sekolah';
      case 'teacher': return 'Pengajar';
      case 'parent': return 'Wali Santri';
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'ketua_yayasan': return 'bg-gradient-to-r from-blue-500 to-indigo-500';
      case 'kepala_sekolah': return 'bg-gradient-to-r from-green-500 to-teal-500';
      case 'teacher': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'parent': return 'bg-gradient-to-r from-cyan-500 to-blue-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-lg shadow-lg border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center shadow-lg ring-2 ring-blue-400">
                  <img 
                    src="/logo.png" 
                    alt="Al-Hikmah Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Panel Admin Al-Hikmah
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Selamat datang,</span>
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs text-white font-medium ${getRoleBadgeColor(user.role)} shadow-lg`}>
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5 text-gray-600" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-5 w-5 text-gray-300" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </Button>

              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2 hover:bg-red-900/50 hover:text-red-400 hover:border-red-500 transition-all duration-200 shadow-sm border-gray-600 text-gray-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8 bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl p-2 h-auto border border-gray-600">
            <TabsTrigger 
              value="dashboard" 
              className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="students" 
              className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <Users className="h-5 w-5" />
              <span className="text-xs font-medium">Siswa</span>
            </TabsTrigger>
            <TabsTrigger 
              value="teachers" 
              className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <UserCheck className="h-5 w-5" />
              <span className="text-xs font-medium">Pengajar</span>
            </TabsTrigger>
            <TabsTrigger 
              value="graduates" 
              className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <GraduationCap className="h-5 w-5" />
              <span className="text-xs font-medium">Lulusan</span>
            </TabsTrigger>
            <RoleBasedAccess allowedRoles={PERMISSIONS.MANAGEMENT}>
              <TabsTrigger 
                value="spmb" 
                className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <School className="h-5 w-5" />
                <span className="text-xs font-medium">SPMB</span>
              </TabsTrigger>
            </RoleBasedAccess>
            <TabsTrigger 
              value="messages" 
              className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs font-medium">Pesan</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs font-medium">Laporan</span>
            </TabsTrigger>
            <RoleBasedAccess allowedRoles={['super_admin']}>
              <TabsTrigger 
                value="settings" 
                className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
              >
                <Shield className="h-5 w-5" />
                <span className="text-xs font-medium">Pengaturan</span>
              </TabsTrigger>
            </RoleBasedAccess>
          </TabsList>

          <div className="bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-600">
            <TabsContent value="dashboard" className="mt-0">
              <EnhancedDashboard />
            </TabsContent>

            <TabsContent value="students" className="mt-0">
              <StudentsAdmin />
            </TabsContent>

            <TabsContent value="teachers" className="mt-0">
              <TeachersAdmin />
            </TabsContent>

            <TabsContent value="graduates" className="mt-0">
              <GraduatesAdmin />
            </TabsContent>

            <RoleBasedAccess allowedRoles={PERMISSIONS.MANAGEMENT}>
            <TabsContent value="spmb" className="space-y-6">
              <SPMBAdmin />
            </TabsContent>
          </RoleBasedAccess>

            <TabsContent value="messages" className="mt-0">
              <MessageAdmin />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ReportsAdmin />
            </TabsContent>

            <RoleBasedAccess allowedRoles={['super_admin']}>
            <TabsContent value="settings" className="space-y-6">
              <SettingsAdmin />
            </TabsContent>
          </RoleBasedAccess>
          </div>
        </Tabs>
      </div>

      {/* Search Modal */}
      <GlobalSearch 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
      />

      {/* Notifications Modal */}
      <NotificationSystem 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default AdminPanel;