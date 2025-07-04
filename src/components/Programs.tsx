import { BookOpen, Palette, Star, Clock, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useButtonActions } from '@/hooks/useButtonActions';
import { useButtonTexts } from '@/hooks/useButtonTexts';
import { Link } from 'react-router-dom';

const Programs = () => {
  const { handleProgramDetail, handleScheduleVisit } = useButtonActions();
  const { buttonTexts } = useButtonTexts();

  const programs = [
    {
      id: 'paud',
      title: 'Kober/PAUD',
      subtitle: 'Kelompok Bermain / Pendidikan Anak Usia Dini',
      description: 'Program pendidikan untuk anak usia dini yang menggabungkan pembelajaran akademik dengan nilai-nilai Islam dalam suasana yang menyenangkan.',
      icon: Palette,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      students: 120,
      schedule: 'Senin - Jumat, 08:00 - 11:00',
      ageRange: '3-6 tahun',
      features: [
        'Pembelajaran Dasar (Calistung)',
        'Pengenalan Huruf Hijaiyah',
        'Seni, Musik, dan Gerak',
        'Permainan Edukatif',
        'Pembentukan Karakter Islami'
      ]
    },
    {
      id: 'tka-tpa',
      title: 'TKA/TPA',
      subtitle: 'Taman Kanak-kanak Al-Quran / Taman Pendidikan Al-Quran',
      description: 'Program pendidikan Al-Quran untuk anak-anak usia 4-12 tahun dengan metode pembelajaran yang menyenangkan dan mudah dipahami.',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      students: 150,
      schedule: 'Senin - Jumat, 15:30 - 17:00',
      ageRange: '4-12 tahun',
      features: [
        'Pembelajaran Al-Quran dengan Tajwid',
        'Hafalan Surat-surat Pendek',
        'Pendidikan Akhlak dan Adab',
        'Pembelajaran Bahasa Arab Dasar',
        'Kegiatan Seni dan Kreativitas'
      ]
    },
    {
      id: 'diniyah',
      title: 'Madrasah Diniyah',
      subtitle: 'Pendidikan Agama Islam Formal',
      description: 'Program pendidikan agama Islam yang komprehensif untuk memberikan pemahaman mendalam tentang ajaran Islam kepada generasi muda.',
      icon: Star,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      students: 80,
      schedule: 'Senin - Kamis, 19:30 - 21:00',
      ageRange: '7-17 tahun',
      features: [
        'Studi Al-Quran dan Tafsir',
        'Hadits dan Sirah Nabawiyah',
        'Fiqh dan Aqidah',
        'Bahasa Arab Lanjutan',
        'Sejarah Islam'
      ]
    }
  ];

  return (
    <section id="programs" className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full text-xs md:text-sm font-medium text-blue-700 dark:text-blue-300 mb-3 md:mb-4">
            📚 Program Pendidikan
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            Program Pendidikan Kami
          </h2>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Tiga program unggulan yang dirancang khusus untuk mengembangkan potensi anak dalam pendidikan Islam yang berkualitas
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-16">
          {programs.map((program, index) => (
            <Card key={program.id} className={`group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${program.bgColor} dark:bg-opacity-20 border-0 overflow-hidden`}>
              <CardHeader className="pb-2 md:pb-4">
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${program.color} rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <program.icon className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <CardTitle className={`text-lg md:text-xl font-bold ${program.textColor} dark:text-white`}>
                  {program.title}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                  {program.subtitle}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3 md:space-y-4">
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {program.description}
                </p>

                {/* Program Info */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    <Users className="h-3 w-3 md:h-4 md:w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium">{program.students} Siswa Aktif</span>
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    <Clock className="h-3 w-3 md:h-4 md:w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{program.schedule}</span>
                  </div>
                  <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>Usia {program.ageRange}</span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-xs md:text-sm">Kurikulum:</h4>
                  <div className="space-y-1">
                    {program.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        <div className={`w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r ${program.color} rounded-full mr-2 flex-shrink-0`}></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 md:pt-4">
                  <Link to={`/program/${program.id}`}>
                    <Badge 
                      className={`${program.textColor} bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-700 cursor-pointer`}
                    >
                      Lihat Detail Program
                    </Badge>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10 md:mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Tertarik dengan Program Kami?
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 md:mb-6">
              Bergabunglah dengan ribuan keluarga yang telah mempercayakan pendidikan anak-anak mereka kepada kami
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/spmb">
                <Button 
                  className="gradient-primary text-white font-semibold px-6 py-2 md:px-8 md:py-3 rounded-xl hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
                >
                  {buttonTexts.daftarSekarang}
                </Button>
              </Link>
              <Button 
                variant="outline"
                onClick={handleScheduleVisit}
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold px-6 py-2 md:px-8 md:py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 w-full sm:w-auto"
              >
                {buttonTexts.jadwalKunjungan}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;