import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';

// Category options
export const CATEGORY_OPTIONS = [
  { value: 'gaita_larga_profesional', label: 'Gaita Larga Profesional' },
  { value: 'gaita_larga_aficionado', label: 'Gaita Larga Aficionado' },
  { value: 'gaita_larga_juvenil', label: 'Gaita Larga Juvenil' },
  { value: 'gaita_larga_infantil', label: 'Gaita Larga Infantil' },
  { value: 'gaita_corta', label: 'Gaita Corta' },
  { value: 'parejas_bailadoras', label: 'Parejas Bailadoras' },
] as const;

// Modality options
export const MODALITY_OPTIONS = [
  { value: 'profesional', label: 'Profesional' },
  { value: 'aficionado', label: 'Aficionado' },
  { value: 'infantil', label: 'Infantil' },
  { value: 'juvenil', label: 'Juvenil' },
  { value: 'unica', label: 'Única / Abierta' },
] as const;

// Document types for members
export const DOC_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía (C.C.)' },
  { value: 'TI', label: 'Tarjeta de Identidad (T.I.)' },
  { value: 'RC', label: 'Registro Civil (R.C.)' },
  { value: 'CE', label: 'Cédula de Extranjería (C.E.)' },
] as const;

// Gender options
export const GENDER_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otro' },
] as const;

// Instrument / Role options
export const ROLE_OPTIONS = [
  { value: 'gaita_hembra', label: 'Gaita Hembra' },
  { value: 'gaita_macho', label: 'Gaita Macho' },
  { value: 'tambor_alegre', label: 'Tambor Alegre' },
  { value: 'tambor_llamador', label: 'Llamador' },
  { value: 'tambora', label: 'Tambora / Bombo' },
  { value: 'voz', label: 'Cantante' },
  { value: 'gaitero', label: 'Gaitero' },
  { value: 'maracas', label: 'Maracas' },
  { value: 'bailador', label: 'Bailador' },
  { value: 'bailadora', label: 'Bailadora' },
  { value: 'director_no_interprete', label: 'Director (No Intérprete)' },
] as const;

// Helper to get modalities based on category
export interface ModalityOption {
  value: string;
  label: string;
}

export const getModalityOptions = (category: string): readonly ModalityOption[] => {
  if (!category) return [];
  if (category.startsWith('gaita_larga')) {
    return [{ value: 'gaita_larga', label: 'Gaita larga' }] as const;
  }
  if (category === 'gaita_corta') {
    return [{ value: 'gaita_corta_unica', label: 'Gaita corta Única' }] as const;
  }
  if (category === 'parejas_bailadoras') {
    return [
      { value: 'infantil', label: 'Infantil' },
      { value: 'juvenil', label: 'Juvenil' },
      { value: 'aficionada', label: 'Aficionada' },
      { value: 'profesional', label: 'Profesional' },
    ] as const;
  }
  return [];
};

// Helper to get roles/titles list based on category
export const getMemberRolesForCategory = (category: string): string[] => {
  if (!category) {
    return ['Cantante', 'Gaita Hembra', 'Gaita Macho', 'Llamador', 'Tambor Alegre', 'Tambora/Bombo'];
  }
  if (category.startsWith('gaita_larga')) {
    return ['Cantante', 'Gaita Hembra', 'Gaita Macho', 'Llamador', 'Tambor Alegre', 'Tambora/Bombo'];
  }
  if (category === 'gaita_corta') {
    return ['Cantante', 'Gaitero', 'Maracas', 'Llamador', 'Tambor Alegre', 'Tambora/Bombo'];
  }
  if (category === 'parejas_bailadoras') {
    return ['Bailador', 'Bailadora'];
  }
  return ['Cantante', 'Gaita Hembra', 'Gaita Macho', 'Llamador', 'Tambor Alegre', 'Tambora/Bombo'];
};

// Helper to map role label to DB role code
export const getRoleCodeFromLabel = (label: string): string => {
  switch (label) {
    case 'Cantante': return 'voz';
    case 'Gaita Hembra': return 'gaita_hembra';
    case 'Gaita Macho': return 'gaita_macho';
    case 'Llamador': return 'tambor_llamador';
    case 'Tambor Alegre': return 'tambor_alegre';
    case 'Tambora/Bombo': return 'tambora';
    case 'Gaitero': return 'gaitero';
    case 'Maracas': return 'maracas';
    case 'Bailador': return 'bailador';
    case 'Bailadora': return 'bailadora';
    default: return '';
  }
};

