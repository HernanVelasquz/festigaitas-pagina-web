import {
  ArrowLeft,
  FileText,
  BadgeCheck,
  Building2,
  Landmark,
  ShieldCheck,
  Star,
  ExternalLink,
  Download,
  CalendarDays,
  Clock,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { useDocumentsViewModel, LegalDocument } from '../viewModels/useDocumentsViewModel';

const typeConfig: Record<
  string,
  { label: string; icon: typeof FileText; color: string; bg: string; border: string; badge: string }
> = {
  rut: {
    label: 'RUT',
    icon: FileText,
    color: 'text-forest',
    bg: 'bg-forest',
    border: 'border-forest/25',
    badge: 'bg-forest/10 text-forest border-forest/25',
  },
  certificado_representacion: {
    label: 'Certif. Representación',
    icon: BadgeCheck,
    color: 'text-honey',
    bg: 'bg-honey',
    border: 'border-honey/25',
    badge: 'bg-honey/10 text-honey border-honey/25',
  },
  personeria_juridica: {
    label: 'Personería Jurídica',
    icon: Building2,
    color: 'text-gold',
    bg: 'bg-gold',
    border: 'border-gold/25',
    badge: 'bg-gold/10 text-gold border-gold/25',
  },
  certificado_existencia: {
    label: 'Certif. Existencia',
    icon: ShieldCheck,
    color: 'text-copper',
    bg: 'bg-copper',
    border: 'border-copper/25',
    badge: 'bg-copper/10 text-copper border-copper/25',
  },
  aval_ministerio: {
    label: 'Aval Ministerio',
    icon: Landmark,
    color: 'text-terra',
    bg: 'bg-terra',
    border: 'border-terra/25',
    badge: 'bg-terra/10 text-terra border-terra/25',
  },
  declaratoria_patrimonio: {
    label: 'Declaratoria',
    icon: Star,
    color: 'text-brand-300',
    bg: 'bg-brand-300',
    border: 'border-brand-300/25',
    badge: 'bg-brand-300/10 text-brand-300 border-brand-300/25',
  },
  estados_financieros: {
    label: 'Estados Financieros',
    icon: DollarSign,
    color: 'text-honey',
    bg: 'bg-honey',
    border: 'border-honey/25',
    badge: 'bg-honey/10 text-honey border-honey/25',
  },
  camara_comercio: {
    label: 'Cámara de Comercio',
    icon: Building2,
    color: 'text-gold',
    bg: 'bg-gold',
    border: 'border-gold/25',
    badge: 'bg-gold/10 text-gold border-gold/25',
  },
};

const fallback = {
  label: 'Documento',
  icon: FileText,
  color: 'text-ink-300',
  bg: 'bg-ink-300',
  border: 'border-white/10',
  badge: 'bg-white/5 text-ink-300 border-white/10',
};

interface DocumentCardProps {
  doc: LegalDocument;
  isExpired: (expiry: string | null) => boolean;
  expiresShortly: (expiry: string | null) => boolean;
  getDocumentUrl: (path: string | null) => string | null;
  formatDate: (date: string | null) => string;
}

function DocumentCard({
  doc,
  isExpired,
  expiresShortly,
  getDocumentUrl,
  formatDate,
}: DocumentCardProps) {
  const cfg = typeConfig[doc.document_type] ?? fallback;
  const Icon = cfg.icon;
  const expired = isExpired(doc.expiry_date);
  const soonExpires = expiresShortly(doc.expiry_date);
  const resolvedUrl = getDocumentUrl(doc.file_url);

  return (
    <div
      className={`group relative flex flex-col bg-ink-800 border transition-all duration-300 hover:bg-ink-700 ${cfg.border} hover:border-opacity-60`}
    >
      {/* Top bar accent */}
      <div className={`h-1 w-full ${cfg.bg} opacity-50`} />

      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={`shrink-0 w-11 h-11 bg-ink-900 border ${cfg.border} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${cfg.color}`} />
          </div>

          <span
            className={`text-[10px] font-display font-bold tracking-widest uppercase px-2.5 py-1 border ${cfg.badge}`}
          >
            {cfg.label}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-xl uppercase leading-tight text-white group-hover:text-brand-400 transition-colors">
          {doc.name}
        </h3>

        {/* Description */}
        <p className="text-ink-400 text-sm leading-relaxed font-body font-light flex-1">
          {doc.description}
        </p>

        {/* Meta row */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-start gap-2 text-xs font-body text-ink-500">
            <Building2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-ink-600" />
            <span>{doc.issuing_entity}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-body text-ink-500">
            <CalendarDays className="w-3.5 h-3.5 shrink-0 text-ink-600" />
            <span>Expedido: {formatDate(doc.issue_date)}</span>
          </div>

          {doc.expiry_date && (
            <div
              className={`flex items-center gap-2 text-xs font-body ${
                expired ? 'text-red-400' : soonExpires ? 'text-amber-400' : 'text-ink-500'
              }`}
            >
              {expired || soonExpires ? (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 shrink-0 text-ink-600" />
              )}
              <span>
                Vence: {formatDate(doc.expiry_date)}
                {expired && ' — Vencido'}
                {!expired && soonExpires && ' — Por vencer'}
              </span>
            </div>
          )}

          {!doc.expiry_date && (
            <div className="flex items-center gap-2 text-xs font-body text-forest">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Vigencia indefinida</span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="pt-2">
          {resolvedUrl ? (
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className={`inline-flex items-center gap-2 px-5 py-2.5 border font-display font-bold text-xs tracking-widest uppercase transition-all duration-200 ${cfg.border} ${cfg.color} hover:bg-white/5`}
            >
              <Download className="w-3.5 h-3.5" />
              Ver / Descargar Documento
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/5 font-display font-bold text-xs tracking-widest uppercase text-ink-600 cursor-not-allowed select-none">
              <FileText className="w-3.5 h-3.5" />
              Documento No Disponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface DocumentsPageProps {
  onBack: () => void;
}

export default function DocumentsPage({ onBack }: DocumentsPageProps) {
  const {
    documents,
    loading,
    filter,
    setFilter,
    typeKeys,
    stats,
    isExpired,
    expiresShortly,
    getDocumentUrl,
    formatDate,
  } = useDocumentsViewModel();

  return (
    <div className="min-h-screen bg-ink-900 text-white">
      {/* Page header */}
      <div className="border-b border-white/5 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-display font-semibold text-xs tracking-widest uppercase text-ink-500 hover:text-white transition-colors mb-10 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver al Inicio
          </button>

          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <span className="section-label block mb-3">Marco Legal</span>
              <h1 className="font-display font-black text-[clamp(2.8rem,7vw,6rem)] leading-[0.9] uppercase text-white">
                Documentos<br />
                <span className="text-brand-400">Legales</span>
              </h1>
            </div>
            <div className="space-y-4">
              <p className="text-ink-300 text-base leading-relaxed font-body font-light">
                El Festival Nacional de Gaitas Francisco Llirene opera bajo un marco
                jurídico sólido que garantiza la transparencia, la legalidad y la
                responsabilidad institucional en cada una de sus actuaciones.
              </p>
              <p className="text-ink-500 text-sm leading-relaxed font-body">
                Aquí encontrarás los documentos que acreditan la personería jurídica
                del festival, su representación legal, su inscripción tributaria y los
                reconocimientos oficiales otorgados por entidades del Estado colombiano.
                Esta sección está disponible en cumplimiento de los principios de
                transparencia y rendición de cuentas.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px bg-white/5 mt-14">
            {[
              { n: stats.totalDocs, label: 'Documentos registrados' },
              { n: stats.validDocs, label: 'Documentos vigentes' },
              { n: stats.withFile, label: 'Disponibles para descarga' },
            ].map((s) => (
              <div key={s.label} className="bg-ink-900 px-6 py-5">
                <span className="font-display font-black text-3xl text-white">{s.n}</span>
                <p className="section-label mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters + grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {typeKeys.map((key) => {
            const cfg = key === 'todos' ? null : typeConfig[key] ?? fallback;
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 font-display font-semibold text-xs tracking-widest uppercase transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-brand-500 border-brand-400 text-ink-900'
                    : 'border-white/10 text-ink-500 hover:text-white hover:border-white/20'
                }`}
              >
                {key === 'todos' ? 'Todos' : cfg?.label ?? key}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-ink-600 border-t-brand-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Document grid */}
        {!loading && documents.length === 0 && (
          <p className="text-center text-ink-600 py-24 font-body">
            No hay documentos en esta categoría.
          </p>
        )}

        {!loading && documents.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                isExpired={isExpired}
                expiresShortly={expiresShortly}
                getDocumentUrl={getDocumentUrl}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Legal notice */}
        {!loading && (
          <div className="mt-14 p-6 border border-white/5 bg-ink-800/40 flex gap-4">
            <ShieldCheck className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-display font-bold text-sm uppercase tracking-wide text-white mb-1">
                Aviso Legal
              </p>
              <p className="text-ink-500 text-xs leading-relaxed font-body">
                Los documentos disponibles en esta sección son de carácter informativo y
                su vigencia está sujeta a renovación periódica. Para verificar la autenticidad
                de cualquier documento, puede contactar directamente a la entidad emisora o
                escribirnos a <span className="text-brand-400">info@festivalgaitas.com</span>.
                La organización no se responsabiliza por el uso indebido de la información
                aquí contenida.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
