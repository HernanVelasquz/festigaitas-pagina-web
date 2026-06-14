export default function Latido() {
  return (
    <section id="historia" className="bg-ink-900 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left text */}
        <div>
          <span className="section-label">Esencia Festival</span>
          <span className="divider-brand" />

          <h2 className="font-display font-black text-[clamp(3.5rem,7vw,6rem)] leading-[0.9] uppercase text-white mt-2">
            El Latido<br />de un<br />Pueblo.
          </h2>

          <p className="mt-8 text-ink-300 text-base leading-relaxed font-body font-light max-w-sm">
            La Gaita no es solo un instrumento; es el eco de una
            civilización que se negó a ser silenciada. En Ovejas,
            el aire se transforma en una arquitectura de sonido donde
            el latido de la caña de millo crea una atmósfera única.
          </p>

          <p className="mt-4 text-ink-400 text-sm leading-relaxed font-body font-light max-w-sm">
            Nuestro festival celebra la herencia de Francisco
            Llirene, el maestro que codificó el sonido ancestral de
            los montes de María en melodías que hoy recorren el
            mundo entero.
          </p>

          <div className="mt-10 flex items-end gap-12">
            <div>
              <span className="font-display font-black text-5xl text-white">39<span className="text-brand-400">+</span></span>
              <p className="section-label mt-1">Ediciones</p>
            </div>
            <div>
              <span className="font-display font-black text-5xl text-white">150<span className="text-brand-400">+</span></span>
              <p className="section-label mt-1">Agrupaciones</p>
            </div>
          </div>
        </div>

        {/* Right image */}
        <div className="relative">
          <img
            src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt="Vista aérea de la Plaza Francisco Llirene durante el festival"
            className="w-full aspect-[4/5] object-cover grayscale-[30%] contrast-110"
          />
          {/* Location tag */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900/90 to-transparent p-6 flex items-end justify-between">
            <div>
              <span className="section-label block mb-1">Ubicación Central</span>
              <p className="font-display font-bold text-lg tracking-wider text-white uppercase">Plaza Francisco Llirene</p>
            </div>
            <span className="text-brand-400 text-xl">📍</span>
          </div>
          {/* Brand accent */}
          <div className="absolute top-0 right-0 w-1 h-24 bg-brand-500" />
        </div>
      </div>
    </section>
  );
}
