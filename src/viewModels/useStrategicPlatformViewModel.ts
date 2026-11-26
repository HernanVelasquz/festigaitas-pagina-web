import { useState } from 'react';

export type ValueIconKey = 'identity' | 'innovation' | 'inclusion' | 'excellence' | 'collaboration';
export type ObjectiveTab = 'general' | 'specific';

export interface StrategicValue {
  id: string;
  title: string;
  description: string;
  icon: ValueIconKey;
}

export interface StrategicObjective {
  id: string;
  code: string;
  description: string;
}

const INTRO_TEXT =
  'El Festival Nacional de Gaitas “Francisco Llirene” de Ovejas, Sucre, reafirma su compromiso con la salvaguardia del patrimonio inmaterial y el desarrollo del territorio a través de los siguientes principios rectores:';

const MISSION_TEXT =
  'Ser el referente nacional e internacional en la promoción, preservación y divulgación de la música de gaitas y las expresiones culturales ancestrales de la región, impulsando el desarrollo socioeconómico sostenible a través de la innovación cultural, la educación artística y el fortalecimiento institucional. Creamos experiencias integrales que conectan tradición y modernidad, consolidando un espacio de formación, investigación y difusión que garantiza la transmisión de nuestro patrimonio cultural a futuras generaciones.';

const VISION_TEXT =
  'En 2036, el Festival Nacional de Gaitas “Francisco Llirene” será una organización líder, reconocida por su excelencia en gestión cultural y su impacto social a nivel nacional e internacional. Contará con infraestructura moderna y sostenible, un equipo de asociados altamente capacitados en gestión artística y liderazgo comunitario, y un modelo autónomo de generación de recursos. Generaremos redes estratégicas que potencien la cultura de gaita como símbolo de identidad, innovación y desarrollo integral, contribuyendo al bienestar y progreso de nuestra comunidad y región.';

const VALUES: StrategicValue[] = [
  {
    id: 'identidad-cultural',
    title: 'Identidad Cultural',
    description:
      'Protegemos y exaltamos nuestras raíces ancestrales y la tradición gaitera como patrimonio vivo y orgullo de nuestra región.',
    icon: 'identity',
  },
  {
    id: 'innovacion-tradicional',
    title: 'Innovación Tradicional',
    description:
      'Conectamos el folclor con la modernidad mediante procesos creativos, educativos y tecnológicos que renuevan sin perder la esencia.',
    icon: 'innovation',
  },
  {
    id: 'inclusion-democracia',
    title: 'Inclusión y Democracia',
    description:
      'Fomentamos la participación abierta, equitativa y el liderazgo de jóvenes, mujeres y toda la comunidad en la gestión cultural.',
    icon: 'inclusion',
  },
  {
    id: 'excelencia-transparencia',
    title: 'Excelencia y Transparencia',
    description:
      'Actuamos con rigor artístico, ética administrativa y compromiso para consolidar una organización referente y sostenible.',
    icon: 'excellence',
  },
  {
    id: 'colaboracion',
    title: 'Colaboración',
    description:
      'Impulsamos el trabajo en equipo, el relevo generacional y las alianzas estratégicas para el desarrollo social del territorio.',
    icon: 'collaboration',
  },
];

const GENERAL_OBJECTIVES: StrategicObjective[] = [
  {
    id: 'og-1',
    code: '01',
    description:
      'Consolidar y expandir la presencia del Festival Nacional de Gaitas como plataforma cultural y educativa de referencia, promoviendo la música y tradiciones de gaita con estándares de calidad y sostenibilidad.',
  },
  {
    id: 'og-2',
    code: '02',
    description:
      'Fortalecer la estructura institucional y administrativa del festival para asegurar su autonomía financiera, operativa y su liderazgo democrático.',
  },
  {
    id: 'og-3',
    code: '03',
    description:
      'Fomentar la formación artística y académica de los asociados y la comunidad a través de programas innovadores que vinculen la tradición con tecnologías contemporáneas.',
  },
  {
    id: 'og-4',
    code: '04',
    description:
      'Promover alianzas estratégicas nacionales e internacionales que potencien la difusión y valoración del patrimonio cultural regional.',
  },
];

const SPECIFIC_OBJECTIVES: StrategicObjective[] = [
  {
    id: 'oe-1',
    code: '01',
    description:
      'Implementar programas educativos integrales en instituciones formales y proyectos comunitarios que integren la música de gaitas y la cultura local como eje pedagógico.',
  },
  {
    id: 'oe-2',
    code: '02',
    description:
      'Ampliar y modernizar las infraestructuras del museo arqueológico, la biblioteca folclórica cultural y el centro audiovisual para favorecer la investigación y difusión.',
  },
  {
    id: 'oe-3',
    code: '03',
    description:
      'Desarrollar nuevos proyectos creativos y académicos que permitan la innovación en la interpretación y gestión de la música de gaitas.',
  },
  {
    id: 'oe-4',
    code: '04',
    description:
      'Incrementar la membresía activa mediante procesos de capacitación y liderazgo inclusivo, con énfasis en jóvenes y mujeres, fortaleciendo la gobernanza democrática.',
  },
  {
    id: 'oe-5',
    code: '05',
    description:
      'Garantizar la sostenibilidad financiera mediante la diversificación de fuentes de ingresos, incluyendo patrocinio, eventos y merchandising cultural.',
  },
];

/**
 * ViewModel for the Strategic Platform section (mission, vision, values, and objectives).
 */
export function useStrategicPlatformViewModel() {
  const [activeObjectiveTab, setActiveObjectiveTab] = useState<ObjectiveTab>('general');

  const activeObjectives =
    activeObjectiveTab === 'general' ? GENERAL_OBJECTIVES : SPECIFIC_OBJECTIVES;

  return {
    intro: INTRO_TEXT,
    mission: MISSION_TEXT,
    vision: VISION_TEXT,
    values: VALUES,
    generalObjectives: GENERAL_OBJECTIVES,
    specificObjectives: SPECIFIC_OBJECTIVES,
    activeObjectiveTab,
    setActiveObjectiveTab,
    activeObjectives,
  };
}
