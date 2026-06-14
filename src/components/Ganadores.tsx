import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Winner {
  id: string;
  year: number;
  category: string;
  category_label: string;
  position: string;
  group_name: string;
  origin: string | null;
}

const YEARS = [2023, 2022, 2021];

export default function Ganadores() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [activeYear, setActiveYear] = useState(2023);

  useEffect(() => {
    supabase
      .from('winners')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setWinners(data);
        setLoading(false);
      });
  }, []);

  const filtered = winners.filter(w => w.year === activeYear);

  const categories = [
    { key: 'gaita_larga', label: 'Gaita Larga' },
    { key: 'gaita_corta', label: 'Gaita Corta' },
    { key: 'tradicional', label: 'Tradicional' },
    { key: 'aparte',      label: 'Aparte' },
  ];

  return (
    <section id="ganadores" className="bg-ink-900 py-20 lg:py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label block mb-2">Ganadores</span>
            <h2 className="font-display font-black text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] uppercase text-white">
              Cuadro de Honor {activeYear}
            </h2>
          </div>

          {/* Year tabs */}
          <div className="flex items-center gap-1 border border-white/10">
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => setActiveYear(y)}
                className={`px-5 py-2.5 font-display font-bold text-xs tracking-widest uppercase transition-colors duration-200 ${
                  activeYear === y
                    ? 'bg-brand-500 text-ink-900'
                    : 'text-ink-400 hover:text-white'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Winners grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-ink-600 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5 border border-white/5">
            {categories.map(cat => {
              const winner = filtered.find(w => w.category === cat.key);
              return (
                <div key={cat.key} className="p-6 lg:p-8 border-t border-white/5 group hover:bg-white/[0.02] transition-colors">
                  <span className="section-label">{cat.label}</span>
                  <span className="divider-brand" />
                  {winner ? (
                    <>
                      <h3 className="font-display font-black text-xl lg:text-2xl uppercase text-white leading-tight mt-2 group-hover:text-brand-400 transition-colors">
                        {winner.group_name}
                      </h3>
                      <p className="text-ink-500 text-xs font-body mt-2 uppercase tracking-wide">
                        {winner.position}
                      </p>
                      {winner.origin && (
                        <p className="text-ink-600 text-xs font-body mt-1">
                          {winner.origin}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-ink-600 text-sm mt-2">No registrado</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8">
          <button className="flex items-center gap-2 font-display font-bold text-xs tracking-widest uppercase text-ink-400 hover:text-white transition-colors group">
            Ver Historial de Ganadores
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
