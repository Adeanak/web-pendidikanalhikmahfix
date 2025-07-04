import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Globe, UserCheck, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User, Permission } from '@/types';
import WebsiteCustomizer from '@/components/admin/WebsiteCustomizer';
import PendingUsersCard from '@/components/admin/PendingUsersCard';
import UserPermissionsCard from '@/components/admin/UserPermissionsCard';
import UserManagement from '@/components/admin/UserManagement';
import ProgramDetailManager from '@/components/admin/ProgramDetailManager';

const SettingsAdmin = () => {
  const { user, loading } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<{[key: number]: Permission}>({});

  useEffect(() => {
    if (user?.role === 'super_admin') {
      loadPendingUsers();
      loadAllUsers();
      loadPermissions();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/login" replace />;
  }

  const loadPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          permissions!inner(
            can_edit_students, 
            can_edit_teachers, 
            can_edit_graduates, 
            can_view_reports, 
            can_manage_ppdb
          )
        `)
        .neq('role', 'super_admin')
        .eq('permissions.can_edit_students', false)
        .eq('permissions.can_edit_teachers', false)
        .eq('permissions.can_edit_graduates', false)
        .eq('permissions.can_view_reports', false)
        .eq('permissions.can_manage_ppdb', false);
      
      if (error) throw error;
      
      setPendingUsers(data as User[]);
    } catch (error) {
      console.error('Error loading pending users:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .neq('role', 'super_admin')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAllUsers(data as User[]);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*');
      
      if (error) throw error;
      
      const permMap: {[key: number]: Permission} = {};
      data.forEach((perm: any) => {
        permMap[perm.user_id] = perm;
      });
      setPermissions(permMap);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const approveUser = async (userId: number) => {
    try {
      const { error } = await supabase
        .from('permissions')
        .update({
          can_edit_students: true,
          can_view_reports: true
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Pengguna telah disetujui dan mendapat akses dasar",
      });
      
      loadPendingUsers();
      loadAllUsers();
      loadPermissions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyetujui pengguna",
        variant: "destructive",
      });
    }
  };

  const rejectUser = async (userId: number) => {
    try {
      // First delete permissions
      const { error: permError } = await supabase
        .from('permissions')
        .delete()
        .eq('user_id', userId);
      
      if (permError) throw permError;
      
      // Then delete user
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (userError) throw userError;
      
      toast({
        title: "Berhasil",
        description: "Pengguna telah ditolak dan dihapus",
      });
      
      loadPendingUsers();
      loadAllUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menolak pengguna",
        variant: "destructive",
      });
    }
  };

  const updatePermission = async (userId: number, permission: string, value: boolean) => {
    try {
      // Check if permission column exists, if not, add it
      const validPermissions = [
        'can_edit_students',
        'can_edit_teachers', 
        'can_edit_graduates',
        'can_view_reports',
        'can_manage_ppdb',
        'can_manage_users',
        'can_edit_website',
        'can_view_analytics'
      ];
      
      if (!validPermissions.includes(permission)) {
        toast({
          title: "Error",
          description: "Izin tidak valid",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('permissions')
        .update({ [permission]: value })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Izin pengguna telah diperbarui",
      });
      
      loadPermissions();
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui izin",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan Sistem</h1>
          <p className="text-gray-600 dark:text-gray-300">Kelola pengguna, izin akses, dan tampilan website</p>
        </div>

        <Tabs defaultValue="user-management" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="user-management" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Kelola Pengguna</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Izin Akses</span>
            </TabsTrigger>
            <TabsTrigger value="website" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Tampilan Website</span>
            </TabsTrigger>
            <TabsTrigger value="program-details" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Detail Program</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user-management">
            <UserManagement />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <PendingUsersCard
              pendingUsers={pendingUsers}
              onApprove={approveUser}
              onReject={rejectUser}
            />

            <UserPermissionsCard
              users={allUsers}
              permissions={permissions}
              onUpdatePermission={updatePermission}
            />
          </TabsContent>

          <TabsContent value="website">
            <WebsiteCustomizer />
          </TabsContent>

          <TabsContent value="program-details">
            <ProgramDetailManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsAdmin;