import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Users, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user && isOpen) {
      loadNotifications();
      generateSystemNotifications();
    }
  }, [user, isOpen]);

  useEffect(() => {
    // Add click outside handler to close notifications
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.notification-container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setNotifications(data || []);
      
      const unread = data?.filter(n => !n.is_read).length || 0;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const generateSystemNotifications = async () => {
    if (!user) return;
    
    try {
      // Check for new SPMB registrations
      const { data: newPPDB, error: ppdbError } = await supabase
        .from('ppdb_registrations')
        .select('id')
        .eq('status', 'pending')
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
      
      if (ppdbError) {
        console.error('Error checking SPMB registrations:', ppdbError);
        return;
      }
      
      if (newPPDB && newPPDB.length > 0) {
        // Check if we already have a notification for today's SPMB registrations
        const today = new Date().toISOString().split('T')[0];
        const { data: existingNotification } = await supabase
          .from('notifications')
          .select('id')
          .eq('title', 'Pendaftar SPMB Baru')
          .gte('created_at', `${today}T00:00:00.000Z`)
          .single();

        if (!existingNotification) {
          const { error } = await supabase
            .from('notifications')
            .insert({
              title: 'Pendaftar SPMB Baru',
              message: `Ada ${newPPDB.length} pendaftar SPMB baru yang perlu direview`,
              type: 'info',
              user_id: null // Set to null for system-wide notifications
            });
            
          if (error) {
            console.error('Error creating SPMB notification:', error);
          }
        }
      }

      // Check for password reset requests
      const { data: resetRequests, error: resetError } = await supabase
        .from('password_reset_requests')
        .select('id')
        .eq('status', 'pending');
      
      if (resetError) {
        console.error('Error checking reset requests:', resetError);
        return;
      }
      
      if (resetRequests && resetRequests.length > 0) {
        // Check if we already have a notification for pending reset requests
        const { data: existingNotification } = await supabase
          .from('notifications')
          .select('id')
          .eq('title', 'Permintaan Reset Password')
          .eq('type', 'warning')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
          .single();

        if (!existingNotification) {
          const { error } = await supabase
            .from('notifications')
            .insert({
              title: 'Permintaan Reset Password',
              message: `Ada ${resetRequests.length} permintaan reset password menunggu persetujuan`,
              type: 'warning',
              user_id: null // Set to null for system-wide notifications
            });
            
          if (error) {
            console.error('Error creating reset notification:', error);
          }
        }
      }

      // Reload notifications after generating new ones
      setTimeout(() => {
        loadNotifications();
      }, 1000);
    } catch (error) {
      console.error('Error generating notifications:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false)
        .or(`user_id.eq.${user?.id},user_id.is.null`);
      
      if (error) throw error;
      
      loadNotifications();
      toast({
        title: "Berhasil",
        description: "Semua notifikasi telah ditandai sebagai dibaca",
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-16 pr-4">
      <Card className="notification-container w-96 max-h-[80vh] shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifikasi</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <span className="text-xs">Tandai semua</span>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[calc(80vh-4rem)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p>Tidak ada notifikasi</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {!notification.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;