// Helper constants for file validation
const MAX_FILE_SIZE_DOC = 5 * 1024 * 1024; // 5MB
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

// Zod schema for member
const memberSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  docType: z.string().min(1, 'El tipo de documento es obligatorio'),
  docNumber: z.string().min(1, 'El número de documento es obligatorio'),
  gender: z.string().min(1, 'El género es obligatorio'),
  role: z.string().min(1, 'El rol/instrumento es obligatorio'),
  phone: z.string().optional(),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
});

export type MemberFormData = z.infer<typeof memberSchema>;

// Main form schema
export const contestsSchema = z.object({
  groupName: z.string().min(1, 'El nombre de la agrupación es obligatorio'),
  category: z.string().min(1, 'Selecciona una categoría'),
  modality: z.string().min(1, 'Selecciona una modalidad'),
  originTown: z.string().min(1, 'El municipio de procedencia es obligatorio'),
  originDept: z.string().min(1, 'El departamento de procedencia es obligatorio'),
  address: z.string().min(1, 'La dirección de correspondencia es obligatoria'),
  creationYear: z.string().regex(/^[0-9]{4}$/, 'Ingresa un año válido (4 dígitos)'),
  totalMembers: z.coerce.number().min(1, 'El número total debe ser mayor a 0'),
  directorName: z.string().min(1, 'El nombre del director es obligatorio'),
  directorId: z.string().min(1, 'La cédula del director es obligatoria'),
  phone: z.string().min(1, 'El teléfono es obligatorio'),
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('Ingresa un correo electrónico válido'),
  contactName: z.string().min(1, 'La persona de contacto es obligatoria'),
  contactPhone: z.string().min(1, 'El teléfono de contacto es obligatorio'),
  contactEmail: z.string().min(1, 'El correo de contacto es obligatorio').email('Ingresa un correo de contacto válido'),
  socialNetworks: z.string().optional(),

  // Files
  reviewFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'La reseña artística es obligatoria')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_DOC_TYPES.includes(files[0].type)),
      'Solo se permiten archivos PDF o Word (.doc, .docx)'
    ),
  photoFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'La fotografía artística es obligatoria')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'La imagen no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_IMAGE_TYPES.includes(files[0].type)),
      'Solo se permiten imágenes (JPG, PNG) o PDF'
    ),
  logoFile: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length === 0 || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El logo no debe superar los 5MB')
    .refine(
      (files) => !files || files.length === 0 || (files[0] && ALLOWED_IMAGE_TYPES.includes(files[0].type)),
      'Solo se permiten imágenes (JPG, PNG) o PDF'
    ),
  membersListFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'El listado de integrantes firmado es obligatorio')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_DOC_TYPES.includes(files[0].type)),
      'Solo se permiten archivos PDF o Word'
    ),
  idsFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'La copia de documentos de identidad es obligatoria')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_DOC_TYPES.includes(files[0].type)),
      'Solo se permiten archivos PDF'
    ),
  epsFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'Los certificados de EPS son obligatorios')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_DOC_TYPES.includes(files[0].type)),
      'Solo se permiten archivos PDF'
    ),
  minorsAuthFile: z
    .custom<FileList>()
    .optional()
    .refine((files) => !files || files.length === 0 || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || files.length === 0 || (files[0] && ALLOWED_DOC_TYPES.includes(files[0].type)),
      'Solo se permiten archivos PDF'
    ),

  // Declaration
  acceptRegulations: z.boolean().refine((val) => val === true, 'Debes aceptar los términos y el reglamento'),
  acceptDataProcessing: z.boolean().refine((val) => val === true, 'Debes aceptar el Tratamiento de Datos Personales y la Autorización de Uso de Imagen'),
  representativeName: z.string().min(1, 'El nombre del representante es obligatorio'),
  representativeId: z.string().min(1, 'El documento del representante es obligatorio'),
});

export type ContestsFormData = z.infer<typeof contestsSchema>;

