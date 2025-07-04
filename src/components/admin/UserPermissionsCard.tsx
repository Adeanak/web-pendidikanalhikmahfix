
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';
import { User, Permission } from '@/types';

interface UserPermissionsCardProps {
  users: User[];
  permissions: {[key: number]: Permission};
  onUpdatePermission: (userId: number, permission: string, value: boolean) => void;
}

const UserPermissionsCard: React.FC<UserPermissionsCardProps> = ({
  users,
  permissions,
  onUpdatePermission
}) => {
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'default';
      case 'ketua_yayasan': return 'secondary';
      case 'kepala_sekolah': return 'outline';
      case 'teacher': return 'secondary';
      case 'parent': return 'outline';
      default: return 'outline';
    }
  };

  // Define role-based permissions
  const rolePermissions = {
    ketua_yayasan: {
      can_edit_students: true,
      can_edit_teachers: true,
      can_edit_graduates: true,
      can_view_reports: true,
      can_manage_ppdb: true,
      can_manage_users: true,
      can_edit_website: true,
      can_view_analytics: true
    },
    kepala_sekolah: {
      can_edit_students: true,
      can_edit_teachers: true,
      can_edit_graduates: true,
      can_view_reports: true,
      can_manage_ppdb: true,
      can_manage_users: false,
      can_edit_website: false,
      can_view_analytics: true
    },
    teacher: {
      can_edit_students: true,
      can_edit_teachers: false,
      can_edit_graduates: false,
      can_view_reports: true,
      can_manage_ppdb: false,
      can_manage_users: false,
      can_edit_website: false,
      can_view_analytics: false
    },
    parent: {
      can_edit_students: false,
      can_edit_teachers: false,
      can_edit_graduates: false,
      can_view_reports: false,
      can_manage_ppdb: false,
      can_manage_users: false,
      can_edit_website: false,
      can_view_analytics: false
    }
  };

  const permissionLabels = {
    can_edit_students: 'Kelola Siswa',
    can_edit_teachers: 'Kelola Pengajar',
    can_edit_graduates: 'Kelola Alumni',
    can_view_reports: 'Lihat Laporan',
    can_manage_ppdb: 'Kelola SPMB',
    can_manage_users: 'Kelola Pengguna',
    can_edit_website: 'Edit Website',
    can_view_analytics: 'Lihat Analitik'
  };

  return (
    <Card className="dark:bg-gray-800/90 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Shield className="h-5 w-5" />
          <span>Manajemen Pengguna & Izin</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {users.map((userItem) => (
            <div key={userItem.id} className="border dark:border-gray-600 rounded-lg p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{userItem.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@{userItem.username}</p>
                  <Badge variant={getRoleBadgeVariant(userItem.role)} className="mt-1">
                    {getRoleDisplay(userItem.role)}
                  </Badge>
                </div>
              </div>
              
              {permissions[userItem.id] && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(permissionLabels).map(([key, label]) => {
                      const isRecommended = rolePermissions[userItem.role as keyof typeof rolePermissions]?.[key as keyof typeof rolePermissions.teacher];
                      const currentValue = Boolean(permissions[userItem.id][key as keyof Permission]);
                      
                      return (
                        <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-700/50 border dark:border-gray-600">
                          <div className="flex-1">
                            <Label htmlFor={`${key}-${userItem.id}`} className="text-sm font-medium text-gray-900 dark:text-white">
                              {label}
                            </Label>
                            {isRecommended && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                Direkomendasikan untuk {getRoleDisplay(userItem.role)}
                              </p>
                            )}
                          </div>
                          <Switch
                            id={`${key}-${userItem.id}`}
                            checked={currentValue}
                            onCheckedChange={(checked) => 
                              onUpdatePermission(userItem.id, key, checked)
                            }
                            className="ml-3"
                          />
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Quick Actions for Role-based Permissions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t dark:border-gray-600">
                    <button
                      onClick={() => {
                        const rolePerms = rolePermissions[userItem.role as keyof typeof rolePermissions];
                        if (rolePerms) {
                          Object.entries(rolePerms).forEach(([key, value]) => {
                            onUpdatePermission(userItem.id, key, value);
                          });
                        }
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
                    >
                      Terapkan Izin Standar {getRoleDisplay(userItem.role)}
                    </button>
                    <button
                      onClick={() => {
                        Object.keys(permissionLabels).forEach(key => {
                          onUpdatePermission(userItem.id, key, false);
                        });
                      }}
                      className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                    >
                      Hapus Semua Izin
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPermissionsCard;
