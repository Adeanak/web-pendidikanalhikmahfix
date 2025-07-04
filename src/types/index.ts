
export interface User {
  id: number;
  username: string;
  password: string;
  role: 'super_admin' | 'ketua_yayasan' | 'kepala_sekolah' | 'teacher' | 'parent';
  name: string;
  email?: string;
  created_at: string;
}

export interface Student {
  id: number;
  name: string;
  program: 'TKA/TPA' | 'PAUD/KOBER' | 'Diniyah';
  class: string;
  parent_name: string;
  phone: string;
  address: string;
  birth_date?: string;
  photo?: string;
  status: 'active' | 'graduated' | 'inactive';
  created_at: string;
}

export interface Teacher {
  id: number;
  name: string;
  position: string;
  program: 'PAUD/KOBER' | 'TKA/TPA' | 'Diniyah' | 'All';
  education: string;
  experience: string;
  photo?: string;
  created_at: string;
}

export interface Graduate {
  id: number;
  student_id: number;
  name: string;
  program: 'PAUD/KOBER' | 'TKA/TPA' | 'Diniyah';
  graduation_year: number;
  achievement?: string;
  current_school?: string;
  photo?: string;
  created_at: string;
}

export interface Permission {
  id: number;
  user_id: number;
  can_edit_students: boolean;
  can_edit_teachers: boolean;
  can_edit_graduates: boolean;
  can_view_reports: boolean;
  can_manage_ppdb: boolean;
  can_manage_users: boolean;
  can_edit_website: boolean;
  can_view_analytics: boolean;
}
