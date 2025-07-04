import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageCircle, User, Calendar, Send, AlertCircle } from 'lucide-react';
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

const MessagePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    loadApprovedMessages();
  }, []);

  const loadApprovedMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message || formData.rating === 0) {
      toast({
        title: "Error",
        description: "Nama, pesan, dan rating harus diisi",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          name: formData.name,
          email: formData.email,
          rating: formData.rating,
          message: formData.message,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: "Pesan dan rating Anda telah dikirim. Menunggu persetujuan admin.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        rating: 0,
        message: ''
      });
    } catch (error) {
      console.error('Error submitting message:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim pesan dan rating. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-6 w-6 ${
          (interactive ? (index < hoveredRating || (hoveredRating === 0 && index < formData.rating)) : index < rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        } ${interactive ? 'cursor-pointer' : ''}`}
        onMouseEnter={interactive ? () => setHoveredRating(index + 1) : undefined}
        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        onClick={interactive ? () => setFormData({...formData, rating: index + 1}) : undefined}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-indigo-950">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-4">
              <MessageCircle className="h-4 w-4 mr-2" />
              Pesan & Rating
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Bagikan Pengalaman Anda
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Kami menghargai setiap masukan dan pengalaman Anda bersama Yayasan Al-Hikmah
            </p>
          </div>
          
          {/* Form Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Message Form */}
            <Card className="bg-white dark:bg-gray-800 shadow-xl">
              <CardHeader>
                <CardTitle>Tulis Pesan & Rating</CardTitle>
                <CardDescription>
                  Bagikan pengalaman dan penilaian Anda tentang Yayasan Al-Hikmah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Masukkan email (opsional)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rating *</Label>
                    <div className="flex space-x-1">
                      {renderStars(formData.rating, true)}
                    </div>
                    {formData.rating > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Anda memberikan {formData.rating} dari 5 bintang
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Pesan *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Bagikan pengalaman Anda dengan Yayasan Al-Hikmah"
                      rows={5}
                      required
                    />
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Catatan:</p>
                      <p>Pesan Anda akan ditampilkan setelah disetujui oleh admin.</p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span>Mengirim...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="h-4 w-4 mr-2" />
                        <span>Kirim Pesan & Rating</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Guidelines */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle>Panduan Menulis Pesan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">1</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Berikan informasi yang jelas</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Jelaskan pengalaman Anda dengan detail yang relevan.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">2</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Bersikap jujur dan objektif</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Berikan penilaian yang jujur berdasarkan pengalaman nyata.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">3</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Gunakan bahasa yang sopan</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Hindari kata-kata kasar atau tidak pantas.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">4</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Berikan saran konstruktif</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">Jika ada kritik, sampaikan dengan cara yang membangun.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">Kebijakan Moderasi</h3>
                  <p className="mb-4">Semua pesan akan dimoderasi oleh admin sebelum ditampilkan di website.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <span>Pesan yang mengandung kata-kata tidak pantas akan ditolak</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <span>Pesan yang berisi informasi pribadi akan disunting</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <span>Pesan yang bersifat spam akan dihapus</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <span>Admin berhak menolak pesan yang tidak sesuai</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Recent Approved Messages */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Pesan Terbaru
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Belum Ada Pesan</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Jadilah yang pertama memberikan pesan dan rating untuk Yayasan Al-Hikmah
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((message) => (
                  <Card key={message.id} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{message.name}</h4>
                          <div className="flex items-center space-x-1">
                            {renderStars(message.rating)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        "{message.message}"
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(message.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      
                      {message.admin_reply && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Balasan Admin:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                            "{message.admin_reply}"
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MessagePage;