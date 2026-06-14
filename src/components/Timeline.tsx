const milestones = [
  {
    year: '1984',
    title: 'El Primer Soplo',
    body: 'Nace en las plazas de Ovejas el pulso de una civilización que se negó a desaparecer para siempre. Comienza una de las tradiciones más vivas de la región Caribe.',
  },
  {
    year: '1995',
    title: 'Institucionalización',
    body: 'Se formaliza el nombre del maestro Llirene, dotando al festival de una proyección de prestigio internacional y consagrándolo como patrimonio cultural.',
  },
  {
    year: '2024',
    title: 'Patrimonio Vivo',
    body: 'Con artistas de referencia de distintos puntos del planeta, el festival afirma los límites de la tradición gaitera y su alcance mundial actualmente.',
  },
];

export default function Timeline() {
  return (
    <section id="manifesto" className="bg-ink-800 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {milestones.map((m) => (
            <div key={m.year} className="py-10 md:py-0 md:px-12 first:md:pl-0 last:md:pr-0">
              <span className="section-label block mb-2">{m.year === '1984' ? 'Origen' : m.year === '1995' ? 'Crecimiento' : 'Actualidad'}</span>
              <span className="divider-brand" />
              <p className="font-display font-black text-[5rem] leading-none text-white/10 select-none -ml-1 mb-2">{m.year}</p>
              <h3 className="font-display font-bold text-2xl uppercase tracking-wide text-white mb-4">
                {m.title}
              </h3>
              <p className="text-ink-400 text-sm leading-relaxed font-body font-light">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
