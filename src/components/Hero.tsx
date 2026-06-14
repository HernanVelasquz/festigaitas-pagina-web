export default function Hero() {
  const go = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="inicio" className="relative min-h-screen bg-ink-900 overflow-hidden flex items-center">
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full pt-24 pb-16 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div>
          <p className="section-label mb-8">Ovejas · Sucre · Colombia</p>

          <h1 className="font-display font-black leading-none uppercase tracking-tight text-white">
            <span className="block text-[clamp(1.6rem,4vw,3.2rem)] tracking-widest text-ink-200">
              Festival Nacional de
            </span>
            <span className="block font-script normal-case font-bold text-[clamp(4.5rem,11vw,9rem)] leading-[0.9] text-copper">
              Gaitas
            </span>
          </h1>

          <p className="mt-8 font-display font-semibold text-[clamp(1rem,2.2vw,1.8rem)] tracking-[0.25em] uppercase text-ink-300">
            Francisco Llirene
          </p>

          <div className="mt-10 flex items-center gap-6 flex-wrap">
            <button
              onClick={() => go('#historia')}
              className="px-7 py-3 border border-brand-500 text-white font-display font-bold text-xs tracking-widest uppercase hover:bg-brand-500/10 transition-colors duration-300"
            >
              Explorar Programa
            </button>
            <button
              onClick={() => go('#experiencias')}
              className="font-display font-bold text-xs tracking-widest uppercase text-ink-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              Ver Galería
              <span className="text-brand-400">→</span>
            </button>
          </div>
        </div>

        {/* Right — hero image */}
        <div className="relative flex justify-end">
          <div className="relative w-full max-w-md lg:max-w-none">
            {/* Brand accent line */}
            <div className="absolute left-0 top-0 w-1 h-3/4 bg-brand-500" />

            <img
              src="/WhatsApp_Image_2026-06-12_at_19.12.11_(1).jpeg"
              alt="Músico en el Festival de Gaitas"
              className="w-full h-[60vh] lg:h-[80vh] object-cover object-center brightness-90"
            />

            {/* Fade bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900 to-transparent" />

            {/* Year badge */}
            <div className="absolute bottom-8 left-6">
              <span className="font-display font-black text-7xl text-white/5 select-none leading-none">2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-900 to-transparent pointer-events-none" />
    </section>
  );
}
