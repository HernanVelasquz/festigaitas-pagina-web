import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

type Page = 'home' | 'documentos';

interface NavbarProps {
  onNavigate: (page: Page) => void;
  activePage: Page;
}

const scrollLinks = [
  { label: 'Inicio',       href: '#inicio' },
  { label: 'Ganadores',    href: '#ganadores' },
];

const pageLinks: { label: string; page: Page }[] = [
  { label: 'Documentos', page: 'documentos' },
];

export default function Navbar({ onNavigate, activePage }: NavbarProps) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goSection = (href: string) => {
    setMobileOpen(false);
    if (activePage !== 'home') {
      onNavigate('home');
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 120);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goPage = (page: Page) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-ink-900/95 backdrop-blur border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => { setMobileOpen(false); onNavigate('home'); }}
          className="flex items-center transition-opacity hover:opacity-85"
        >
          <img src="/logo.png" alt="Festival de Gaitas" className="h-9 w-auto object-contain" />
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {scrollLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={e => { e.preventDefault(); goSection(l.href); }}
              className="px-4 py-2 font-display font-semibold text-xs tracking-widest uppercase text-ink-300 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}

          {/* Divider */}
          <span className="w-px h-4 bg-white/10 mx-1" />

          {/* Page links */}
          {pageLinks.map(l => (
            <button
              key={l.page}
              onClick={() => goPage(l.page)}
              className={`px-4 py-2 font-display font-semibold text-xs tracking-widest uppercase transition-colors duration-200 ${
                activePage === l.page
                  ? 'text-brand-400'
                  : 'text-ink-300 hover:text-white'
              }`}
            >
              {l.label}
            </button>
          ))}


        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-white"
          aria-label="Menú"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-ink-900 border-t border-white/5 px-6 py-4 space-y-1">
          {scrollLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={e => { e.preventDefault(); goSection(l.href); }}
              className="block py-2.5 font-display font-semibold text-sm tracking-wider uppercase text-ink-300 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}

          <div className="pt-1 mt-1 border-t border-white/5 space-y-1">
            {pageLinks.map(l => (
              <button
                key={l.page}
                onClick={() => goPage(l.page)}
                className={`block w-full text-left py-2.5 font-display font-semibold text-sm tracking-wider uppercase transition-colors ${
                  activePage === l.page ? 'text-brand-400' : 'text-ink-300 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>


        </div>
      )}
    </nav>
  );
}
