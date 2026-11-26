import {
  Compass,
  Eye,
  HeartHandshake,
  Lightbulb,
  Music,
  ShieldCheck,
  Target,
  Users,
} from 'lucide-react';
import {
  StrategicValue,
  ValueIconKey,
  useStrategicPlatformViewModel,
} from '../../viewModels/useStrategicPlatformViewModel';

const VALUE_ICONS: Record<ValueIconKey, typeof Music> = {
  identity: Music,
  innovation: Lightbulb,
  inclusion: Users,
  excellence: ShieldCheck,
  collaboration: HeartHandshake,
};

function ValueCard({ value }: { value: StrategicValue }) {
  const Icon = VALUE_ICONS[value.icon];

  return (
    <article className="bg-ink-900 border border-white/10 p-6 flex flex-col justify-between transition-colors duration-300 hover:border-brand-500/40 group">
      <div>
        <div className="w-10 h-10 border border-brand-500/30 bg-brand-500/10 flex items-center justify-center text-brand-400 mb-5 group-hover:bg-brand-500 group-hover:text-ink-900 transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-display font-bold text-lg uppercase tracking-wide text-white mb-3">
          {value.title}
        </h3>
        <p className="text-ink-300 text-sm leading-relaxed font-body font-light">
          {value.description}
        </p>
      </div>
    </article>
  );
}

/**
 * Renders the Strategic Platform section: intro, mission, vision, values, and objectives.
 */
export default function StrategicPlatform() {
  const {
    intro,
    mission,
    vision,
    values,
    generalObjectives,
    specificObjectives,
    activeObjectiveTab,
    setActiveObjectiveTab,
    activeObjectives,
  } = useStrategicPlatformViewModel();

  return (
    <section id="plataforma-estrategica" className="bg-ink-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-20">
        {/* Intro */}
        <div className="grid lg:grid-cols-12 gap-8 items-end border-b border-white/10 pb-12">
          <div className="lg:col-span-7">
            <span className="section-label">Horizonte Institucional</span>
            <span className="divider-brand" />
            <h1 className="font-display font-black text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] uppercase text-white">
              Plataforma<br />Estratégica
            </h1>
            <p className="font-display font-semibold text-sm tracking-widest uppercase text-brand-400 mt-4">
              Festival Nacional de Gaitas “Francisco Llirene”
            </p>
          </div>
          <div className="lg:col-span-5">
            <p className="text-ink-300 text-base leading-relaxed font-body font-light">
              {intro}
            </p>
          </div>
        </div>

        {/* Misión & Visión */}
        <div className="grid lg:grid-cols-2 gap-6">
          <article className="relative bg-ink-800/40 border border-white/10 p-8 lg:p-10">
            <div className="absolute top-0 left-0 w-1 h-20 bg-brand-500" />
            <div className="flex items-center gap-3 mb-5">
              <Compass className="w-5 h-5 text-brand-400" />
              <span className="section-label text-brand-400">Propósito</span>
            </div>
            <h2 className="font-display font-black text-3xl uppercase text-white mb-5">
              Misión
            </h2>
            <p className="text-ink-300 text-sm sm:text-base leading-[1.85] font-body font-light">
              {mission}
            </p>
          </article>

          <article className="relative bg-ink-800/40 border border-white/10 p-8 lg:p-10">
            <div className="absolute top-0 left-0 w-1 h-20 bg-brand-400" />
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-brand-400" />
                <span className="section-label text-brand-400">Proyección</span>
              </div>
              <span className="font-display font-black text-xl tracking-widest text-brand-400/90 tabular-nums">
                2036
              </span>
            </div>
            <h2 className="font-display font-black text-3xl uppercase text-white mb-5">
              Visión
            </h2>
            <p className="text-ink-300 text-sm sm:text-base leading-[1.85] font-body font-light">
              {vision}
            </p>
          </article>
        </div>

        {/* Valores */}
        <div>
          <div className="mb-10">
            <span className="section-label">Principios Rectores</span>
            <span className="divider-brand" />
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase text-white">
              Nuestros Valores
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map((val) => (
              <ValueCard key={val.id} value={val} />
            ))}
          </div>
        </div>

        {/* Objetivos Generales & Específicos */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-brand-400" />
                <span className="section-label">Hoja de Ruta</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl uppercase text-white">
                Objetivos Estratégicos
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Tipo de objetivos"
              className="inline-flex border border-white/10 bg-ink-800/40 p-1 self-start"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeObjectiveTab === 'general'}
                onClick={() => setActiveObjectiveTab('general')}
                className={`px-4 py-2 font-display font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer ${
                  activeObjectiveTab === 'general'
                    ? 'bg-brand-500 text-ink-900'
                    : 'text-ink-300 hover:text-white'
                }`}
              >
                Generales ({generalObjectives.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeObjectiveTab === 'specific'}
                onClick={() => setActiveObjectiveTab('specific')}
                className={`px-4 py-2 font-display font-bold text-xs tracking-widest uppercase transition-colors cursor-pointer ${
                  activeObjectiveTab === 'specific'
                    ? 'bg-brand-500 text-ink-900'
                    : 'text-ink-300 hover:text-white'
                }`}
              >
                Específicos ({specificObjectives.length})
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {activeObjectives.map((obj) => (
              <div
                key={obj.id}
                className="bg-ink-900 p-6 sm:p-8 flex items-start gap-5 hover:bg-ink-800/40 transition-colors"
              >
                <span className="font-display font-black text-3xl text-brand-400/80 leading-none tabular-nums shrink-0">
                  {obj.code}
                </span>
                <p className="text-ink-300 text-sm sm:text-base leading-relaxed font-body font-light">
                  {obj.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
