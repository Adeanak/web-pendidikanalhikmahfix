import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Users, User, GraduationCap, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: number;
  name: string;
  type: 'student' | 'teacher' | 'graduate' | 'spmb';
  details: string;
  program?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      performSearch(searchTerm);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Add click outside handler to close search
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.search-container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const performSearch = async (term: string) => {
    setIsLoading(true);
    try {
      const searchPattern = `%${term.toLowerCase()}%`;
      
      // Search students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, name, program, class, parent_name')
        .or(`name.ilike.%${term}%,parent_name.ilike.%${term}%`)
        .limit(5);

      if (studentsError) throw studentsError;

      // Search teachers
      const { data: teachers, error: teachersError } = await supabase
        .from('teachers')
        .select('id, name, position, program')
        .or(`name.ilike.%${term}%,position.ilike.%${term}%`)
        .limit(5);

      if (teachersError) throw teachersError;

      // Search graduates
      const { data: graduates, error: graduatesError } = await supabase
        .from('graduates')
        .select('id, name, program, graduation_year')
        .ilike('name', `%${term}%`)
        .limit(5);

      if (graduatesError) throw graduatesError;

      // Search SPMB
        const { data: ppdb, error: ppdbError } = await supabase
        .from('ppdb_registrations')
        .select('id, nama_lengkap, program_pilihan, status')
        .ilike('nama_lengkap', `%${term}%`)
        .limit(5);

      if (ppdbError) throw ppdbError;

      const searchResults: SearchResult[] = [
        ...(students || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          type: 'student' as const,
          details: `${s.class} • Wali: ${s.parent_name}`,
          program: s.program
        })),
        ...(teachers || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          type: 'teacher' as const,
          details: t.position,
          program: t.program
        })),
        ...(graduates || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          type: 'graduate' as const,
          details: `Lulus ${g.graduation_year}`,
          program: g.program
        })),
        ...(ppdb || []).map((p: any) => ({
          id: p.id,
          name: p.nama_lengkap,
          type: 'spmb' as const,
          details: `Status: ${p.status}`,
          program: p.program_pilihan
        }))
      ];

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'student': return Users;
      case 'teacher': return User;
      case 'graduate': return GraduationCap;
      case 'spmb': return UserPlus;
      default: return Search;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'student': return 'Siswa';
      case 'teacher': return 'Pengajar';
      case 'graduate': return 'Lulusan';
      case 'ppdb': return 'SPMB';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'graduate': return 'bg-purple-100 text-purple-800';
      case 'spmb': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to the appropriate page based on result type
    switch (result.type) {
      case 'student':
        // Navigate to student details or highlight in list
        console.log('Navigate to student:', result.id);
        break;
      case 'teacher':
        // Navigate to teacher details or highlight in list
        console.log('Navigate to teacher:', result.id);
        break;
      case 'graduate':
        // Navigate to graduate details or highlight in list
        console.log('Navigate to graduate:', result.id);
        break;
      case 'spmb':
        // Navigate to SPMB details or highlight in list
        console.log('Navigate to SPMB:', result.id);
        break;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="search-container bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari siswa, pengajar, lulusan, atau SPMB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </div>
        
        <div className="max-h-[calc(80vh-4rem)] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Mencari...</p>
            </div>
          ) : results.length === 0 && searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              Tidak ada hasil ditemukan untuk "{searchTerm}"
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Ketik minimal 2 karakter untuk mencari
            </div>
          ) : (
            <div className="divide-y">
              {results.map((result) => {
                const Icon = getIcon(result.type);
                return (
                  <div 
                    key={`${result.type}-${result.id}`} 
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getTypeColor(result.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{result.name}</h3>
                          <Badge variant="secondary" className={getTypeColor(result.type)}>
                            {getTypeLabel(result.type)}
                          </Badge>
                          {result.program && (
                            <Badge variant="outline">{result.program}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{result.details}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gray-50 text-xs text-gray-500 border-t">
          Tekan ESC untuk menutup
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;