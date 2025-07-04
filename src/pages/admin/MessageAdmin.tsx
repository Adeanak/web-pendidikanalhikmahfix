import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Star, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Trash2, 
  Reply, 
  Settings,
  FileDown
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Message {
  id: number;
  name: string;
  email: string;
  rating: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_reply?: string;
}

interface MessageSettings {
  auto_approve: boolean;
  filter_words: string[];
  notify_admin: boolean;
  max_messages_display: number;
}

const MessageAdmin = () => {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [messageSettings, setMessageSettings] = useState<MessageSettings>({
    auto_approve: false,
    filter_words: [],
    notify_admin: true,
    max_messages_display: 10
  });
  const [filterWordInput, setFilterWordInput] = useState('');
  const [isSettingsChanged, setIsSettingsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      loadMessages();
      loadMessageSettings();
    }
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      filterMessages();
    }
  }, [messages, searchTerm, statusFilter, ratingFilter]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMessages(data || []);
      setFilteredMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pesan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessageSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('message_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Table doesn't exist or no data, create default settings
          await createDefaultMessageSettings();
        } else {
          throw error;
        }
      } else if (data) {
        setMessageSettings(data);
      }
    } catch (error) {
      console.error('Error loading message settings:', error);
    }
  };

  const createDefaultMessageSettings = async () => {
    try {
      // Check if table exists, if not create it
      await supabase.rpc('create_message_settings_table');
      
      // Insert default settings
      const { error } = await supabase
        .from('message_settings')
        .insert({
          id: 1,
          auto_approve: false,
          filter_words: [],
          notify_admin: true,
          max_messages_display: 10
        });
      
      if (error) throw error;
      
      // Load the default settings
      loadMessageSettings();
    } catch (error) {
      console.error('Error creating default message settings:', error);
    }
  };

  const filterMessages = () => {
    let filtered = [...messages];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.email && message.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter);
    }
    
    // Filter by rating
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(message => message.rating === parseInt(ratingFilter));
    }
    
    setFilteredMessages(filtered);
  };

  const updateMessageStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      loadMessages();
      toast({
        title: "Berhasil",
        description: `Status pesan berhasil diubah menjadi ${status === 'approved' ? 'disetujui' : 'ditolak'}`,
      });
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error",
        description: "Gagal mengubah status pesan",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        loadMessages();
        toast({
          title: "Berhasil",
          description: "Pesan berhasil dihapus",
        });
      } catch (error) {
        console.error('Error deleting message:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus pesan",
          variant: "destructive",
        });
      }
    }
  };

  const replyToMessage = async () => {
    if (!selectedMessage) return;
    
    if (!replyText.trim()) {
      toast({
        title: "Error",
        description: "Balasan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          admin_reply: replyText,
          status: 'approved' // Auto-approve when replying
        })
        .eq('id', selectedMessage.id);

      if (error) throw error;
      
      loadMessages();
      setIsReplyDialogOpen(false);
      setReplyText('');
      setSelectedMessage(null);
      
      toast({
        title: "Berhasil",
        description: "Balasan berhasil dikirim",
      });
    } catch (error) {
      console.error('Error replying to message:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim balasan",
        variant: "destructive",
      });
    }
  };

  const saveMessageSettings = async () => {
    try {
      const { error } = await supabase
        .from('message_settings')
        .upsert({
          id: 1,
          auto_approve: messageSettings.auto_approve,
          filter_words: messageSettings.filter_words,
          notify_admin: messageSettings.notify_admin,
          max_messages_display: messageSettings.max_messages_display
        });

      if (error) throw error;
      
      setIsSettingsChanged(false);
      toast({
        title: "Berhasil",
        description: "Pengaturan pesan berhasil disimpan",
      });
    } catch (error) {
      console.error('Error saving message settings:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan pengaturan pesan",
        variant: "destructive",
      });
    }
  };

  const addFilterWord = () => {
    if (!filterWordInput.trim()) return;
    
    const newFilterWords = [...messageSettings.filter_words, filterWordInput.trim().toLowerCase()];
    setMessageSettings({...messageSettings, filter_words: newFilterWords});
    setFilterWordInput('');
    setIsSettingsChanged(true);
  };

  const removeFilterWord = (word: string) => {
    const newFilterWords = messageSettings.filter_words.filter(w => w !== word);
    setMessageSettings({...messageSettings, filter_words: newFilterWords});
    setIsSettingsChanged(true);
  };

  const exportMessagesToCSV = () => {
    try {
      // Convert messages to CSV
      const headers = ['ID', 'Nama', 'Email', 'Rating', 'Pesan', 'Status', 'Tanggal', 'Balasan Admin'];
      const csvRows = [headers.join(',')];
      
      filteredMessages.forEach(message => {
        const row = [
          message.id,
          `"${message.name}"`,
          `"${message.email || ''}"`,
          message.rating,
          `"${message.message.replace(/"/g, '""')}"`,
          message.status,
          new Date(message.created_at).toLocaleDateString('id-ID'),
          `"${message.admin_reply ? message.admin_reply.replace(/"/g, '""') : ''}"`
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `pesan-rating-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Berhasil",
        description: "Data pesan berhasil diexport ke CSV",
      });
    } catch (error) {
      console.error('Error exporting messages:', error);
      toast({
        title: "Error",
        description: "Gagal mengexport data pesan",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
            <h1 className="text-2xl font-bold text-gray-900">Kelola Pesan & Rating</h1>
            <p className="text-gray-600">Manajemen pesan dan rating dari pengunjung website</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={exportMessagesToCSV}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Pesan & Rating</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Pengaturan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Filter Pesan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Cari nama, email, atau isi pesan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Status:</span>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Disetujui</SelectItem>
                          <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Rating:</span>
                      <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="5">5 ★</SelectItem>
                          <SelectItem value="4">4 ★</SelectItem>
                          <SelectItem value="3">3 ★</SelectItem>
                          <SelectItem value="2">2 ★</SelectItem>
                          <SelectItem value="1">1 ★</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Pesan & Rating</CardTitle>
                <CardDescription>
                  {filteredMessages.length} pesan ditemukan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Memuat data...</p>
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada pesan yang ditemukan</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pengirim</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Pesan</TableHead>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMessages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{message.name}</p>
                                {message.email && (
                                  <p className="text-xs text-gray-500">{message.email}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex">
                                {renderStars(message.rating)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="text-sm line-clamp-2">{message.message}</p>
                                {message.admin_reply && (
                                  <div className="mt-1 text-xs text-blue-600 italic line-clamp-1">
                                    Balasan: {message.admin_reply}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm">
                                {new Date(message.created_at).toLocaleDateString('id-ID')}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  message.status === 'approved' ? 'default' :
                                  message.status === 'rejected' ? 'destructive' : 'outline'
                                }
                              >
                                {message.status === 'approved' ? 'Disetujui' :
                                 message.status === 'rejected' ? 'Ditolak' : 'Pending'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {message.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                      onClick={() => updateMessageStatus(message.id, 'approved')}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                                      onClick={() => updateMessageStatus(message.id, 'rejected')}
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMessage(message);
                                    setReplyText(message.admin_reply || '');
                                    setIsReplyDialogOpen(true);
                                  }}
                                >
                                  <Reply className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Pesan & Rating</CardTitle>
                <CardDescription>
                  Konfigurasi cara penanganan pesan dan rating dari pengunjung
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Persetujuan Otomatis</h3>
                    <p className="text-sm text-gray-500">Setujui pesan secara otomatis tanpa moderasi</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={messageSettings.auto_approve ? 'text-green-600' : 'text-red-600'}>
                      {messageSettings.auto_approve ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <Button
                      variant={messageSettings.auto_approve ? 'destructive' : 'default'}
                      onClick={() => {
                        setMessageSettings({...messageSettings, auto_approve: !messageSettings.auto_approve});
                        setIsSettingsChanged(true);
                      }}
                    >
                      {messageSettings.auto_approve ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifikasi Admin</h3>
                    <p className="text-sm text-gray-500">Kirim notifikasi ke admin saat ada pesan baru</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={messageSettings.notify_admin ? 'text-green-600' : 'text-red-600'}>
                      {messageSettings.notify_admin ? 'Aktif' : 'Nonaktif'}
                    </span>
                    <Button
                      variant={messageSettings.notify_admin ? 'destructive' : 'default'}
                      onClick={() => {
                        setMessageSettings({...messageSettings, notify_admin: !messageSettings.notify_admin});
                        setIsSettingsChanged(true);
                      }}
                    >
                      {messageSettings.notify_admin ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Jumlah Pesan yang Ditampilkan</h3>
                  <p className="text-sm text-gray-500 mb-2">Jumlah maksimal pesan yang ditampilkan di halaman utama</p>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      value={messageSettings.max_messages_display}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0 && value <= 50) {
                          setMessageSettings({...messageSettings, max_messages_display: value});
                          setIsSettingsChanged(true);
                        }
                      }}
                      className="w-24"
                    />
                    <span className="text-sm text-gray-500">pesan</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Filter Kata</h3>
                  <p className="text-sm text-gray-500 mb-2">Pesan yang mengandung kata-kata berikut akan otomatis ditolak</p>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Input
                      value={filterWordInput}
                      onChange={(e) => setFilterWordInput(e.target.value)}
                      placeholder="Tambahkan kata yang difilter"
                      className="flex-1"
                    />
                    <Button onClick={addFilterWord}>Tambah</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {messageSettings.filter_words.map((word) => (
                      <Badge key={word} variant="secondary" className="flex items-center gap-1">
                        {word}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeFilterWord(word)}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {messageSettings.filter_words.length === 0 && (
                      <p className="text-sm text-gray-500">Belum ada kata yang difilter</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={saveMessageSettings} 
                    disabled={!isSettingsChanged}
                    className={isSettingsChanged ? 'gradient-primary' : ''}
                  >
                    Simpan Pengaturan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Balas Pesan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMessage && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <p className="font-medium">{selectedMessage.name}</p>
                  <div className="flex">
                    {renderStars(selectedMessage.rating)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">"{selectedMessage.message}"</p>
              </div>
            )}
            <div>
              <Label htmlFor="reply">Balasan Admin</Label>
              <Textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan untuk pesan ini"
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={replyToMessage}>
                Kirim Balasan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MessageAdmin;