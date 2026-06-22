import { useEffect, useRef, useState } from 'react';

export function useHeartbeatViewModel() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [imgVisible, setImgVisible] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImgVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return {
    imgRef,
    imgVisible,
  };
}
