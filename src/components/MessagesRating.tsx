import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface Message {
  id: number;
  name: string;
  rating: number;
  message: string;
  date: string;
  avatar?: string;
  admin_reply?: string;
}

interface MessagesContent {
  messagesTitle: string;
  messagesDescription: string;
}

const MessagesRating = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      name: "Siti Nurhaliza",
      rating: 5,
      message: "Yayasan Al-Hikmah sangat bagus dalam mendidik anak-anak. Metode pengajarannya sangat baik dan islami. Anak saya sangat senang belajar di sini.",
      date: "2025-01-15",
    },
    {
      id: 2,
      name: "Ahmad Fauzi",
      rating: 5,
      message: "Alhamdulillah, anak saya jadi lebih disiplin dan hafal Al-Quran berkat pendidikan di Al-Hikmah. Guru-gurunya sangat sabar dan profesional.",
      date: "2025-01-12",
    },
    {
      id: 3,
      name: "Fatimah Azzahra",
      rating: 4,
      message: "Fasilitasnya bagus dan lingkungannya kondusif untuk belajar. Anak-anak jadi lebih mandiri dan berakhlak baik.",
      date: "2025-01-10",
    },
    {
      id: 4,
      name: "Budi Santoso",
      rating: 5,
      message: "Sangat puas dengan kualitas pendidikan di Al-Hikmah. Program tahfidznya sangat bagus dan anak saya sudah hafal beberapa surah.",
      date: "2025-01-08",
    },
    {
      id: 5,
      name: "Khadijah Rahman",
      rating: 5,
      message: "Yayasan yang sangat recommended untuk pendidikan anak. Tidak hanya mengajarkan ilmu agama tapi juga akhlak yang baik.",
      date: "2025-01-05",
    },
    {
      id: 6,
      name: "Muhammad Ridho",
      rating: 4,
      message: "Pendidikan yang berkualitas dengan biaya yang terjangkau. Anak saya sangat berkembang sejak bersekolah di sini.",
      date: "2025-01-03",
    }
  ]);
  
  const [content, setContent] = useState<MessagesContent>({
    messagesTitle: 'Pesan & Rating',
    messagesDescription: 'Apa kata orang tua tentang Yayasan Al-Hikmah'
  });

  useEffect(() => {
    loadContent();
    loadMessages();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('settings')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.log('Using default messages content');
        return;
      }
      
      if (data && data.settings && data.settings.homeContent) {
        const homeContent = data.settings.homeContent;
        setContent({
          messagesTitle: homeContent.messagesTitle || content.messagesTitle,
          messagesDescription: homeContent.messagesDescription || content.messagesDescription
        });
      }
    } catch (error) {
      console.error('Error loading messages content:', error);
    }
  };

  const loadMessages = async () => {
    try {
      // Get message settings to determine how many messages to display
      const { data: settingsData, error: settingsError } = await supabase
        .from('message_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error loading message settings:', settingsError);
      }
      
      const maxMessages = settingsData?.max_messages_display || 10;
      
      // Get approved messages
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(maxMessages);
      
      if (error) {
        console.error('Error loading messages:', error);
        return;
      }
      
      if (data && data.length > 0) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          name: msg.name,
          rating: msg.rating,
          message: msg.message,
          date: msg.created_at,
          admin_reply: msg.admin_reply
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-3 w-3 md:h-4 md:w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  const averageRating = messages.reduce((sum, msg) => sum + msg.rating, 0) / messages.length;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center space-x-2 mb-3 md:mb-4">
            <MessageCircle className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {content.messagesTitle}
            </h2>
          </div>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
            {content.messagesDescription}
          </p>
          <div className="flex items-center justify-center space-x-2 mb-1 md:mb-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
            <span className="text-sm md:text-base text-gray-600 dark:text-gray-300">dari {messages.length} review</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {messages.map((message) => (
            <Card key={message.id} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">{message.name}</h4>
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <div className="flex">{renderStars(message.rating)}</div>
                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">({message.rating}/5)</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                  "{message.message}"
                </p>
                <div className="flex items-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  {new Date(message.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                
                {message.admin_reply && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Balasan Admin:</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{message.admin_reply}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/pesan">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 md:px-8 md:py-3 text-sm md:text-base"
            >
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Tulis Pesan & Rating
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MessagesRating;