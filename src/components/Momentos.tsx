import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Moment {
  id: string;
  image_url: string;
  alt_text: string | null;
}

export default function Momentos() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const visible = 3;

  useEffect(() => {
    supabase
      .from('moments_gallery')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => { if (data) setMoments(data); });
  }, []);

  const max = Math.max(0, moments.length - visible);
  const prev = () => setOffset(o => Math.max(0, o - 1));
  const next = () => setOffset(o => Math.min(max, o + 1));

  return (
    <section id="experiencias" className="bg-ink-900 py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label block mb-2">Archivo Visual</span>
            <h2 className="font-display font-black text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] uppercase text-white">
              Momentos<br />Memorables
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={offset === 0}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-brand-500 hover:text-brand-400 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={offset >= max}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:border-brand-500 hover:text-brand-400 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={trackRef}>
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(calc(-${offset} * (33.333% + 1rem)))` }}
          >
            {moments.map((m, i) => (
              <div
                key={m.id}
                className="relative flex-none w-[calc(33.333%-1rem)] aspect-[3/4] overflow-hidden group"
                style={{ minWidth: 'calc(33.333% - 0.5rem)' }}
              >
                <img
                  src={m.image_url}
                  alt={m.alt_text || ''}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-90 group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="font-display font-semibold text-xs tracking-widest text-white/50">0{i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
