import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ButtonTexts {
  hubungiAdmin: string;
  konsultasiGratis: string;
  jadwalKunjungan: string;
  hubungiKami: string;
  downloadBrosur: string;
  daftarSekarang: string;
}

const defaultButtonTexts: ButtonTexts = {
  hubungiAdmin: 'Hubungi Admin',
  konsultasiGratis: 'Konsultasi Gratis',
  jadwalKunjungan: 'Jadwal Kunjungan',
  hubungiKami: 'Hubungi Kami',
  downloadBrosur: 'Download Brosur',
  daftarSekarang: 'Daftar Sekarang'
};

export const useButtonTexts = () => {
  const [buttonTexts, setButtonTexts] = useState<ButtonTexts>(defaultButtonTexts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadButtonTexts = async () => {
      try {
        const { data, error } = await supabase
          .from('website_settings')
          .select('settings')
          .eq('id', 1)
          .single();

        if (error) {
          console.error('Error loading button texts:', error);
          return;
        }

        if (data?.settings?.buttonTexts) {
          setButtonTexts({
            ...defaultButtonTexts,
            ...data.settings.buttonTexts
          });
        }
      } catch (error) {
        console.error('Error loading button texts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadButtonTexts();
  }, []);

  return { buttonTexts, loading };
};

export default useButtonTexts;