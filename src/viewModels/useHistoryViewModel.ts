import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Edition {
  id: string;
  year: number;
  title: string;
  description: string;
  image_url: string;
}

export interface Winner {
  id: string;
  year: number;
  category: string;
  category_label: string;
  position: string;
  group_name: string;
  origin: string | null;
}

export function useHistoryViewModel() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from('historia_editions').select('*').order('sort_order', { ascending: true }),
      supabase.from('winners').select('*').order('sort_order', { ascending: true }),
    ])
      .then(([edRes, wRes]) => {
        if (edRes.data) {
          setEditions(edRes.data);
          // open the first accordion by default
          if (edRes.data.length > 0) {
            setOpenYear(edRes.data[0].year);
          }
        }
        if (wRes.data) setWinners(wRes.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Error fetching history data:', err);
        setLoading(false);
      });
  }, []);

  const toggleYear = useCallback((year: number) => {
    setOpenYear((prev) => (prev === year ? null : year));
  }, []);

  return {
    editions,
    winners,
    openYear,
    loading,
    toggleYear,
  };
}
