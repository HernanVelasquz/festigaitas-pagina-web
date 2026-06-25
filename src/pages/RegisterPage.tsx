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
    timeLeft,
    registrationState,
  } = useRegisterViewModel();

  const [openSection, setOpenSection] = useState<number | null>(0);
  const [lyricsName, setLyricsName] = useState<string | null>(null);
  const [idName, setIdName] = useState<string | null>(null);
  const [rutName, setRutName] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [bankCertificateName, setBankCertificateName] = useState<string | null>(null);

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
            Inscribe tu canción en el festival de gaitas más importante de Colombia. Por favor lee atentamente los requisitos antes de diligenciar el formulario.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-12 bg-ink-800/40 border border-white/5 p-6 rounded backdrop-blur-sm text-center">
          <span className="section-label block mb-4 text-brand-400">
            {registrationState === 'before_opening'
              ? 'Apertura de inscripciones'
              : registrationState === 'open'
              ? 'Cierre de inscripciones'
              : 'Inscripciones cerradas'}
          </span>
          {registrationState === 'closed' ? (
            <div className="text-red-400 font-display font-bold text-xl uppercase tracking-wider">
              Las inscripciones han cerrado
            </div>
          ) : (
            <div className="flex justify-center items-center gap-4 sm:gap-8">
              {/* Days */}
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-body text-ink-400 uppercase tracking-widest mt-2 font-medium">Días</span>
              </div>

              {/* Divider */}
              <span className="font-display font-light text-2xl sm:text-3xl text-white/20 select-none">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-body text-ink-400 uppercase tracking-widest mt-2 font-medium">Horas</span>
              </div>

              {/* Divider */}
              <span className="font-display font-light text-2xl sm:text-3xl text-white/20 select-none">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-body text-ink-400 uppercase tracking-widest mt-2 font-medium">Minutos</span>
              </div>

              {/* Divider */}
              <span className="font-display font-light text-2xl sm:text-3xl text-white/20 select-none">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="font-display font-black text-4xl sm:text-5xl text-brand-400 tracking-tight leading-none min-w-[3rem]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-body text-ink-400 uppercase tracking-widest mt-2 font-medium">Segundos</span>
              </div>
            </div>
          )}
          <p className="text-xs text-ink-500 mt-4 font-body font-light">
            {registrationState === 'before_opening'
              ? 'Las inscripciones de este concurso inician a partir del 25 de Junio de 2026 a las 5:00 PM (Hora Colombia).'
              : registrationState === 'open'
              ? 'Las inscripciones de este concurso cierran el 31 de Julio de 2026 a las 5:00 PM (Hora Colombia).'
              : 'El periodo de inscripciones ha finalizado.'}
          </p>
        </div>

        {/* Rules Accordion */}
        <div className="border-y border-white/5 mb-12">
          <AccordionSection
            title="1. Requisitos para la presentacion de la Obra Musical (Art. 21 - Reglamento de Concursos 2026)"
            isOpen={openSection === 0}
            onToggle={() => toggleSection(0)}
          >
            <p>
              Se inscribirán todas las canciones o composiciones musicales cuya melodía y letra no hayan sido grabadas ni presentadas en este u otro evento o concurso.
            </p>
            <p>
              Las obras se podrán presentar en cualquiera de las siguientes modalidades: <strong>Gaita Larga</strong> y <strong>Gaita Corta</strong>.
            </p>
            <p>
              Podrán interpretarse en los siguientes ritmos tradicionales: <strong>Porro</strong>, <strong>Cumbia</strong>, <strong>Merengue</strong> y <strong>Puya</strong>.
            </p>
            <p>
              La duración de la canción no debe exceder los <strong>cuatro (4) minutos</strong>.
            </p>

            <p className="text-brand-400 font-bold mt-2">
              <strong>IMPORTANTE:</strong> La obra musical que exceda el tiempo establecido, quedará descalificada.
            </p>
          </AccordionSection>

          <AccordionSection
            title="2. Medios y Fechas de Inscripción (Art. 22 - Reglamento de Concursos 2026)"
            isOpen={openSection === 1}
            onToggle={() => toggleSection(1)}
          >
            <p>
              La inscripción se efectúa a través de los siguientes canales oficiales:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Modalidad Virtual:</strong> Diligenciando <a href="#registration-form" className="text-brand-400 hover:underline">este formulario web de registro de obras</a>, o enviando la canción por medio del correo adjunto <a href="mailto:concursosfestigaitas@gmail.com" className="text-brand-400 hover:underline">concursosfestigaitas@gmail.com</a>, adjuntando la letra original, fotocopia de cédula, fotocopia del RUT, certificado bancario y fotografía del autor.
              </li>
              <li>
                <strong>Modalidad Presencial:</strong> En la Secretaría del Festival aportando el audio de la canción, la letra original, fotocopia de cédula, fotocopia del RUT, certificado bancario y fotografía del autor.
              </li>
              <li>
                <strong>Correo Tradicional:</strong> Enviando en un solo paquete el audio de la canción (informando nombre y ritmo), la letra original, fotocopia de cédula, fotocopia del RUT, certificado bancario y fotografía del autor.
              </li>
            </ul>
            <p className="mt-2">
              El rango válido para las inscripciones va desde el <strong>25 de junio hasta el 31 de julio de 2026 a las 5:00 PM</strong>.
            </p>
            <div className="bg-white/5 p-3 border-l-2 border-brand-400 text-xs mt-3 font-body font-light">
              <strong>PARÁGRAFO:</strong> El audio y la letra de la canción entran a formar parte de los archivos del Festival Nacional de Gaitas “Francisco Llirene”, por lo que <strong>NO SE HARÁN DEVOLUCIONES</strong>.
            </div>
            <div className="bg-white/5 p-3 border-l-2 border-brand-400 text-xs mt-3 font-body font-light">
              <strong>NOTA:</strong> Las Canciones Seleccionadas Serán Publicadas en la Primera Semana de Agosto
            </div>
          </AccordionSection>

          <AccordionSection
            title="3. Documentos y Archivos requeridos"
            isOpen={openSection === 2}
            onToggle={() => toggleSection(2)}
          >
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Letra de la canción:</strong> En formato PDF, tamaño carta. (Máximo 5MB).</li>
              <li><strong>Cédula de ciudadanía:</strong> Escaneada en PDF, ampliada al 150% de ambos lados. (Máximo 5MB).</li>
              <li><strong>Fotocopia del RUT (Registro Unico Tributario):</strong> Escaneado en PDF. (Máximo 5MB). (Actualizado).</li>
              <li><strong>Fotografia Artistica del Autor de la Obra Musical (Plano Medio o Medio Cuerpo en Excelente Calidad de Resolución y Vestido de Gaitero (Hombre) o Vestida de bailadora de Gaita (Mujer)):</strong> En formato de imagen (JPG/PNG). (Máximo 5MB).</li>
              <li><strong>Archivo de audio (.mp3):</strong> Grabado con excelente calidad. (Máximo 15MB).</li>
              <li><strong>Certificación Bancaria:</strong> En formato PDF. (Máximo 5MB).</li>
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
              onClick={() => {
                setSuccess(false);
                setLyricsName(null);
                setIdName(null);
                setRutName(null);
                setPhotoName(null);
                setAudioName(null);
                setBankCertificateName(null);
              }}
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
                src="https://www.youtube.com/embed/f2bTLaU1RXk"
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
          <form id="registration-form" onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Author Name */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Nombres y Apellidos del Autor / Compositor *
                </label>
                <input
                  type="text"
                  placeholder="Ej: José Ángel Álvarez Alarcón"
                  {...register('authorName')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.authorName ? 'border-red-500' : 'border-white/10'
                    }`}
                />
                {errors.authorName && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.authorName.message}</p>
                )}
              </div>

              {/* Author Email */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Correo Electrónico del Autor / Compositor *
                </label>
                <input
                  type="email"
                  placeholder="Ej: autor@correo.com"
                  {...register('authorEmail')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.authorEmail ? 'border-red-500' : 'border-white/10'
                    }`}
                />
                {errors.authorEmail && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.authorEmail.message}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Teléfono de Contacto *
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 3001234567"
                  {...register('authorPhone')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.authorPhone ? 'border-red-500' : 'border-white/10'
                    }`}
                />
                {errors.authorPhone && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.authorPhone.message}</p>
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
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.origin ? 'border-red-500' : 'border-white/10'
                    }`}
                />
                {errors.origin && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.origin.message}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Song Name */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Nombre de la Canción *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Escrito en la Piel"
                  {...register('songName')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.songName ? 'border-red-500' : 'border-white/10'
                    }`}
                />
                {errors.songName && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.songName.message}</p>
                )}
              </div>

              {/* Rhythm Dropdown */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Ritmo *
                </label>
                <select
                  {...register('rhythm')}
                  className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.rhythm ? 'border-red-500' : 'border-white/10'
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
            </div>

            {/* File Upload Fields */}
            <div className="grid sm:grid-cols-3 gap-6 pt-4">
              {/* Lyrics File */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Letra de la Canción (PDF) *
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
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${errors.lyricsFile ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <FileText className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full animate-fade-in">
                      {lyricsName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">PDF (Tamaño Carta, Máx. 5MB)</span>
                  </label>
                </div>
                {errors.lyricsFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.lyricsFile.message as string}</p>
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
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${errors.audioFile ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <Music className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full animate-fade-in">
                      {audioName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">MP3 (Excelente Calidad, Máx. 15MB)</span>
                  </label>
                </div>
                {errors.audioFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.audioFile.message as string}</p>
                )}
              </div>

              {/* Photo File */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Fotografía del Autor *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    id="photo-input"
                    className="hidden"
                    {...register('photoFile', {
                      onChange: (e) => setPhotoName(e.target.files?.[0]?.name || null),
                    })}
                  />
                  <label
                    htmlFor="photo-input"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${errors.photoFile ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <Upload className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full animate-fade-in">
                      {photoName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">JPG, PNG (Plano Medio, Máx. 5MB)</span>
                  </label>
                </div>
                {errors.photoFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.photoFile.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 pt-4">
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
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${errors.idFile ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <Upload className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full animate-fade-in">
                      {idName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">PDF (Ampliado al 150%, Máx. 5MB)</span>
                  </label>
                </div>
                {errors.idFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.idFile.message as string}</p>
                )}
              </div>

              {/* RUT File */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Fotocopia del RUT *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    id="rut-input"
                    className="hidden"
                    {...register('rutFile', {
                      onChange: (e) => setRutName(e.target.files?.[0]?.name || null),
                    })}
                  />
                  <label
                    htmlFor="rut-input"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${errors.rutFile ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <Upload className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full animate-fade-in">
                      {rutName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">PDF (Escaneado, Máx. 5MB)</span>
                  </label>
                </div>
                {errors.rutFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.rutFile.message as string}</p>
                )}
              </div>

              {/* Bank Certificate File */}
              <div>
                <label className="block text-xs font-display font-bold uppercase tracking-wider text-ink-300 mb-2">
                  Certificación Bancaria *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    id="bank-certificate-input"
                    className="hidden"
                    {...register('bankCertificateFile', {
                      onChange: (e) => setBankCertificateName(e.target.files?.[0]?.name || null),
                    })}
                  />
                  <label
                    htmlFor="bank-certificate-input"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all ${errors.bankCertificateFile ? 'border-red-500' : 'border-white/10'
                      }`}
                  >
                    <FileText className="w-6 h-6 text-ink-500 mb-2" />
                    <span className="text-xs font-body font-medium text-white truncate max-w-full animate-fade-in">
                      {bankCertificateName || 'Seleccionar archivo'}
                    </span>
                    <span className="text-[10px] font-body text-ink-500 mt-1 font-light">PDF (Certificación Bancaria, Máx. 5MB)</span>
                  </label>
                </div>
                {errors.bankCertificateFile && (
                  <p className="text-xs text-red-400 mt-1 font-body">{errors.bankCertificateFile.message as string}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting || registrationState !== 'open'}
                className="w-full flex items-center justify-center h-12 font-display font-bold text-xs tracking-widest uppercase bg-brand-500 text-ink-900 border border-brand-400 hover:bg-brand-400 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                {submitting
                  ? 'Enviando Registro...'
                  : registrationState === 'before_opening'
                  ? 'Inscripciones no iniciadas'
                  : registrationState === 'closed'
                  ? 'Inscripciones cerradas'
                  : 'Enviar Registro de Obra'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
