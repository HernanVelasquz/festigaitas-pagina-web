import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export interface Winner {
  id: string;
  year: number;
  category: string;
  category_label: string;
  position: string;
  group_name: string;
  origin: string | null;
}

const YEARS = [2023, 2022, 2021];

export function useWinnersViewModel() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<number>(2023);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('winners')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setWinners(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Error fetching winners:', err);
        setLoading(false);
      });
  }, []);

  const filteredWinners = useMemo(() => {
    return winners.filter((w) => w.year === activeYear);
  }, [winners, activeYear]);

  const categories = useMemo(() => [
    { key: 'gaita_larga', label: 'Gaita Larga' },
    { key: 'gaita_corta', label: 'Gaita Corta' },
    { key: 'tradicional', label: 'Tradicional' },
    { key: 'aparte',      label: 'Aparte' },
  ], []);

  return {
    winners: filteredWinners,
    loading,
    activeYear,
    setActiveYear,
    years: YEARS,
    categories,
  };
}
