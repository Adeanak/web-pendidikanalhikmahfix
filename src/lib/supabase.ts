import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          username: string;
          password: string;
          role: 'super_admin' | 'ketua_yayasan' | 'kepala_sekolah' | 'teacher' | 'parent';
          name: string;
          email: string | null;
          status: 'active' | 'pending' | 'inactive';
          created_at: string;
        };
        Insert: {
          username: string;
          password: string;
          role: 'super_admin' | 'ketua_yayasan' | 'kepala_sekolah' | 'teacher' | 'parent';
          name: string;
          email?: string | null;
          status?: 'active' | 'pending' | 'inactive';
        };
        Update: {
          username?: string;
          password?: string;
          role?: 'super_admin' | 'ketua_yayasan' | 'kepala_sekolah' | 'teacher' | 'parent';
          name?: string;
          email?: string | null;
          status?: 'active' | 'pending' | 'inactive';
        };
      };
      permissions: {
        Row: {
          id: number;
          user_id: number;
          can_edit_students: boolean;
          can_edit_teachers: boolean;
          can_edit_graduates: boolean;
          can_view_reports: boolean;
          can_manage_ppdb: boolean;
          created_at: string;
        };
        Insert: {
          user_id: number;
          can_edit_students?: boolean;
          can_edit_teachers?: boolean;
          can_edit_graduates?: boolean;
          can_view_reports?: boolean;
          can_manage_ppdb?: boolean;
        };
        Update: {
          can_edit_students?: boolean;
          can_edit_teachers?: boolean;
          can_edit_graduates?: boolean;
          can_view_reports?: boolean;
          can_manage_ppdb?: boolean;
        };
      };
      students: {
        Row: {
          id: number;
          name: string;
          program: 'TKA/TPA' | 'PAUD/KOBER' | 'Diniyah';
          class: string;
          parent_name: string;
          phone: string;
          address: string;
          birth_date: string | null;
          photo: string | null;
          status: 'active' | 'graduated' | 'inactive';
          created_at: string;
        };
        Insert: {
          name: string;
          program: 'TKA/TPA' | 'PAUD/KOBER' | 'Diniyah';
          class: string;
          parent_name: string;
          phone: string;
          address: string;
          birth_date?: string | null;
          photo?: string | null;
          status?: 'active' | 'graduated' | 'inactive';
        };
        Update: {
          name?: string;
          program?: 'TKA/TPA' | 'PAUD/KOBER' | 'Diniyah';
          class?: string;
          parent_name?: string;
          phone?: string;
          address?: string;
          birth_date?: string | null;
          photo?: string | null;
          status?: 'active' | 'graduated' | 'inactive';
        };
      };
      teachers: {
        Row: {
          id: number;
          name: string;
          position: string;
          program: 'PAUD/KOBER' | 'TKA/TPA' | 'Diniyah' | 'All';
          education: string;
          experience: string;
          photo: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          position: string;
          program: 'PAUD/KOBER' | 'TKA/TPA' | 'Diniyah' | 'All';
          education: string;
          experience: string;
          photo?: string | null;
        };
        Update: {
          name?: string;
          position?: string;
          program?: 'PAUD/KOBER' | 'TKA/TPA' | 'Diniyah' | 'All';
          education?: string;
          experience?: string;
          photo?: string | null;
        };
      };
      graduates: {
        Row: {
          id: number;
          student_id: number | null;
          name: string;
          program: 'PAUD/KOBER' | 'TKA/TPA' | 'Diniyah';
          graduation_year: number;
          achievement: string | null;
          current_school: string | null;
          photo: string | null;
          created_at: string;
        };
        Insert: {
          student_id?: number | null;
          name: string;
          program: 'PAUD/KOBER' | 'TKA/TPA' | 'Diniyah';
          graduation_year: number;
          achievement?: string | null;
          current_school?: string | null;
          photo?: string | null;
        };
        Update: {
          student_id?: number | null;
          name?: string;
          program?: 'PAUD/KOBER' | 'TKA/TPA' | 'Diniyah';
          graduation_year?: number;
          achievement?: string | null;
          current_school?: string | null;
          photo?: string | null;
        };
      };
      notifications: {
        Row: {
          id: number;
          user_id: number | null;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          user_id?: number | null;
          title: string;
          message: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
      };
      ppdb_registrations: {
        Row: {
          id: number;
          nama_lengkap: string;
          program_pilihan: string;
          parent_name: string;
          phone: string;
          email: string | null;
          address: string;
          birth_date: string | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          nama_lengkap: string;
          program_pilihan: string;
          parent_name: string;
          phone: string;
          email?: string | null;
          address: string;
          birth_date?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
        };
      };
      password_reset_requests: {
        Row: {
          id: number;
          user_id: number;
          username: string;
          email: string;
          new_password: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          processed_at: string | null;
          processed_by: number | null;
        };
        Insert: {
          user_id: number;
          username: string;
          email: string;
          new_password: string;
          status?: 'pending' | 'approved' | 'rejected';
          processed_by?: number | null;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
          processed_at?: string | null;
          processed_by?: number | null;
        };
      };
      visitor_stats: {
        Row: {
          id: number;
          views: number;
          comments: number;
          registrations: number;
          updated_at: string;
        };
        Insert: {
          views?: number;
          comments?: number;
          registrations?: number;
        };
        Update: {
          views?: number;
          comments?: number;
          registrations?: number;
        };
      };
      messages: {
        Row: {
          id: number;
          name: string;
          email: string | null;
          rating: number;
          message: string;
          status: 'pending' | 'approved' | 'rejected';
          admin_reply: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email?: string | null;
          rating: number;
          message: string;
          status?: 'pending' | 'approved' | 'rejected';
          admin_reply?: string | null;
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
          admin_reply?: string | null;
        };
      };
      message_settings: {
        Row: {
          id: number;
          auto_approve: boolean;
          filter_words: string[];
          notify_admin: boolean;
          max_messages_display: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          auto_approve?: boolean;
          filter_words?: string[];
          notify_admin?: boolean;
          max_messages_display?: number;
        };
        Update: {
          auto_approve?: boolean;
          filter_words?: string[];
          notify_admin?: boolean;
          max_messages_display?: number;
        };
      };
      program_details: {
        Row: {
          id: number;
          program_id: string;
          title: string;
          subtitle: string;
          description: string;
          features: string[];
          curriculum: string[];
          facilities: string[];
          schedule: string;
          age_range: string;
          class_size: string;
          monthly_fee: number;
          registration_fee: number;
          uniform_fee: number;
          book_fee: number;
          images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          program_id: string;
          title: string;
          subtitle: string;
          description: string;
          features?: string[];
          curriculum?: string[];
          facilities?: string[];
          schedule?: string;
          age_range?: string;
          class_size?: string;
          monthly_fee?: number;
          registration_fee?: number;
          uniform_fee?: number;
          book_fee?: number;
          images?: string[];
        };
        Update: {
          title?: string;
          subtitle?: string;
          description?: string;
          features?: string[];
          curriculum?: string[];
          facilities?: string[];
          schedule?: string;
          age_range?: string;
          class_size?: string;
          monthly_fee?: number;
          registration_fee?: number;
          uniform_fee?: number;
          book_fee?: number;
          images?: string[];
          updated_at?: string;
        };
      };
    };
  };
}