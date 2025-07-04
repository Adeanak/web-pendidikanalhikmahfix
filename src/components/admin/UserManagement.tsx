import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus, Edit, Trash2, Check, X, UserCheck, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [passwordResetRequests, setPasswordResetRequests] = useState<any[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '', password: '', name: '', email: '', role: 'teacher'
  });

  useEffect(() => {
    loadUsers();
    loadPendingUsers();
    loadPasswordResetRequests();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data as User[]);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

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

  const loadPasswordResetRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('password_reset_requests')
        .select(`
          *,
          users!password_reset_requests_user_id_fkey(name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPasswordResetRequests(data || []);
    } catch (error) {
      console.error('Error loading password reset requests:', error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      toast({
        title: "Error",
        description: "Username, password, dan nama harus diisi",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          username: newUser.username,
          password: newUser.password,
          role: newUser.role,
          name: newUser.name,
          email: newUser.email
        })
        .select()
        .single();
      
      if (userError) throw userError;
      
      // Insert permissions
      const { error: permError } = await supabase
        .from('permissions')
        .insert({
          user_id: userData.id,
          can_edit_students: true,
          can_edit_teachers: true,
          can_edit_graduates: true,
          can_view_reports: true,
          can_manage_ppdb: true
        });
      
      if (permError) throw permError;
      
      toast({
        title: "Berhasil",
        description: "Pengguna baru berhasil ditambahkan",
      });

      setNewUser({ username: '', password: '', name: '', email: '', role: 'teacher' });
      setIsAddUserOpen(false);
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan pengguna",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
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
        description: "Pengguna berhasil dihapus",
      });
      
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pengguna",
        variant: "destructive",
      });
    }
  };

  const handleApprovePasswordReset = async (requestId: number, userId: number, newPassword: string) => {
    try {
      // Update user password
      const { error: userError } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', userId);
      
      if (userError) throw userError;
      
      // Update request status
      const { error: requestError } = await supabase
        .from('password_reset_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
      
      if (requestError) throw requestError;
      
      toast({
        title: "Berhasil",
        description: "Reset password berhasil disetujui",
      });
      
      loadPasswordResetRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyetujui reset password",
        variant: "destructive",
      });
    }
  };

  const handleRejectPasswordReset = async (requestId: number) => {
    try {
      const { error } = await supabase
        .from('password_reset_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Reset password berhasil ditolak",
      });
      
      loadPasswordResetRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menolak reset password",
        variant: "destructive",
      });
    }
  };

  const approveUser = async (userId: number) => {
    try {
      const { error } = await supabase
        .from('permissions')
        .update({
          can_edit_students: true,
          can_edit_teachers: true,
          can_edit_graduates: true,
          can_view_reports: true,
          can_manage_ppdb: true
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil disetujui",
      });
      
      loadPendingUsers();
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
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil ditolak",
      });
      
      loadPendingUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menolak pengguna",
        variant: "destructive",
      });
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Pengguna</h2>
          <p className="text-gray-600">Manajemen pengguna, pendaftaran, dan reset password</p>
        </div>
        
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="Masukkan username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Masukkan email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Masukkan password"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ketua_yayasan">Ketua Yayasan</SelectItem>
                    <SelectItem value="kepala_sekolah">Kepala Sekolah</SelectItem>
                    <SelectItem value="teacher">Pengajar</SelectItem>
                    <SelectItem value="parent">Wali Santri</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full">
                Tambah Pengguna
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Semua Pengguna</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pendaftaran ({pendingUsers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="reset" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Reset Password ({passwordResetRequests.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                          {getRoleDisplay(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.role !== 'super_admin' && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pendaftaran Menunggu Persetujuan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Tidak ada pendaftaran yang menunggu persetujuan</p>
                ) : (
                  pendingUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <Badge variant="secondary">
                          {getRoleDisplay(user.role)}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => approveUser(user.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Setujui
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => rejectUser(user.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Tolak
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reset">
          <Card>
            <CardHeader>
              <CardTitle>Permintaan Reset Password</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {passwordResetRequests.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Tidak ada permintaan reset password</p>
                ) : (
                  passwordResetRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{request.users?.name}</h3>
                        <p className="text-sm text-gray-600">@{request.username}</p>
                        <p className="text-sm text-gray-500">{request.email}</p>
                        <p className="text-xs text-gray-400">
                          Diminta pada: {new Date(request.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprovePasswordReset(request.id, request.user_id, request.new_password)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Setujui
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRejectPasswordReset(request.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Tolak
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;