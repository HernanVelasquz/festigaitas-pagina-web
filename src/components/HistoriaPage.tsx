import { useEffect, useState } from 'react';
import { ChevronDown, Trophy, ImageOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Edition {
  id: string;
  year: number;
  title: string;
  description: string;
  image_url: string;
}

interface Winner {
  id: string;
  year: number;
  category: string;
  category_label: string;
  position: string;
  group_name: string;
  origin: string | null;
}

const CATEGORY_ORDER = ['gaita_larga', 'gaita_corta', 'tradicional', 'aparte'];

interface AccordionProps {
  edition: Edition;
  winners: Winner[];
  open: boolean;
  onToggle: () => void;
}

function Accordion({ edition, winners, open, onToggle }: AccordionProps) {
  const yearWinners = winners.filter(w => w.year === edition.year);
  const hasWinners = yearWinners.length > 0;

  return (
    <div className={`border-b border-white/8 transition-colors duration-300 ${open ? 'border-brand-500/30' : ''}`}>
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-6 py-7 text-left group"
      >
        {/* Year */}
        <span
          className={`font-display font-black text-[clamp(2rem,4vw,3.5rem)] leading-none tabular-nums transition-colors duration-300 w-28 shrink-0 ${
            open ? 'text-brand-400' : 'text-white/15 group-hover:text-white/30'
          }`}
        >
          {edition.year}
        </span>

        {/* Title + indicators */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-display font-bold text-lg sm:text-xl uppercase tracking-wide transition-colors duration-300 ${
              open ? 'text-white' : 'text-ink-300 group-hover:text-white'
            }`}
          >
            {edition.title}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            {hasWinners && (
              <span className="inline-flex items-center gap-1 text-[11px] font-display font-semibold tracking-widest uppercase text-brand-500">
                <Trophy className="w-3 h-3" /> Ganadores
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-display font-semibold tracking-widest uppercase text-ink-500">
              <ImageOff className="w-3 h-3 rotate-0" style={{ transform: 'none' }} />
              Imagen
            </span>
          </div>
        </div>

        {/* Chevron */}
        <span
          className={`shrink-0 w-8 h-8 border flex items-center justify-center transition-all duration-300 ${
            open
              ? 'border-brand-500 bg-brand-500/10 rotate-180 text-brand-400'
              : 'border-white/10 text-ink-500 group-hover:border-white/30 group-hover:text-white'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      {/* Body — accordion panel */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-10 grid lg:grid-cols-5 gap-8">
            {/* Left: image */}
            <div className="lg:col-span-2">
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={edition.image_url}
                  alt={`Festival ${edition.year}`}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 brightness-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent pointer-events-none" />
                <span className="absolute bottom-4 left-4 font-display font-black text-6xl text-white/10 leading-none select-none">
                  {edition.year}
                </span>
              </div>
            </div>

            {/* Right: description + winners */}
            <div className="lg:col-span-3 flex flex-col gap-7">
              {/* Description */}
              <div>
                <span className="section-label block mb-3">Reseña del Festival</span>
                <p className="text-ink-300 text-sm leading-[1.85] font-body font-light">
                  {edition.description}
                </p>
              </div>

              {/* Winners */}
              {hasWinners && (
                <div>
                  <span className="section-label block mb-3">Cuadro de Honor</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5">
                    {CATEGORY_ORDER.map(cat => {
                      const w = yearWinners.find(x => x.category === cat);
                      return (
                        <div key={cat} className="bg-ink-900 p-4">
                          <p className="text-[10px] font-display font-semibold tracking-widest uppercase text-ink-600 mb-2">
                            {w?.category_label || cat}
                          </p>
                          {w ? (
                            <>
                              <p className="font-display font-bold text-sm uppercase text-white leading-tight">
                                {w.group_name}
                              </p>
                              <p className="text-ink-600 text-[10px] mt-1 font-body">{w.position}</p>
                              {w.origin && (
                                <p className="text-ink-700 text-[10px] mt-0.5 font-body">{w.origin}</p>
                              )}
                            </>
                          ) : (
                            <p className="text-ink-700 text-xs font-body">No registrado</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HistoriaPageProps {
  onBack: () => void;
}

export default function HistoriaPage({ onBack }: HistoriaPageProps) {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [winners, setWinners]   = useState<Winner[]>([]);
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    Promise.all([
      supabase.from('historia_editions').select('*').order('sort_order', { ascending: true }),
      supabase.from('winners').select('*').order('sort_order', { ascending: true }),
    ]).then(([edRes, wRes]) => {
      if (edRes.data) setEditions(edRes.data);
      if (wRes.data)  setWinners(wRes.data);
      setLoading(false);
      // open the first accordion by default
      if (edRes.data && edRes.data.length > 0) setOpenYear(edRes.data[0].year);
    });
  }, []);

  const toggle = (year: number) => setOpenYear(prev => (prev === year ? null : year));

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      {/* Page header */}
      <div className="border-b border-white/5 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-display font-semibold text-xs tracking-widest uppercase text-ink-500 hover:text-white transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <span className="section-label block mb-3">Archivo Histórico</span>
              <h1 className="font-display font-black text-[clamp(3rem,7vw,6rem)] leading-[0.9] uppercase text-white">
                Historia del<br />
                <span className="text-brand-400">Festival</span>
              </h1>
            </div>
            <div>
              <p className="text-ink-300 text-base leading-relaxed font-body font-light">
                Más de cuatro décadas de música, memoria y tradición gaitera quedan
                registradas en estas páginas. Explora cada edición del Festival
                Nacional de Gaitas Francisco Llirene: su contexto, sus protagonistas,
                sus ganadores y los momentos que forjaron la identidad musical del
                Caribe colombiano.
              </p>
              <p className="text-ink-500 text-sm mt-4 font-body">
                Selecciona cualquier año para expandir la reseña completa, ver la
                galería de imágenes y conocer los ganadores de esa edición.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-px bg-white/5 mt-14">
            {[
              { n: '40+', label: 'Ediciones' },
              { n: '600+', label: 'Agrupaciones históricas' },
              { n: '500K+', label: 'Asistentes acumulados' },
            ].map(s => (
              <div key={s.label} className="bg-ink-900 px-6 py-5">
                <span className="font-display font-black text-3xl text-white">{s.n}</span>
                <p className="section-label mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accordion list */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-ink-600 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : (
          editions.map(edition => (
            <Accordion
              key={edition.id}
              edition={edition}
              winners={winners}
              open={openYear === edition.year}
              onToggle={() => toggle(edition.year)}
            />
          ))
        )}
      </div>
    </div>
  );
}
