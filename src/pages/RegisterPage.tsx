import { useState } from 'react';
import { ArrowLeft, ChevronDown, Upload, FileText, CheckCircle, AlertTriangle, Music } from 'lucide-react';
import { useRegisterViewModel } from '../viewModels/useRegisterViewModel';

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({ title, isOpen, onToggle, children }: AccordionSectionProps) {
  return (
    <div className={`border-b border-white/5 transition-colors ${isOpen ? 'bg-white/[0.01]' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left font-display font-bold text-lg uppercase tracking-wider text-white hover:text-brand-400 transition-colors cursor-pointer"
      >
        <span>{title}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-400' : 'text-ink-500'}`} />
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="pb-6 text-ink-300 text-sm leading-relaxed font-body font-light space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface RegisterPageProps {
  onBack: () => void;
}

export default function RegisterPage({ onBack }: RegisterPageProps) {
  const {
    register,
    handleSubmit,
    errors,
    submitting,
    success,
    errorMsg,
    setSuccess,
    rhythmOptions,
  } = useRegisterViewModel();

  const [openSection, setOpenSection] = useState<number | null>(0);
  const [lyricsName, setLyricsName] = useState<string | null>(null);
  const [idName, setIdName] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);

  const toggleSection = (idx: number) => {
    setOpenSection((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="min-h-screen bg-ink-900 text-white pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 font-display font-semibold text-xs tracking-widest uppercase text-ink-500 hover:text-white transition-colors mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </button>

        {/* Title */}
        <div className="mb-12">
          <span className="section-label block mb-2">Inscripciones 2026</span>
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase text-white leading-tight">
            Registro de <span className="text-brand-400">Canciones Inéditas</span>
          </h1>
          <p className="text-ink-400 text-sm mt-3 max-w-xl font-body">
            Inscribe tu canción en el festival de gaitas más importante de Colombia. Por favor lee atentamente el reglamento antes de completar el formulario.
          </p>
        </div>

        {/* Rules Accordion */}
        <div className="border-y border-white/5 mb-12">
          <AccordionSection
            title="1. Requisitos para el Autor"
            isOpen={openSection === 0}
            onToggle={() => toggleSection(0)}
          >
            <p>
              El autor o compositor debe ser mayor de edad y de nacionalidad colombiana (o acreditar residencia legal superior a 5 años).
            </p>
            <p>
              Cada compositor podrá postular un máximo de <strong>una (1) obra</strong> por cada modalidad/ritmo.
            </p>
          </AccordionSection>

          <AccordionSection
            title="2. Especificaciones de la Obra"
            isOpen={openSection === 1}
            onToggle={() => toggleSection(1)}
          >
            <p>
              La composición debe ser <strong>100% inédita</strong> (no haber sido publicada en medios físicos, digitales ni interpretada en conciertos públicos previos).
            </p>
            <p>
              La duración de la pista de audio debe estar contenida entre <strong>3:00 y 5:00 minutos</strong>.
            </p>
          </AccordionSection>

          <AccordionSection
            title="3. Documentos y Archivos requeridos"
            isOpen={openSection === 2}
            onToggle={() => toggleSection(2)}
          >
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Letra de la canción:</strong> En formato PDF, Word (.doc, .docx). Máximo 5MB.</li>
              <li><strong>Cédula de ciudadanía:</strong> Escaneada por ambas caras en un único PDF o imagen (JPG/PNG). Máximo 5MB.</li>
              <li><strong>Audio de la obra (.mp3):</strong> Grabado con buena calidad y que contenga la interpretación vocal e instrumental definitiva. Máximo 15MB.</li>
            </ul>
          </AccordionSection>
        </div>

        {/* Success / Error Messages */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 flex flex-col items-center text-center gap-4 mb-10">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
            <div>
              <h3 className="font-display font-bold text-xl uppercase text-white">¡Inscripción Exitosa!</h3>
              <p className="text-ink-300 text-sm mt-2 font-body max-w-md">
                Tu obra ha sido registrada correctamente. El comité del Festival de Gaitas evaluará los documentos y se pondrá en contacto contigo.
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="mt-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-ink-900 font-display font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Inscribir otra canción
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 p-5 flex gap-3 items-start mb-10 text-red-200">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-display font-bold uppercase text-red-400">Error en el envío</h4>
              <p className="text-sm font-body mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Video Tutorial (Large Size) */}
        {!success && (
          <div className="bg-ink-800 border border-white/5 p-6 sm:p-8 rounded mb-10 max-w-3xl mx-auto">
            <span className="section-label block mb-2 text-brand-400">Guía de Registro</span>
            <h3 className="font-display font-bold text-xl uppercase text-white mb-4">¿Cómo registrar tu obra?</h3>
            <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/D7POKdeQuvM"
                title="Video instructivo de registro"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-ink-400 text-sm leading-relaxed font-body mt-4 font-light">
              Sigue paso a paso las instrucciones de este video tutorial para asegurar que tu obra sea cargada correctamente y cumpla con todos los requisitos del reglamento del festival.
            </p>
          </div>
        )}

        {/* Form (Full Width) */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Author Name */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Nombre del Autor / Compositor *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Francisco Llirene"
                  {...register('authorName')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${
                    errors.authorName ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.authorName && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.authorName.message}</p>
                )}
              </div>

              {/* Song Name */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Nombre de la Canción *
                </label>
                <input
                  type="text"
                  placeholder="Ej: El Soplo Ancestral"
                  {...register('songName')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${
                    errors.songName ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.songName && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.songName.message}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Rhythm Dropdown */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Ritmo *
                </label>
                <select
                  {...register('rhythm')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${
                    errors.rhythm ? 'border-red-500' : 'border-white/10'
                  }`}
                >
                  <option value="">Selecciona un ritmo...</option>
                  {rhythmOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.rhythm && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.rhythm.message}</p>
                )}
              </div>

              {/* Location Origin */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Procedencia (Municipio / Departamento) *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Ovejas, Sucre"
                  {...register('origin')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${
                    errors.origin ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.origin && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.origin.message}</p>
                )}
              </div>
            </div>

            {/* File Upload Fields */}
            <div className="grid sm:grid-cols-3 gap-6 pt-4">
              {/* Lyrics File */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Letra de la Canción (PDF, Word) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    id="lyrics-input"
                    className="hidden"
                    {...register('lyricsFile', {
                      onChange: (e) => setLyricsName(e.target.files?.[0]?.name || null),
                    })}
                  />
                  <label
                    htmlFor="lyrics-input"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${
                      errors.lyricsFile ? 'border-red-500' : 'border-white/10'
                    }`}
                  >
                    <FileText className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full">
                      {lyricsName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">PDF, DOC, DOCX (Máx. 5MB)</span>
                  </label>
                </div>
                {errors.lyricsFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.lyricsFile.message as string}</p>
                )}
              </div>

              {/* ID File */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Documento de Identidad *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    id="id-input"
                    className="hidden"
                    {...register('idFile', {
                      onChange: (e) => setIdName(e.target.files?.[0]?.name || null),
                    })}
                  />
                  <label
                    htmlFor="id-input"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${
                      errors.idFile ? 'border-red-500' : 'border-white/10'
                    }`}
                  >
                    <Upload className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full">
                      {idName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">PDF, JPG, PNG (Máx. 5MB)</span>
                  </label>
                </div>
                {errors.idFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.idFile.message as string}</p>
                )}
              </div>

              {/* Audio File */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Archivo de Audio (.mp3) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".mp3,audio/mpeg,audio/mp3"
                    id="audio-input"
                    className="hidden"
                    {...register('audioFile', {
                      onChange: (e) => setAudioName(e.target.files?.[0]?.name || null),
                    })}
                  />
                  <label
                    htmlFor="audio-input"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${
                      errors.audioFile ? 'border-red-500' : 'border-white/10'
                    }`}
                  >
                    <Music className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full">
                      {audioName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">MP3 (Máx. 15MB)</span>
                  </label>
                </div>
                {errors.audioFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.audioFile.message as string}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center h-12 font-display font-bold text-xs tracking-widest uppercase bg-brand-500 text-ink-900 border border-brand-400 hover:bg-brand-400 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {submitting ? 'Enviando Registro...' : 'Enviar Registro de Obra'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
