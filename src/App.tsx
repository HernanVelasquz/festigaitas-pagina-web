import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Latido from './components/Latido';
import Timeline from './components/Timeline';
import Momentos from './components/Momentos';
import Ganadores from './components/Ganadores';
import Footer from './components/Footer';
import HistoriaPage from './components/HistoriaPage';
import DocumentosPage from './components/DocumentosPage';
import MusicPlayer from './components/MusicPlayer';

type Page = 'home' | 'historia' | 'documentos';

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
}

function App() {
  const [page, setPage] = useState<Page>('home');

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-ink-900 font-body">
      <Navbar onNavigate={navigate} activePage={page} />

      {page === 'home' && (
        <>
          <Hero />
          <Reveal><Latido /></Reveal>
          <Reveal><Timeline /></Reveal>
          <Reveal><Momentos /></Reveal>
          <Reveal><Ganadores /></Reveal>
          <Footer onNavigate={navigate} />
        </>
      )}

      {page === 'historia' && (
        <HistoriaPage onBack={() => navigate('home')} />
      )}

      {page === 'documentos' && (
        <DocumentosPage onBack={() => navigate('home')} />
      )}

      {/* Persistent music player — state survives page navigation */}
      <MusicPlayer />
    </div>
  );
}

export default App;