export type RegistrationState = 'before_opening' | 'open' | 'closed';

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useContestsViewModel() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registrationState, setRegistrationState] = useState<RegistrationState>('before_opening');
  
  // Dynamic members list state (exactly 6)
  const [members, setMembers] = useState<Array<MemberFormData & { id: string }>>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: `member-${i}-${Math.random().toString(36).substr(2, 5)}`,
      fullName: '',
      birthDate: '',
      docType: 'CC',
      docNumber: '',
      gender: 'M',
      role: i === 0 ? 'gaita_hembra' : i === 1 ? 'gaita_macho' : i === 2 ? 'tambor_alegre' : i === 3 ? 'tambor_llamador' : i === 4 ? 'tambora' : 'voz',
      phone: '',
      email: '',
    }))
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const openingTime = new Date('2026-06-25T00:00:00-05:00').getTime();
    const closingTime = new Date('2026-07-31T17:00:00-05:00').getTime();
    let offset = 0;

    const syncServerTime = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) return;
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'HEAD',
          headers: { apikey: supabaseAnonKey },
        });
        const serverDateStr = response.headers.get('date');
        if (serverDateStr) {
          const serverTime = new Date(serverDateStr).getTime();
          const clientTime = Date.now();
          offset = serverTime - clientTime;
        }
      } catch (err) {
        console.error('Error syncing server time:', err);
      }
    };

    syncServerTime().then(() => {
      calculateTime();
    });

    const calculateTime = () => {
      const adjustedNow = Date.now() + offset;
      
      let state: RegistrationState = 'before_opening';
      let targetTime = openingTime;

      if (adjustedNow < openingTime) {
        state = 'before_opening';
        targetTime = openingTime;
      } else if (adjustedNow < closingTime) {
        state = 'open';
        targetTime = closingTime;
      } else {
        state = 'closed';
        targetTime = 0;
      }

      setRegistrationState(state);

      if (state === 'closed') {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const difference = targetTime - adjustedNow;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<ContestsFormData>({
    resolver: zodResolver(contestsSchema),
    mode: 'onChange',
    defaultValues: {
      acceptRegulations: false,
      acceptDataProcessing: false,
      totalMembers: 6,
    },
  });

  // Members Management
  const addMember = () => {};
  const removeMember = (_id: string) => {};

  const updateMember = (id: string, field: keyof MemberFormData, value: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const category = watch('category');
  const modalityOptions = getModalityOptions(category);

  // Category -> Modality reactivity
  useEffect(() => {
    setValue('modality', '');
  }, [category, setValue]);

  // Category -> Members count and roles reactivity
  useEffect(() => {
    const targetRoles = getMemberRolesForCategory(category);
    setMembers((prev) => {
      return targetRoles.map((roleLabel, index) => {
        const existing = prev[index];
        const roleCode = getRoleCodeFromLabel(roleLabel);
        if (existing) {
          return {
            ...existing,
            role: roleCode,
          };
        } else {
          return {
            id: `member-${index}-${Math.random().toString(36).substr(2, 5)}`,
            fullName: '',
            birthDate: '',
            docType: 'CC',
            docNumber: '',
            gender: 'M',
            role: roleCode,
            phone: '',
            email: '',
          };
        }
      });
    });
  }, [category]);

  useEffect(() => {
    setValue('totalMembers', members.length);
  }, [members, setValue]);

  const uploadFile = async (file: File, folder: string, groupName: string): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const cleanGroupName = groupName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^a-z0-9]/g, '_')       // Reemplazar caracteres especiales por guiones bajos
      .replace(/_+/g, '_')             // Evitar guiones bajos consecutivos
      .replace(/^_+|_+$/g, '');        // Recortar guiones al inicio o final

    const fileName = `${currentYear}/${cleanGroupName}/${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

    const { error } = await supabase.storage
      .from('group-registrations')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Error subiendo archivo ${file.name}: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from('group-registrations')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const onSubmit = async (data: ContestsFormData) => {
    setSubmitting(true);
    setErrorMsg(null);

    // Validate that the members list is filled
    const invalidMember = members.find(
      (m) => !m.fullName.trim() || !m.birthDate || !m.docNumber.trim() || !m.role
    );
    if (invalidMember) {
      setErrorMsg('Por favor completa todos los campos requeridos de la sección Relación de Integrantes.');
      setSubmitting(false);
      return;
    }

    try {
      const groupName = data.groupName;

      // 0. Check for duplicate group name (case-insensitive)
      const { data: existingGroups, error: checkError } = await supabase
        .from('group_registrations')
        .select('id')
        .ilike('group_name', groupName.trim());

      if (checkError) {
        throw checkError;
      }

      if (existingGroups && existingGroups.length > 0) {
        setErrorMsg('Esta agrupación ya se encuentra inscrita en el festival.');
        setSubmitting(false);
        return;
      }
      
      // 1. Upload files to Supabase Storage
      const reviewUrl = await uploadFile(data.reviewFile[0], 'artistic_reviews', groupName);
      const photoUrl = await uploadFile(data.photoFile[0], 'group_photos', groupName);
      const logoUrl = data.logoFile && data.logoFile.length > 0 
        ? await uploadFile(data.logoFile[0], 'logos', groupName) 
        : '';
      const membersListUrl = await uploadFile(data.membersListFile[0], 'members_lists', groupName);
      const idsUrl = await uploadFile(data.idsFile[0], 'group_identifications', groupName);
      const epsUrl = await uploadFile(data.epsFile[0], 'eps_certificates', groupName);
      const minorsAuthUrl = data.minorsAuthFile && data.minorsAuthFile.length > 0
        ? await uploadFile(data.minorsAuthFile[0], 'minors_authorizations', groupName)
        : '';

      // 2. Format the members data to a clean object representation
      const cleanMembers = members.map(({ id: _, ...m }) => ({
        fullName: m.fullName,
        birthDate: m.birthDate,
        docType: m.docType,
        docNumber: m.docNumber,
        gender: m.gender,
        role: m.role,
        phone: m.phone || null,
        email: m.email || null,
      }));

      // 3. Save metadata to Supabase DB
      const { error } = await supabase.from('group_registrations').insert([
        {
          group_name: data.groupName,
          category: data.category,
          modality: data.modality,
          origin_municipality: data.originTown,
          origin_department: data.originDept,
          address: data.address,
          creation_year: parseInt(data.creationYear, 10),
          total_members: data.totalMembers,
          director_name: data.directorName,
          director_id: data.directorId,
          phone: data.phone,
          email: data.email,
          contact_name: data.contactName,
          contact_phone: data.contactPhone,
          contact_email: data.contactEmail,
          social_networks: data.socialNetworks || null,
          review_url: reviewUrl,
          photo_url: photoUrl,
          logo_url: logoUrl || null,
          members_list_url: membersListUrl,
          ids_url: idsUrl,
          eps_url: epsUrl,
          minors_auth_url: minorsAuthUrl || null,
          representative_name: data.representativeName,
          representative_id: data.representativeId,
          accept_regulations: data.acceptRegulations,
          accept_data_processing: data.acceptDataProcessing,
          members: cleanMembers,
        },
      ]);

      if (error) {
        throw error;
      }

      setSuccess(true);
      const defaultRoles = getMemberRolesForCategory('');
      setMembers(
        defaultRoles.map((roleLabel, i) => ({
          id: `member-${i}-${Math.random().toString(36).substr(2, 5)}`,
          fullName: '',
          birthDate: '',
          docType: 'CC',
          docNumber: '',
          gender: 'M',
          role: getRoleCodeFromLabel(roleLabel),
          phone: '',
          email: '',
        }))
      );
      reset();
    } catch (err: unknown) {
      console.error('Registration error:', err);
      const msg = err instanceof Error ? err.message : 'Ocurrió un error inesperado durante el registro.';
      if (msg.includes('relation "public.group_registrations" does not exist')) {
        setErrorMsg('El registro local fue exitoso, pero la tabla "group_registrations" aún no está configurada en la base de datos de Supabase. Comunícate con el administrador del festival.');
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isMembersValid = members.every(
    (m) => m.fullName.trim() !== '' && m.birthDate !== '' && m.docNumber.trim() !== ''
  );

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    submitting,
    success,
    errorMsg,
    setSuccess,
    timeLeft,
    registrationState,
    members,
    addMember,
    removeMember,
    updateMember,
    watch,
    setValue,
    modalityOptions,
    trigger,
    isValid: isValid && isMembersValid,
  };}
