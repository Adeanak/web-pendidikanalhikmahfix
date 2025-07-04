import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, User, Eye } from 'lucide-react';
import { Teacher } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import TeacherForm from '@/components/admin/TeacherForm';

const TeachersAdmin = () => {
  const { user, loading } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (user) {
      loadTeachers();
    }
  }, [user]);

  const loadTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      
      setTeachers(data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengajar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTeacher = async (teacherData: Partial<Teacher>) => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert({
          name: teacherData.name!,
          position: teacherData.position!,
          program: teacherData.program!,
          education: teacherData.education!,
          experience: teacherData.experience!,
          photo: teacherData.photo
        })
        .select()
        .single();

      if (error) throw error;

      loadTeachers();
      setShowForm(false);
      toast({
        title: "Berhasil",
        description: "Pengajar berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan pengajar",
        variant: "destructive",
      });
    }
  };

  const handleEditTeacher = async (teacherData: Partial<Teacher>) => {
    if (!editingTeacher) return;
    
    try {
      const { error } = await supabase
        .from('teachers')
        .update({
          name: teacherData.name,
          position: teacherData.position,
          program: teacherData.program,
          education: teacherData.education,
          experience: teacherData.experience,
          photo: teacherData.photo
        })
        .eq('id', editingTeacher.id);

      if (error) throw error;

      loadTeachers();
      setShowForm(false);
      setEditingTeacher(null);
      toast({
        title: "Berhasil",
        description: "Data pengajar berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui data pengajar",
        variant: "destructive",
      });
    }
  };

  const deleteTeacher = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengajar ini?')) {
      try {
        const { error } = await supabase
          .from('teachers')
          .delete()
          .eq('id', id);

        if (error) throw error;

        loadTeachers();
        toast({
          title: "Berhasil",
          description: "Pengajar berhasil dihapus",
        });
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast({
          title: "Error",
          description: "Gagal menghapus pengajar",
          variant: "destructive",
        });
      }
    }
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

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram === 'all' || teacher.program === selectedProgram;
    return matchesSearch && matchesProgram;
  });

  const programs = ['all', 'TKA/TPA', 'PAUD/KOBER', 'Diniyah', 'All'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {showForm ? (
          <TeacherForm
            teacher={editingTeacher}
            onSubmit={editingTeacher ? handleEditTeacher : handleAddTeacher}
            onCancel={() => {
              setShowForm(false);
              setEditingTeacher(null);
            }}
          />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Pengajar</h1>
                <p className="text-gray-600">Manajemen data pengajar Al-Hikmah</p>
              </div>
              <Button 
                className="gradient-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Pengajar
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Cari nama pengajar atau posisi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {programs.map((program) => (
                      <Button
                        key={program}
                        variant={selectedProgram === program ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedProgram(program)}
                        className={selectedProgram === program ? "gradient-primary" : ""}
                      >
                        {program === 'all' ? 'Semua' : program}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teachers List */}
            <div className="grid gap-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Memuat data...</p>
                </div>
              ) : filteredTeachers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">Tidak ada pengajar yang ditemukan</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTeachers.map((teacher) => (
                  <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {teacher.photo ? (
                            <img 
                              src={teacher.photo} 
                              alt={teacher.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                            <p className="text-sm text-gray-600">{teacher.position}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{teacher.program}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteTeacher(teacher.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Pendidikan</p>
                          <p className="font-medium">{teacher.education}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Pengalaman</p>
                          <p className="font-medium">{teacher.experience}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bergabung</p>
                          <p className="font-medium">{new Date(teacher.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default TeachersAdmin;