import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Page } from '../../viewModels/useNavigationViewModel';

interface NavbarProps {
  onNavigate: (path: string) => void;
  activePage: Page;
}

const scrollLinks = [
  { label: 'Inicio', href: '#inicio' },
];

const pageLinks = [
  { label: 'Concursos de Gaitas', path: '/concursos-de-gaitas', page: 'contests' as const },
  { label: 'Registro Canción Inédita', path: '/register', page: 'register' as const },
  { label: 'Documentos', path: '/documents', page: 'documents' as const },
];

export default function Navbar({ onNavigate, activePage }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goSection = (href: string) => {
    setMobileOpen(false);
    if (activePage !== 'home') {
      onNavigate('/');
      setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 120);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goPage = (path: string) => {
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-ink-900/95 backdrop-blur border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => {
            setMobileOpen(false);
            onNavigate('/');
          }}
          className="flex items-center gap-3 transition-opacity hover:opacity-85"
        >
          <img src="/logo.png" alt="Festival de Gaitas" className="h-12 w-auto object-contain" />
          <div className="flex flex-col text-center items-center justify-center">
            <span className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-white leading-none">
              Festival Nacional de Gaitas
            </span>
            <span className="font-display font-semibold text-[9px] sm:text-[10px] uppercase tracking-widest text-brand-400 mt-1 leading-none">
              Francisco Llirene
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {scrollLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                goSection(l.href);
              }}
              className="px-4 py-2 font-display font-semibold text-xs tracking-widest uppercase text-ink-300 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}

          {/* Divider */}
          <span className="w-px h-4 bg-white/10 mx-1" />

          {/* Page links */}
          {pageLinks.map((l) => {
            const isRegister = l.page === 'register';
            return (
              <button
                key={l.path}
                onClick={() => goPage(l.path)}
                className={
                  isRegister
                    ? `ml-2 px-4 py-1.5 rounded-full border border-brand-400 text-brand-400 font-display font-bold text-[10px] tracking-widest uppercase hover:bg-brand-400 hover:text-ink-900 transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.15)] hover:shadow-[0_0_20px_rgba(234,179,8,0.35)] cursor-pointer`
                    : `px-4 py-2 font-display font-semibold text-xs tracking-widest uppercase transition-colors duration-200 cursor-pointer ${
                        activePage === l.page ? 'text-brand-400' : 'text-ink-300 hover:text-white'
                      }`
                }
              >
                {l.label}
              </button>
            );
          })}
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
          {scrollLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                goSection(l.href);
              }}
              className="block py-2.5 font-display font-semibold text-sm tracking-wider uppercase text-ink-300 hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}

          <div className="pt-1 mt-1 border-t border-white/5 space-y-1">
            {pageLinks.map((l) => {
              const isRegister = l.page === 'register';
              return (
                <button
                  key={l.path}
                  onClick={() => goPage(l.path)}
                  className={
                    isRegister
                      ? `block w-full text-center py-2 px-4 rounded border border-brand-400 text-brand-400 hover:bg-brand-400 hover:text-ink-900 font-display font-bold text-xs tracking-wider uppercase transition-colors mt-2 cursor-pointer`
                      : `block w-full text-left py-2.5 font-display font-semibold text-sm tracking-wider uppercase transition-colors cursor-pointer ${
                          activePage === l.page ? 'text-brand-400' : 'text-ink-300 hover:text-white'
                        }`
                  }
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
