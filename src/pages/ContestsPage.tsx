import { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Users,
  BookOpen,
  Award,
  Calendar,
  Shield,
  FileCheck
} from 'lucide-react';
import {
  useContestsViewModel,
  CATEGORY_OPTIONS,
  DOC_TYPES,
  GENDER_OPTIONS,
  getMemberRolesForCategory
} from '../viewModels/useContestsViewModel';

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionItem = ({ title, isOpen, onToggle, children }: AccordionItemProps) => {
  return (
    <div className="border border-white/5 bg-white/[0.01]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center p-5 text-left font-display font-bold uppercase tracking-wider hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-sm sm:text-base text-white">{title}</span>
        <ChevronDown className={`w-5 h-5 text-brand-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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

interface ContestsPageProps {
  onBack: () => void;
}

export default function ContestsPage({ onBack }: ContestsPageProps) {
  const {
    register,
    handleSubmit,
    errors,
    submitting,
    success,
    errorMsg,
    setSuccess,
    timeLeft,
    registrationState,
    members,
    updateMember,
    watch,
    modalityOptions,
    isValid,
    trigger
  } = useContestsViewModel();

  const category = watch('category');
  const isModalityFixed = !!(category && !category.startsWith('parejas_bailadoras'));
  const acceptRegulations = watch('acceptRegulations');
  const acceptDataProcessing = watch('acceptDataProcessing');

  const [activeTab, setActiveTab] = useState<'rules' | 'form'>('rules');
  const [openRule, setOpenRule] = useState<number | null>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeMemberTab, setActiveMemberTab] = useState<number>(0);

  // File names local state
  const [reviewName, setReviewName] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [membersListName, setMembersListName] = useState<string | null>(null);
  const [idsName, setIdsName] = useState<string | null>(null);
  const [epsName, setEpsName] = useState<string | null>(null);
  const [minorsAuthName, setMinorsAuthName] = useState<string | null>(null);

  const toggleRule = (idx: number) => {
    setOpenRule((prev) => (prev === idx ? null : idx));
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const step1Fields = [
        'groupName', 'category', 'modality', 'originTown', 'originDept',
        'address', 'creationYear', 'totalMembers', 'directorName',
        'directorId', 'phone', 'email', 'contactName', 'contactPhone',
        'contactEmail'
      ] as const;
      const isStep1Valid = await trigger(step1Fields);
      if (!isStep1Valid) return;
    } else if (currentStep === 2) {
      const step2Fields = [
        'reviewFile', 'photoFile', 'membersListFile', 'idsFile', 'epsFile'
      ] as const;
      const isStep2Valid = await trigger(step2Fields);
      if (!isStep2Valid) return;
    } else if (currentStep === 3) {
      const isStep3Valid = members.every(
        (m) => m.fullName.trim() !== '' && m.birthDate !== '' && m.docNumber.trim() !== ''
      );
      if (!isStep3Valid) return;
    } else if (currentStep === 4) {
      const isStep4Valid = await trigger('acceptDataProcessing');
      if (!isStep4Valid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Determine active member
  const activeMember = members[activeMemberTab];

  return (
    <div className="min-h-screen bg-ink-900 text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 font-display font-semibold text-xs tracking-widest uppercase text-ink-500 hover:text-white transition-colors mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </button>

        {/* Header Title */}
        <div className="mb-12">
          <span className="section-label block mb-2">Convocatoria Agrupaciones 2026</span>
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase text-white leading-tight">
            Concursos de <span className="text-brand-400">Gaitas</span>
          </h1>
          <p className="text-ink-400 text-sm mt-3 max-w-xl font-body">
            Inscribe a tu agrupación y lee el reglamento oficial para el Festival Nacional de Gaitas "Francisco Llirene" en Ovejas, Sucre.
          </p>
        </div>

        {/* Tabs navigation */}
        <div className="flex border-b border-white/5 mb-10">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-6 py-4 font-display font-bold text-sm uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeTab === 'rules'
              ? 'border-brand-400 text-brand-400'
              : 'border-transparent text-ink-400 hover:text-white'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Reglamento del Festival
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`flex items-center gap-2 px-6 py-4 font-display font-bold text-sm uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeTab === 'form'
              ? 'border-brand-400 text-brand-400'
              : 'border-transparent text-ink-400 hover:text-white'
              }`}
          >
            <FileCheck className="w-4 h-4" />
            Formulario de Inscripción
          </button>
        </div>

        {/* Tab Content: RULES */}
        {activeTab === 'rules' && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white mb-4">
                Reglamento Oficial de Concursos 2026
              </h2>

              <p className="text-ink-300 text-sm leading-relaxed font-body font-light mb-6">
                Reglamento de Concursos que regirá para todos los participantes de las categorías Profesional (Grupos de Gaitas y Parejas Bailadoras), categoría Aficionada (Grupos de Gaitas y Parejas Bailadoras), Corta Única (Grupos de Gaitas) y Canción Inédita (compositores) quienes deben superar las etapas de Inscripción y Preclasificación para obtener la invitación oficial.
              </p>

              <div className="border-y border-white/5">
                <AccordionItem
                  title="1. Consideraciones Generales (Art. 1 - Art. 10)"
                  isOpen={openRule === 0}
                  onToggle={() => toggleRule(0)}
                >
                  <div className="space-y-4">
                    <p>
                      <strong>ARTÍCULO 1.</strong> Un conjunto tradicional de gaitas está conformado por un máximo de seis (6) personas o integrantes, donde la interpretación (melodía, ritmo y vocalización) está sujeto a la utilización de los instrumentos descritos en el artículo 3 y en ningún caso los conjuntos o alguno(s) de sus integrantes podrán participar en dos categorías.
                    </p>
                    <p>
                      <strong>ARTÍCULO 2.</strong> Todos los integrantes deben portar el uniforme típico de gaitero compuesto de abarcas tres puntá, sombrero vueltiao o concha de jobo, pantalón y camisa blanca y pañuelo rojo para el caso de los hombres, excepto las mujeres quienes podrán utilizar vestido blanco o de bailadora de gaita con estampado de flores y tocado tradicional.
                    </p>
                    <p>
                      <strong>ARTÍCULO 3.</strong> Los instrumentos musicales de los conjuntos serán obligatoriamente aquellos tallados o hechos con materiales naturales como tradicionalmente se han venido utilizando para su elaboración y en ningún caso se permitirán los elaborados en otro material diferente y serán: Gaita Hembra, Gaita Macho, Tambor Alegre, Llamador, Tambora y Maraca para el caso de la Gaita Larga y Gaita, Tambor Alegre, Llamador, Maracas y Tambora para el caso de Gaita Corta.
                    </p>
                    <p>
                      <strong>ARTÍCULO 4.</strong> Cada conjunto deberá estar integrado por músicos que ejecuten su instrumento acorde a la categoría musical en las que ha sido reconocido, no permitiéndose su participación ejecutando esos instrumentos en otra categoría de nivel inferior. Los niveles de participación de menor a mayor son: Infantil, Juvenil, Aficionado y Profesional; asimilándose los percusionistas de la categoría de gaita corta como profesional.
                    </p>
                    <p>
                      <strong>ARTÍCULO 5.</strong> No se aceptarán cambios, ni rotaciones entre los integrantes de los conjuntos, solo en un caso de fuerza mayor y deberá ser notificado y justificado ante la junta organizadora y autorizado por ésta.
                    </p>
                    <p>
                      <strong>ARTÍCULO 6.</strong> Los conjuntos se han clasificado en dos modalidades, Gaita Larga (Aficionado y Profesional) y Gaita Corta única (mayores de 18 años); para el concurso de Escuelas de Formación las categorías son: Infantil (8 a 12 años) y Juvenil de (13 a 17 años).
                    </p>
                    <p>
                      <strong>ARTÍCULO 7.</strong> En la Categoría Profesional se ubican aquellos conjuntos que hayan participado anteriormente en esta categoría u ocupado el PRIMER puesto en el concurso de Gaita Larga Aficionada del Festival Nacional de Gaitas “Francisco Llirene”.
                    </p>
                    <p>
                      <strong>ARTÍCULO 8.</strong> En desarrollo de la categoría profesional los grupos no podrán repetir temas en ninguna de las rondas, ni temas interpretados por los grupos que le anteceden. El grupo deberá obligatoriamente interpretar un tema del repertorio musical ovejero por presentación; este puede ser interpretado en los diferentes ritmos musicales tradicionales de gaita. El Jurado escogerá los mejores ejecutores de los instrumentos: Gaita Hembra, Gaita Macho y Tambor Alegre durante su participación en el concurso.
                    </p>
                    <p>
                      <strong>ARTÍCULO 9.</strong> En la categoría Aficionada se encuentran las agrupaciones que tengan la interpretación de la música de gaitas como afición, estudio o se hayan promocionado de las escuelas de formación como ganadores o porque cumplieron el límite de edad que exige la categoría. Los grupos en esta categoría no podrán repetir temas durante su participación en ninguna de las rondas.
                    </p>
                    <p>
                      <strong>ARTÍCULO 10.</strong> En la categoría Gaita Corta Única se encuentran las agrupaciones que tengan la interpretación de la música de gaitas como afición o hayan participado en esta modalidad de concurso en ediciones anteriores.
                    </p>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="2. Ritmos, Eventos y Vestuarios (Art. 11 - Art. 15)"
                  isOpen={openRule === 1}
                  onToggle={() => toggleRule(1)}
                >
                  <div className="space-y-4">
                    <p>
                      <strong>ARTÍCULO 11.</strong> Los grupos en la modalidad Gaita Larga ejecutarán obligatoriamente en tarima entre los ritmos tradicionales de Gaita, Porro, Cumbia y Merengue. En la modalidad de Gaita Corta única se ejecutarán los ritmos tradicionales de cumbia, porro y opcional puya o merengue.
                    </p>
                    <p>
                      <strong>ARTÍCULO 12. Alborada musical.</strong> Participan los grupos y parejas bailadoras invitados; recorriendo las principales calles del municipio sábado 10 de octubre de 2026, 5:00 am salida al lado de la tarima principal según recorrido definido por la junta directiva.
                    </p>
                    <p>
                      <strong>ARTÍCULO 13. Desfile folclórico.</strong> Participan los grupos y Parejas bailadoras clasificados a la semifinal, comparsas invitadas, escuelas de gaitas infantiles y juveniles finalistas, cuyo recorrido inicia el día domingo 12 de octubre a las 3:00 pm en el parque de la bomba.
                    </p>
                    <div className="bg-white/5 p-3 border-l-2 border-brand-400 text-xs my-2">
                      <strong>PARÁGRAFO:</strong> Todos los grupos participantes deben traer una pancarta o pendón que los identifique durante su participación en la alborada y el desfile folclórico.
                    </div>
                    <p>
                      <strong>ARTÍCULO 14.</strong> El número de participantes en tarima para el concurso de canción inédita no podrá superar los 7 integrantes entre músicos, cantante y compositor.
                    </p>
                    <p>
                      <strong>ARTÍCULO 15.</strong> Las Parejas Bailadoras realizarán sus presentaciones con el siguiente vestuario:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Hombres:</strong> Pantalón y camisa blanca, sombrero vueltiao, pañuelo rojo al cuello, faja y mochila.</li>
                      <li><strong>Mujeres:</strong> Falda larga estampada, blusa cuello de bandeja estampada, en la cabeza flores naturales o artificiales y velas.</li>
                    </ul>
                    <p className="mt-2"><strong>Clasificación de categorías (Parejas):</strong></p>
                    <ul className="list-alpha pl-5 space-y-1">
                      <li>a) Categoría infantil: Niños con edades entre 7 y 12 años pertenecientes a grupos de danza, escuelas de formación o independientes.</li>
                      <li>b) Categoría juvenil: Jóvenes con edades entre 13 y 17 años pertenecientes a grupos de danza, escuelas de formación o independientes.</li>
                      <li>c) Categoría Aficionado: Parejas bailadoras a partir de los 18 años que no hayan ganado en esta categoría.</li>
                      <li>d) Categoría profesional: Parejas bailadoras mayores de 18 años que hayan obtenido el primer puesto en la categoría aficionado en este festival.</li>
                    </ul>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="3. De los Jurados y la Calificación (Art. 16 - Art. 20)"
                  isOpen={openRule === 2}
                  onToggle={() => toggleRule(2)}
                >
                  <div className="space-y-4">
                    <p>
                      <strong>ARTÍCULO 16.</strong> La mesa del jurado debe estar conformado por tres (3) personas. Con excepción que un jurado esté en condición de discapacidad y necesite apoyo de alguien más.
                    </p>
                    <p>
                      <strong>ARTÍCULO 17.</strong> El jurado calificador elegirá los tres (3) primeros puestos en la ronda final en todos los concursos, teniendo en cuenta ritmo, melodía, autenticidad, afinación, acoplamiento y conservación de los patrones típicos de la gaita (instrumentación).
                    </p>
                    <p>
                      <strong>ARTÍCULO 18.</strong> Las comparsas realizarán sus presentaciones en el desfile folclórico en las categorías tradicional y fantasía.
                    </p>
                    <p>
                      <strong>ARTÍCULO 19.</strong> El jurado calificador elegirá los dos (2) primeros puestos en la categoría tradicional y dos (2) primeros puestos en la categoría fantasía, teniendo en cuenta Vestuarios, Ritmo, Coordinación, Expresión corporal, Acople musical y Puntualidad.
                    </p>
                    <p>
                      <strong>ARTÍCULO 20.</strong> Cuando se llegare a presentar desacuerdo entre los miembros del jurado, para escoger los ganadores, la Junta Directiva o fiscal procederá a sumar los puntajes obtenidos por los grupos durante su participación y dará el veredicto final oficial.
                    </p>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="4. Etapa de Inscripción (Art. 21 - Art. 24)"
                  isOpen={openRule === 3}
                  onToggle={() => toggleRule(3)}
                >
                  <div className="space-y-4">
                    <p className="font-bold text-brand-300">
                      ETAPA DE INSCRIPCIÓN (GAITA LARGA PROFESIONAL, GAITA LARGA AFICIONADA, GAITA CORTA ÚNICA, PAREJAS BAILADORAS PROFESIONALES y PAREJAS BAILADORAS AFICIONADAS):
                    </p>
                    <p>
                      <strong>ARTÍCULO 21. Concurso de Canción Inédita:</strong> Se inscribirán todas las canciones o composiciones musicales cuya melodía y letra no hayan sido grabadas ni presentadas en este u otro evento o concurso. Se pueden presentar en cualquiera de las siguientes modalidades (Gaita Larga y Gaita Corta) y se podrán interpretar en los siguientes ritmos: Porro, Cumbia, Merengue y Puya.
                    </p>
                    <p>
                      <strong>ARTÍCULO 22.</strong> La inscripción se efectúa:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>En la modalidad virtual diligenciando formulario y enviando el audio de la canción e informando el nombre y ritmo por la plataforma www.wetransfer.com a <strong>concursosfestigaitas@gmail.com</strong>, adjuntando letra original de la canción, fotocopia de cédula, fotocopia del Rut y fotografía del autor, o presencialmente en la Secretaría del Festival.</li>
                      <li>A través de correo tradicional, para lo cual debe enviar en un solo paquete: audio de la canción informando el nombre y ritmo, letra original de la canción, fotocopia de cédula, fotocopia del Rut y fotografía del autor.</li>
                    </ul>
                    <div className="bg-amber-500/10 border-l-2 border-brand-400 p-3 my-2 text-xs">
                      En todos los casos el rango válido para inscripciones va del <strong>26 de Junio hasta el 31 de julio de 2026 a las 5:00 pm</strong> y la duración de la canción no debe exceder los cuatro (4) minutos. PARÁGRAFO: El audio y la letra de la canción entran a formar parte de los archivos del Festival Nacional de Gaitas “Francisco Llirene”, por lo que NO SE HARÁN DEVOLUCIONES.
                    </div>
                    <p>
                      <strong>ARTÍCULO 23. Muestra de Formación Oral (Decimeros):</strong> Participarán las escuelas de formación en tradición oral que hayan sido invitadas por el Festival Nacional de Gaitas “Francisco Llirene” y deben estar inscritos ante la junta directiva diligenciando el formato de inscripción en la secretaría del festival.
                    </p>
                    <p>
                      <strong>ARTÍCULO 24.</strong> Las canciones inscritas las escuchará en privado un Jurado Calificador que escogerá las 15 mejores canciones, que irán a las rondas clasificatorias en tarima.
                    </p>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="5. Rondas de Concursos (Art. 25 - Art. 29)"
                  isOpen={openRule === 4}
                  onToggle={() => toggleRule(4)}
                >
                  <div className="space-y-4">
                    <p>
                      <strong>ARTÍCULO 25.</strong> Los grupos de gaita larga aficionado, profesional y corta única participarán en tres rondas clasificatorias a saber:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Ronda inicial:</strong> Participarán todos los grupos invitados realizando una presentación en tarima oficial ejecutando dos temas y otra presentación ante jurado en los sitios escogidos por la organización para ejecutar 2 canciones. Clasifican los 10 grupos con calificación más alta.</li>
                      <li><strong>Ronda semifinal:</strong> Participarán los grupos clasificados de la ronda inicial mediante presentación en tarima oficial para ejecutar 2 canciones. Clasifican los 5 grupos con calificación más alta.</li>
                      <li><strong>Ronda final:</strong> Se presentarán en tarima oficial los finalistas de cada concurso para ejecutar 3 canciones y escoger a los tres mejores grupos calificados que ocuparán primer, segundo y tercer puesto.</li>
                    </ul>
                    <p>
                      <strong>ARTÍCULO 26. DESARROLLO DE LA RONDA INICIAL:</strong> Se presentan en tarima oficial todos los invitados por categoría y tipo de concursos.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Grupos de Gaita Corta Única:</strong> Viernes 9 de octubre de 2026, ritmos obligatorios Porro y optativo (puya o merengue). Máximo 8 minutos sumados los dos ritmos.</li>
                      <li><strong>Grupos de Gaita Larga Aficionada:</strong> Viernes 9 de octubre de 2026, ritmos obligatorios Gaita y optativo (Cumbia o merengue). Máximo 8 minutos sumados los dos ritmos.</li>
                      <li><strong>Grupos de Gaita Larga Profesional:</strong> Sábado 10 de octubre de 2026, ritmos obligatorio Gaita y optativo (Cumbia o merengue). Máximo 4 minutos por tema.</li>
                      <li><strong>Escuelas de Gaita Categoría Infantil/Juvenil:</strong> Sábado 10 de octubre de 2026, ritmos obligatorios Gaita y optativo. Máximo 4 minutos por tema (clasificarán 5 a la final).</li>
                      <li><strong>Las Canciones Inéditas:</strong> Sábado 10 de octubre de 2026 clasificarán a la ronda semifinal las 10 Canciones con mayor puntaje.</li>
                      <li><strong>Parejas Bailadoras de Gaitas:</strong> Sábado 10 de octubre de 2026, se presentarán por espacio de 1'30 minutos en ritmo de Gaita y 1'30 en ritmo de merengue.</li>
                      <li><strong>Decimeros:</strong> Harán su presentación en las carpas del Festival el día domingo 11 de octubre.</li>
                    </ul>
                    <p>
                      <strong>PRESENTACIÓN ANTE EL JURADO CALIFICADOR:</strong> Se presentan ante Jurado en sitio autorizado por la Junta Directiva a capela (Máximo 4 minutos por tema).
                    </p>
                    <p>
                      <strong>ARTÍCULO 27.</strong> Una vez sumados los puntajes de la ronda inicial, se conformará la lista de los diez (10) conjuntos gaiteros en las categorías Aficionadas, Profesionales y Corta Única, diez (10) parejas bailadoras y diez (10) canciones inéditas que clasifican a la ronda semifinal (para infantiles/juveniles se conforma la lista de 5 finalistas).
                    </p>
                    <p>
                      <strong>ARTÍCULO 28. RONDA SEMIFINAL: PRESENTACIÓN EN TARIMA.</strong> Domingo 11 de octubre:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Grupos Gaita Larga Aficionado/Profesional:</strong> Ejecutarán de manera obligatoria Porro y optativo, máximo 8 minutos sumados los dos ritmos.</li>
                      <li><strong>Grupos Gaita Corta Única:</strong> Ritmos obligatorios Porro y puya, máximo 4 minutos por tema.</li>
                    </ul>
                    <p>
                      <strong>ARTÍCULO 29. RONDA FINAL: PRESENTACIÓN EN TARIMA.</strong> Lunes 12 de octubre:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Grupos Gaita Larga Aficionado/Profesional:</strong> Ejecutarán Gaita, Porro y optativo Cumbia o merengue. Máximo 12 minutos sumados los tres ritmos.</li>
                      <li><strong>Grupos Gaita Corta Única:</strong> Ritmos obligatorios Porro, cumbia y puya. Máximo 4 minutos por tema.</li>
                    </ul>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="6. Causales de Descalificación (Art. 30)"
                  isOpen={openRule === 5}
                  onToggle={() => toggleRule(5)}
                >
                  <div className="space-y-3">
                    <p><strong>ARTÍCULO 30.</strong> Son causales de descalificación y eliminación de concursos las siguientes:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>No acudir a los tres llamados obligatorio en el sitio de presentación.</li>
                      <li>Incumplir, omitir o desconocer cualquiera de las normas establecidas en el presente reglamento.</li>
                      <li>Cuando la Junta Directiva compruebe irregularidades o documentos adulterados en la inscripción de cualquier participante.</li>
                      <li>Participar en estado de alteración normal del comportamiento, o bajo los efectos de drogas alucinógenas o estimulantes.</li>
                      <li>Dirigirse a cualquier participante, miembros de la Junta Directiva, socios del evento, Jurado o autoridades con frases irrespetuosas, ultrajantes o calumniosas.</li>
                      <li>Propiciar escándalo público o particular que atente contra la normalidad y la tranquilidad del evento.</li>
                      <li><strong>NO PARTICIPACIÓN DE UN REPRESENTANTE DEL GRUPO GAITERO</strong> en el Foro Institucional (se controlará asistencia).</li>
                      <li>Saludar, complacer a alguien desde tarima y/o incitar al público a manifestarse o realizar promociones publicitarias.</li>
                      <li>La no participación en el desfile folclórico con todos sus integrantes debidamente uniformados.</li>
                      <li>No reunir un mínimo de decencia, buenos modales y comportamiento digno en lo personal como en lo artístico.</li>
                    </ol>
                  </div>
                </AccordionItem>
              </div>
            </div>

            {/* Sidebar quick info */}
            <div className="space-y-6">
              <div className="bg-ink-800/40 border border-white/5 p-6 rounded backdrop-blur-sm">
                <h3 className="font-display font-bold text-lg uppercase text-white flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                  <Award className="w-5 h-5 text-brand-400" />
                  Fechas Claves
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-ink-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs uppercase font-bold text-brand-300">Apertura</h4>
                      <p className="text-sm font-light text-ink-300">25 de Junio, 2026 - 12:00 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-ink-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs uppercase font-bold text-brand-300">Cierre</h4>
                      <p className="text-sm font-light text-ink-300">31 de Julio, 2026 - 5:00 PM</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-ink-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs uppercase font-bold text-brand-300">Publicación Admitidos</h4>
                      <p className="text-sm font-light text-ink-300">Primera semana de Agosto, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-ink-800/20 border border-white/5 p-6 rounded text-center">
                <p className="text-ink-400 text-xs font-light mb-4">
                  ¿Leíste el reglamento completo y tienes lista la documentación?
                </p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="w-full py-2 bg-brand-500 hover:bg-brand-400 text-ink-900 font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Ir al Formulario de Inscripción
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: FORM */}
        {activeTab === 'form' && (
          <div className="max-w-4xl mx-auto">
            {/* Countdown timer */}
            <div className="mb-12 bg-ink-800/40 border border-white/5 p-6 rounded backdrop-blur-sm text-center">
              <span className="section-label block mb-4 text-brand-400">
                {registrationState === 'before_opening'
                  ? 'Apertura de inscripciones de agrupaciones'
                  : registrationState === 'open'
                    ? 'Cierre de inscripciones de agrupaciones'
                    : 'Inscripciones de agrupaciones cerradas'}
              </span>
              {registrationState === 'closed' ? (
                <div className="text-red-400 font-display font-bold text-xl uppercase tracking-wider">
                  Las inscripciones han cerrado
                </div>
              ) : (
                <div className="flex justify-center items-center gap-4 sm:gap-8">
                  <div className="flex flex-col items-center">
                    <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-body text-ink-400 uppercase tracking-widest mt-2 font-medium">Días</span>
                  </div>
                  <span className="font-display font-light text-2xl sm:text-3xl text-white/20 select-none">:</span>
                  <div className="flex flex-col items-center">
                    <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-body text-ink-400 uppercase tracking-widest mt-2 font-medium">Horas</span>
                  </div>
                  <span className="font-display font-light text-2xl sm:text-3xl text-white/20 select-none">:</span>
                  <div className="flex flex-col items-center">
                    <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight leading-none">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-body text-ink-400 uppercase tracking-widest mt-2 font-medium">Minutos</span>
                  </div>
                  <span className="font-display font-light text-2xl sm:text-3xl text-white/20 select-none">:</span>
                  <div className="flex flex-col items-center">
                    <span className="font-display font-black text-4xl sm:text-5xl text-brand-400 tracking-tight leading-none min-w-[3rem]">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-body text-ink-400 uppercase tracking-widest mt-2 font-medium">Segundos</span>
                  </div>
                </div>
              )}
            </div>

            {/* Success / Error Messages */}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-8 flex flex-col items-center text-center gap-4 mb-10 max-w-2xl mx-auto rounded">
                <CheckCircle className="w-12 h-12 text-emerald-400" />
                <div>
                  <h3 className="font-display font-bold text-2xl uppercase text-white">¡Inscripción Exitosa!</h3>
                  <p className="text-ink-300 text-sm mt-3 font-body max-w-md leading-relaxed">
                    Los datos de la agrupación y sus integrantes han sido registrados correctamente. El comité del Festival de Gaitas evaluará los documentos y notificará los resultados.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setCurrentStep(1);
                    setReviewName(null);
                    setPhotoName(null);
                    setLogoName(null);
                    setMembersListName(null);
                    setIdsName(null);
                    setEpsName(null);
                    setMinorsAuthName(null);
                    setActiveMemberTab(0);
                  }}
                  className="mt-4 px-8 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-ink-900 font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Inscribir otra agrupación
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 p-5 flex gap-3 items-start mb-10 text-red-200 rounded">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold uppercase text-red-400">Error en el envío</h4>
                  <p className="text-sm font-body mt-1">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Form & Multi-step Navigation indicators */}
            {!success && (
              <div className="mb-10 max-w-3xl mx-auto">
                {/* Step Indicators */}
                <div className="flex justify-between items-center relative mb-8">
                  {/* Background connector line */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/5 -z-10" />

                  {[
                    { step: 1, label: 'Datos Agrupación' },
                    { step: 2, label: 'Documentos' },
                    { step: 3, label: 'Integrantes' },
                    { step: 4, label: 'Datos Personales' },
                    { step: 5, label: 'Declaración' }
                  ].map((s) => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => currentStep > s.step && setCurrentStep(s.step)}
                      className={`flex flex-col items-center gap-2 group cursor-pointer ${currentStep === s.step
                        ? 'text-brand-400'
                        : currentStep > s.step
                          ? 'text-white'
                          : 'text-ink-500'
                        }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center font-display font-bold text-xs transition-all ${currentStep === s.step
                          ? 'bg-brand-500 border-brand-400 text-ink-900 scale-110 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                          : currentStep > s.step
                            ? 'bg-ink-800 border-white/20 text-white'
                            : 'bg-ink-900 border-white/5 text-ink-500'
                          }`}
                      >
                        {s.step}
                      </div>
                      <span className="text-[10px] uppercase font-display font-bold tracking-wider hidden sm:block">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Form starts */}
                <form onSubmit={handleSubmit} className="space-y-10 py-6">

                  {/* STEP 1: GENERAL GROUP DATA */}
                  {currentStep === 1 && (
                    <div className="space-y-10 animate-fade-in">
                      <div className="space-y-6">
                        <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-brand-400 border-b border-white/5 pb-3">
                          1. Datos Generales de la Agrupación
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Nombre de la Agrupación *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Gaiteros de Ovejas"
                              {...register('groupName')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.groupName ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.groupName && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.groupName.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Año de Creación *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: 2012"
                              {...register('creationYear', {
                                onChange: (e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }
                              })}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.creationYear ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.creationYear && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.creationYear.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Categoría *
                            </label>
                            <select
                              {...register('category')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.category ? 'border-red-500' : 'border-white/10'
                                }`}
                            >
                              <option value="">Selecciona la categoría...</option>
                              {CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {errors.category && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.category.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Modalidad *
                            </label>
                            <select
                              {...register('modality')}
                              disabled={!category}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.modality ? 'border-red-500' : 'border-white/10'
                                } ${!category ? 'pointer-events-none opacity-50' : ''}`}
                            >
                              <option value="">Selecciona la modalidad...</option>
                              {modalityOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            {errors.modality && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.modality.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Municipio de procedencia *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Ovejas"
                              {...register('originTown')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.originTown ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.originTown && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.originTown.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Departamento *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Sucre"
                              {...register('originDept')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.originDept ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.originDept && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.originDept.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Dirección de Correspondencia *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Calle 15 No. 21-11"
                              {...register('address')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.address ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.address && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.address.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Redes Sociales de la Agrupación (opcional)
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Instagram: @gaiteros_ovejas, Facebook: Gaiteros de Ovejas"
                              {...register('socialNetworks')}
                              className="w-full bg-ink-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body"
                            />
                          </div>
                        </div>
                      </div>

                      {/* DIRECTOR INFO SUBSECTION */}
                      <div className="space-y-6 pt-6 border-t border-white/5">
                        <h4 className="font-display font-black text-lg sm:text-xl uppercase tracking-widest text-brand-300">
                          Director de la Agrupación
                        </h4>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Nombre del Director *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Pedro Castro"
                              {...register('directorName')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.directorName ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.directorName && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.directorName.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Cédula de Ciudadanía del Director *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: 1100223344"
                              {...register('directorId', {
                                onChange: (e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }
                              })}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.directorId ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.directorId && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.directorId.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Teléfono del Director *
                            </label>
                            <input
                              type="tel"
                              placeholder="Ej: 3001234567"
                              {...register('phone', {
                                onChange: (e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }
                              })}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.phone ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.phone && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.phone.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Correo Electrónico del Director *
                            </label>
                            <input
                              type="email"
                              placeholder="Ej: director@gaiteros.com"
                              {...register('email')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.email ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.email && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.email.message}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CONTACT SUBSECTION */}
                      <div className="space-y-6 pt-6 border-t border-white/5">
                        <h4 className="font-display font-black text-lg sm:text-xl uppercase tracking-widest text-brand-300">
                          Persona de Contacto Alterna
                        </h4>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Nombre del Contacto *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Maria Isabel Perez"
                              {...register('contactName')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.contactName ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.contactName && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.contactName.message}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Teléfono de Contacto *
                            </label>
                            <input
                              type="tel"
                              placeholder="Ej: 3019876543"
                              {...register('contactPhone', {
                                onChange: (e) => {
                                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }
                              })}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.contactPhone ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.contactPhone && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.contactPhone.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                              Correo de Contacto *
                            </label>
                            <input
                              type="email"
                              placeholder="Ej: contacto@gaiteros.com"
                              {...register('contactEmail')}
                              className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.contactEmail ? 'border-red-500' : 'border-white/10'
                                }`}
                            />
                            {errors.contactEmail && (
                              <p className="text-xs text-red-400 mt-1 font-body">{errors.contactEmail.message}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-ink-900 font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          Siguiente: Documentos
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DOCUMENTS */}
                  {currentStep === 2 && (
                    <div className="space-y-8 animate-fade-in">
                      <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-brand-400 border-b border-white/5 pb-3">
                        2. Documentos Requeridos de la Agrupación
                      </h3>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Review File */}
                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2 sm:min-h-[40px]">
                            Reseña Artística *
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              id="review-input"
                              className="hidden"
                              {...register('reviewFile', {
                                onChange: (e) => setReviewName(e.target.files?.[0]?.name || null),
                              })}
                            />
                            <label
                              htmlFor="review-input"
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all min-h-[140px] ${errors.reviewFile ? 'border-red-500' : 'border-white/10'
                                }`}
                            >
                              <FileText className="w-6 h-6 text-ink-500 mb-2" />
                              <span className="text-xs font-body font-medium text-white truncate max-w-full">
                                {reviewName || 'Seleccionar Reseña'}
                              </span>
                              <span className="text-[9px] font-body text-ink-500 mt-1">PDF o Word (Máx. 5MB)</span>
                            </label>
                          </div>
                          {errors.reviewFile && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.reviewFile.message as string}</p>
                          )}
                        </div>

                        {/* Photo File */}
                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2 sm:min-h-[40px]">
                            Fotografía Artística *
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              id="photo-input"
                              className="hidden"
                              {...register('photoFile', {
                                onChange: (e) => setPhotoName(e.target.files?.[0]?.name || null),
                              })}
                            />
                            <label
                              htmlFor="photo-input"
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all min-h-[140px] ${errors.photoFile ? 'border-red-500' : 'border-white/10'
                                }`}
                            >
                              <Upload className="w-6 h-6 text-ink-500 mb-2" />
                              <span className="text-xs font-body font-medium text-white truncate max-w-full">
                                {photoName || 'Seleccionar Foto'}
                              </span>
                              <span className="text-[9px] font-body text-ink-500 mt-1">JPG, PNG o PDF (Máx. 5MB)</span>
                            </label>
                          </div>
                          {errors.photoFile && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.photoFile.message as string}</p>
                          )}
                        </div>

                        {/* Logo File (Optional) */}
                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2 sm:min-h-[40px]">
                            Logo de Agrupación (opcional)
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              id="logo-input"
                              className="hidden"
                              {...register('logoFile', {
                                onChange: (e) => setLogoName(e.target.files?.[0]?.name || null),
                              })}
                            />
                            <label
                              htmlFor="logo-input"
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all min-h-[140px] ${errors.logoFile ? 'border-red-500' : 'border-white/10'
                                }`}
                            >
                              <Upload className="w-6 h-6 text-ink-500 mb-2" />
                              <span className="text-xs font-body font-medium text-white truncate max-w-full">
                                {logoName || 'Seleccionar Logo'}
                              </span>
                              <span className="text-[9px] font-body text-ink-500 mt-1">JPG, PNG o PDF (Máx. 5MB)</span>
                            </label>
                          </div>
                          {errors.logoFile && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.logoFile.message as string}</p>
                          )}
                        </div>

                        {/* Members List File */}
                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2 sm:min-h-[40px]">
                            Firma del Director o Representante *
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              id="members-list-input"
                              className="hidden"
                              {...register('membersListFile', {
                                onChange: (e) => setMembersListName(e.target.files?.[0]?.name || null),
                              })}
                            />
                            <label
                              htmlFor="members-list-input"
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all min-h-[140px] ${errors.membersListFile ? 'border-red-500' : 'border-white/10'
                                }`}
                            >
                              <FileText className="w-6 h-6 text-ink-500 mb-2" />
                              <span className="text-xs font-body font-medium text-white truncate max-w-full">
                                {membersListName || 'Seleccionar Listado'}
                              </span>
                              <span className="text-[9px] font-body text-ink-500 mt-1">PDF o Word Firmado (Máx. 5MB)</span>
                            </label>
                          </div>
                          {errors.membersListFile && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.membersListFile.message as string}</p>
                          )}
                        </div>

                        {/* Identifications Copies merged */}
                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2 sm:min-h-[40px]">
                            Copias Documentos de Identidad *
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              id="ids-input"
                              className="hidden"
                              {...register('idsFile', {
                                onChange: (e) => setIdsName(e.target.files?.[0]?.name || null),
                              })}
                            />
                            <label
                              htmlFor="ids-input"
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all min-h-[140px] ${errors.idsFile ? 'border-red-500' : 'border-white/10'
                                }`}
                            >
                              <FileText className="w-6 h-6 text-ink-500 mb-2" />
                              <span className="text-xs font-body font-medium text-white truncate max-w-full">
                                {idsName || 'Seleccionar Documentos'}
                              </span>
                              <span className="text-[9px] font-body text-ink-500 mt-1">Un solo PDF consolidado (Máx 5MB)</span>
                            </label>
                          </div>
                          {errors.idsFile && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.idsFile.message as string}</p>
                          )}
                        </div>

                        {/* EPS Certification */}
                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2 sm:min-h-[40px]">
                            Certificados Afiliación EPS *
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              id="eps-input"
                              className="hidden"
                              {...register('epsFile', {
                                onChange: (e) => setEpsName(e.target.files?.[0]?.name || null),
                              })}
                            />
                            <label
                              htmlFor="eps-input"
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all min-h-[140px] ${errors.epsFile ? 'border-red-500' : 'border-white/10'
                                }`}
                            >
                              <FileText className="w-6 h-6 text-ink-500 mb-2" />
                              <span className="text-xs font-body font-medium text-white truncate max-w-full">
                                {epsName || 'Seleccionar EPS'}
                              </span>
                              <span className="text-[9px] font-body text-ink-500 mt-1">Un solo PDF consolidado (Máx 5MB)</span>
                            </label>
                          </div>
                          {errors.epsFile && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.epsFile.message as string}</p>
                          )}
                        </div>

                        {/* Minors Authorization (Optional) */}
                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2 sm:min-h-[40px]">
                            Autorizaciones de Menores (si aplica)
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf"
                              id="minors-auth-input"
                              className="hidden"
                              {...register('minorsAuthFile', {
                                onChange: (e) => setMinorsAuthName(e.target.files?.[0]?.name || null),
                              })}
                            />
                            <label
                              htmlFor="minors-auth-input"
                              className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-brand-400 hover:bg-white/[0.01] transition-all min-h-[140px] ${errors.minorsAuthFile ? 'border-red-500' : 'border-white/10'
                                }`}
                            >
                              <FileText className="w-6 h-6 text-ink-500 mb-2" />
                              <span className="text-xs font-body font-medium text-white truncate max-w-full">
                                {minorsAuthName || 'Seleccionar Permisos'}
                              </span>
                              <span className="text-[9px] font-body text-ink-500 mt-1">PDF consolidado (Máx 5MB)</span>
                            </label>
                          </div>
                          {errors.minorsAuthFile && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.minorsAuthFile.message as string}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-2.5 bg-ink-800 hover:bg-ink-700 text-white font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer border border-white/10"
                        >
                          Atrás
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-ink-900 font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          Siguiente: Integrantes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: MEMBERS RELATION */}
                  {currentStep === 3 && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="border-b border-white/5 pb-3">
                        <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-brand-400 flex items-center gap-2">
                          <Users className="w-6 h-6" />
                          3. Relación de Integrantes (Exactamente {members.length})
                        </h3>
                      </div>

                      <p className="text-ink-400 text-sm font-body font-light">
                        Registra la información de los {members.length} integrantes de tu agrupación. Selecciona cada rol a continuación para diligenciar sus datos correspondientes.
                      </p>

                      {/* Numeric Sub-tabs bar */}
                      <div className="flex gap-2.5 pb-2 overflow-x-auto border-b border-white/5">
                        {members.map((m, i) => {
                          const isCompleted = m.fullName.trim() !== '' && m.docNumber.trim() !== '';
                          const roleLabels = getMemberRolesForCategory(category);
                          const roleLabel = roleLabels[i] || `Integrante #${i + 1}`;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setActiveMemberTab(i)}
                              className={`px-5 py-2.5 font-display font-bold text-xs uppercase tracking-widest transition-all border cursor-pointer flex items-center gap-2 shrink-0 ${activeMemberTab === i
                                ? 'bg-brand-500 border-brand-400 text-ink-900 shadow-[0_0_10px_rgba(234,179,8,0.15)] font-black'
                                : 'bg-ink-800/40 border-white/5 text-ink-400 hover:text-white hover:border-white/10'
                                }`}
                            >
                              <span>{roleLabel}</span>
                              {isCompleted ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Member form card */}
                      {activeMember && (
                        <div className="py-4 space-y-6">
                          <div className="grid sm:grid-cols-3 gap-6">
                            <div className="sm:col-span-2">
                              <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                                Nombre Completo *
                              </label>
                              <input
                                type="text"
                                value={activeMember.fullName}
                                onChange={(e) => updateMember(activeMember.id, 'fullName', e.target.value)}
                                placeholder="Ej: Juan Carlos Martinez"
                                className="w-full bg-ink-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body"
                              />
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                                Fecha de Nacimiento *
                              </label>
                              <input
                                type="date"
                                value={activeMember.birthDate}
                                onChange={(e) => updateMember(activeMember.id, 'birthDate', e.target.value)}
                                className="w-full bg-ink-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body"
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-6">
                            <div>
                              <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                                Tipo Doc. *
                              </label>
                              <select
                                value={activeMember.docType}
                                onChange={(e) => updateMember(activeMember.id, 'docType', e.target.value)}
                                className="w-full bg-ink-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body"
                              >
                                {DOC_TYPES.map((t) => (
                                  <option key={t.value} value={t.value}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                                No. Documento *
                              </label>
                              <input
                                type="text"
                                value={activeMember.docNumber}
                                onChange={(e) => updateMember(activeMember.id, 'docNumber', e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Ej: 11223344"
                                className="w-full bg-ink-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body"
                              />
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                                Sexo *
                              </label>
                              <select
                                value={activeMember.gender}
                                onChange={(e) => updateMember(activeMember.id, 'gender', e.target.value)}
                                className="w-full bg-ink-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body"
                              >
                                {GENDER_OPTIONS.map((g) => (
                                  <option key={g.value} value={g.value}>
                                    {g.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                                Teléfono (opcional)
                              </label>
                              <input
                                type="tel"
                                value={activeMember.phone || ''}
                                onChange={(e) => updateMember(activeMember.id, 'phone', e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Ej: 3009998877"
                                className="w-full bg-ink-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body"
                              />
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                                Correo Electrónico (opcional)
                              </label>
                              <input
                                type="email"
                                value={activeMember.email || ''}
                                onChange={(e) => updateMember(activeMember.id, 'email', e.target.value)}
                                placeholder="Ej: integrante@gaiteros.com"
                                className="w-full bg-ink-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body"
                              />
                            </div>
                          </div>

                          {/* Member flow navigation */}
                          <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
                            <div className="flex gap-4">
                              <button
                                type="button"
                                onClick={() => {
                                  if (activeMemberTab > 0) {
                                    setActiveMemberTab((prev) => prev - 1);
                                  } else {
                                    prevStep();
                                  }
                                }}
                                className="px-6 py-2.5 bg-ink-800 hover:bg-ink-700 text-white font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer border border-white/10"
                              >
                                {activeMemberTab > 0 ? 'Integrante Anterior' : 'Atrás (Paso 2)'}
                              </button>
                              {activeMemberTab > 0 && (
                                <button
                                  type="button"
                                  onClick={prevStep}
                                  className="px-4 py-2 text-ink-500 hover:text-white font-display font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                                >
                                  Volver a Paso 2
                                </button>
                              )}
                            </div>

                            <div>
                              {activeMemberTab < members.length - 1 ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveMemberTab((prev) => prev + 1)}
                                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-ink-900 font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                                >
                                  Siguiente Integrante
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={nextStep}
                                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-ink-900 font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                                >
                                  Siguiente: Datos Personales (Paso 4)
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 4: DATA PROCESSING AND IMAGE USE AUTHORIZATION */}
                  {currentStep === 4 && (
                    <div className="space-y-8 animate-fade-in">
                      <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-brand-400 border-b border-white/5 pb-3">
                        4. Tratamiento de Datos y Autorización de Uso de Imagen
                      </h3>

                      <div className="p-6 bg-white/[0.01] border-l-2 border-brand-400 space-y-6">
                        <p className="text-sm sm:text-base leading-relaxed font-body font-light text-ink-300">
                          Al marcar la casilla de aceptación, actuando a nombre propio o como representante legal del menor de edad inscrito, autorizo de manera voluntaria y expresa a la <strong>Corporación Social Incluyamos (NIT 900.913.366-3)</strong> y al <strong>Ministerio de las Culturas, las Artes y los Saberes</strong>, para:
                        </p>

                        <div className="space-y-4 text-sm sm:text-base font-body font-light text-ink-300">
                          <div className="flex gap-3">
                            <span className="font-bold text-brand-400 shrink-0">1.</span>
                            <p className="leading-relaxed">
                              <strong>Uso de imagen:</strong> Captar, publicar y difundir (en medios digitales, impresos, televisión y redes sociales) mi imagen/voz o la del menor representado, obtenida durante las actividades, presentaciones y procesos del festival, con fines exclusivamente culturales, pedagógicos y de memoria institucional, sin que esto vulnere la intimidad ni genere derechos económicos.
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <span className="font-bold text-brand-400 shrink-0">2.</span>
                            <p className="leading-relaxed">
                              <strong>Tratamiento de datos:</strong> Recolectar y tratar los datos personales suministrados en este formulario conforme a la Ley 1581 de 2012, garantizando en todo momento el respeto al interés superior y los derechos fundamentales de los niños, niñas y adolescentes (Ley 1098 de 2006).
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 mt-6 pt-4 border-t border-white/5">
                          <input
                            type="checkbox"
                            id="acceptDataProcessing"
                            {...register('acceptDataProcessing')}
                            className="mt-1 w-4 h-4 accent-brand-400"
                          />
                          <label htmlFor="acceptDataProcessing" className="text-xs sm:text-sm font-body font-light text-ink-300 cursor-pointer">
                            Comprendo los términos y acepto el Tratamiento de Datos Personales y la Autorización de Uso de Imagen. *
                          </label>
                        </div>
                        {errors.acceptDataProcessing && (
                          <p className="text-xs text-red-400 mt-1 font-body">{errors.acceptDataProcessing.message}</p>
                        )}
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-2.5 bg-ink-800 hover:bg-ink-700 text-white font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer border border-white/10"
                        >
                          Atrás
                        </button>

                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!acceptDataProcessing}
                          className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-ink-900 font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Siguiente: Declaración (Paso 5)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: DECLARATION AND SUBMISSION */}
                  {currentStep === 5 && (
                    <div className="space-y-8 animate-fade-in">
                      <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-brand-400 border-b border-white/5 pb-3">
                        5. Declaración Jurada y Firma de Representante
                      </h3>

                      <div className="p-6 bg-white/[0.01] border-l-2 border-brand-400 space-y-4">
                        <p className="text-sm sm:text-base leading-relaxed font-body font-light text-ink-300">
                          Como representante de la agrupación, certifico que la información suministrada es veraz y
                          que todos los integrantes conocen y aceptan el reglamento del Festival Nacional de Gaitas.
                        </p>

                        <div className="flex items-start gap-3 mt-4">
                          <input
                            type="checkbox"
                            id="acceptRegulations"
                            {...register('acceptRegulations')}
                            className="mt-1 w-4 h-4 accent-brand-400"
                          />
                          <label htmlFor="acceptRegulations" className="text-xs sm:text-sm font-body font-light text-ink-300 cursor-pointer">
                            Acepto el reglamento y declaro bajo gravedad de juramento la veracidad de los datos entregados. *
                          </label>
                        </div>
                        {errors.acceptRegulations && (
                          <p className="text-xs text-red-400 mt-1 font-body">{errors.acceptRegulations.message}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                            Nombre del Representante Legal *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Pedro Castro"
                            {...register('representativeName')}
                            className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.representativeName ? 'border-red-500' : 'border-white/10'
                              }`}
                          />
                          {errors.representativeName && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.representativeName.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-display font-extrabold uppercase tracking-widest2 text-white mb-2">
                            Documento de Identidad del Representante *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: C.C. 1100223344"
                            {...register('representativeId', {
                              onChange: (e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                              }
                            })}
                            className={`w-full bg-ink-800 border px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-400 transition-colors font-body ${errors.representativeId ? 'border-red-500' : 'border-white/10'
                              }`}
                          />
                          {errors.representativeId && (
                            <p className="text-xs text-red-400 mt-1 font-body">{errors.representativeId.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded text-xs text-ink-400 font-body leading-relaxed">
                        Al enviar este formulario, usted autoriza el tratamiento de sus datos personales bajo la ley 1581 de 2012 (Habeas Data) para la gestión del registro de agrupaciones del Festival Nacional de Gaitas.
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="px-6 py-2.5 bg-ink-800 hover:bg-ink-700 text-white font-display font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer border border-white/10"
                        >
                          Atrás
                        </button>

                        <button
                          type="submit"
                          disabled={submitting || registrationState !== 'open' || !isValid || !acceptRegulations}
                          className="px-8 py-2.5 bg-brand-500 hover:bg-brand-400 text-ink-900 font-display font-bold text-xs uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {submitting ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block mr-2" />
                          ) : null}
                          {submitting
                            ? 'Procesando Envío...'
                            : registrationState === 'before_opening'
                              ? 'Inscripciones no iniciadas'
                              : registrationState === 'closed'
                                ? 'Inscripciones cerradas'
                                : 'Enviar Inscripción de Agrupación'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
