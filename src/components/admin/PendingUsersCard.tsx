
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Check, X } from 'lucide-react';
import { User } from '@/types';

interface PendingUsersCardProps {
  pendingUsers: User[];
  onApprove: (userId: number) => void;
  onReject: (userId: number) => void;
}

const PendingUsersCard: React.FC<PendingUsersCardProps> = ({
  pendingUsers,
  onApprove,
  onReject
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

  if (pendingUsers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Persetujuan Pengguna Baru ({pendingUsers.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingUsers.map((pendingUser) => (
            <div key={pendingUser.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h3 className="font-medium text-gray-900">{pendingUser.name}</h3>
                <p className="text-sm text-gray-600">@{pendingUser.username}</p>
                <p className="text-sm text-gray-500">{pendingUser.email}</p>
                <Badge variant={getRoleBadgeVariant(pendingUser.role)} className="mt-1">
                  {getRoleDisplay(pendingUser.role)}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onApprove(pendingUser.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Setujui
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(pendingUser.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Tolak
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingUsersCard;
