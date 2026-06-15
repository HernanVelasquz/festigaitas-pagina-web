import { ArrowUp } from 'lucide-react';

type Page = 'home' | 'documentos';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

type ExploreLink =
  | { label: string; href: string; page?: never }
  | { label: string; page: Page; href?: never };

const explore: ExploreLink[] = [
  { label: 'Programación 2026', href: '#' },
  { label: 'Reglamento Competencia', href: '#' },
  { label: 'Prensa & Acreditaciones', href: '#' },
  { label: 'Documentos Legales', page: 'documentos' },
];

export default function Footer({ onNavigate }: FooterProps) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const goSection = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  const handleLink = (link: ExploreLink) => {
    if (link.page) { onNavigate(link.page); }
    else if (link.href && link.href !== '#') { goSection(link.href); }
  };

  return (
    <footer className="bg-ink-900 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-display font-black text-sm tracking-widest3 uppercase text-white mb-4">
              Festival<br />de Gaitas
            </p>
            <p className="text-ink-500 text-xs leading-relaxed font-body">
              Preservando el legado de Francisco Llirene y el sonido único de los
              Montes de María desde 1984.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {['IG', 'FB', 'TW'].map(s => (
                <button
                  key={s}
                  className="w-8 h-8 border border-white/10 flex items-center justify-center font-display font-bold text-[10px] text-ink-500 hover:text-white hover:border-brand-500 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="section-label mb-4">Explorar</h4>
            <ul className="space-y-2.5">
              {explore.map(l => (
                <li key={l.label}>
                  <button
                    onClick={() => handleLink(l)}
                    className="text-ink-500 hover:text-white text-xs font-body transition-colors text-left"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="section-label mb-4">Contacto</h4>
            <ul className="space-y-2.5 text-xs font-body text-ink-500">
              <li>Plaza Principal, Ovejas<br />Sucre, Colombia</li>
              <li>
                <a
                  href="mailto:info@festivalgaitas.com"
                  className="hover:text-white transition-colors"
                >
                  info@festivalgaitas.com
                </a>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div className="overflow-hidden h-32 lg:h-auto relative bg-ink-800 border border-white/5">
            <iframe
              title="Ovejas, Sucre"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63078.5!2d-75.43!3d9.52!2m3!1f0!2f0!3f0!3m2!1i800!2i600!4f13.1!3m3!1m2!1s0x8e5a2c0f!2sOvejas!5e0!3m2!1ses!2sco!4v1"
              className="w-full h-full border-0 grayscale opacity-60"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex items-center justify-between">
          <p className="text-ink-600 text-[11px] font-body">
            © 2026 Festival Nacional de Gaitas Francisco Llirene · Ovejas, Sucre
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('documentos')}
              className="text-ink-600 hover:text-white text-[11px] font-body transition-colors"
            >
              Marco Legal
            </button>
            <button
              onClick={scrollTop}
              className="w-8 h-8 border border-white/10 flex items-center justify-center text-ink-500 hover:text-white hover:border-brand-500 transition-colors ml-2"
              aria-label="Volver arriba"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
