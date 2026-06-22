import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

export interface Moment {
  id: string;
  image_url: string;
  alt_text: string | null;
}

const LOCAL_MOMENTS: Moment[] = [
  { id: '1', image_url: '/moment-one.jpeg', alt_text: 'Momento uno' },
  { id: '2', image_url: '/moment-two.jpeg', alt_text: 'Momento dos' },
  { id: '3', image_url: '/moment-three.jpeg', alt_text: 'Momento tres' },
  { id: '4', image_url: '/moment-for.jpeg', alt_text: 'Momento cuatro' },
  { id: '5', image_url: '/moment-five.jpeg', alt_text: 'Momento cinco' },
  { id: '6', image_url: '/moment-six.jpeg', alt_text: 'Momento seis' },
];

export function useMomentsViewModel() {
  const [moments] = useState<Moment[]>(LOCAL_MOMENTS);
  const [offset, setOffset] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const visible = 3;
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const max = useMemo(() => Math.max(0, moments.length - visible), [moments.length, visible]);
  const prev = useCallback(() => setOffset((o) => Math.max(0, o - 1)), []);
  const next = useCallback(() => setOffset((o) => Math.min(max, o + 1)), [max]);

  return {
    moments,
    offset,
    trackRef,
    inView,
    max,
    prev,
    next,
  };
}
