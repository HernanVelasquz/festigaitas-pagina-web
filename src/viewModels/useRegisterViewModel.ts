import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';

// Define rhythm options
export const RHYTHM_OPTIONS = [
  { value: 'porro', label: 'Porro' },
  { value: 'cumbia', label: 'Cumbia' },
  { value: 'merengue', label: 'Merengue' },
  { value: 'puya', label: 'Puya' },
] as const;

// Helper constants for file validation
const MAX_FILE_SIZE_DOC = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE_AUDIO = 15 * 1024 * 1024; // 15MB
const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3'];

// Form validation schema using Zod
export const registerSchema = z.object({
  authorName: z.string().min(1, 'El nombre del autor es obligatorio'),
  authorEmail: z.string().min(1, 'El correo electrónico es obligatorio').email('Ingresa un correo electrónico válido'),
  songName: z.string().min(1, 'El nombre de la canción es obligatorio'),
  authorPhone: z
    .string()
    .min(1, 'El número de teléfono es obligatorio')
    .regex(/^[0-9]+$/, 'Ingresa un número de teléfono válido (solo números)'),
  rhythm: z.enum(['porro', 'cumbia', 'merengue', 'puya'], {
    required_error: 'Selecciona un ritmo válido',
  }),
  origin: z.string().min(1, 'El campo de procedencia es obligatorio'),
  lyricsFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'La letra de la canción es obligatoria')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_DOC_TYPES.includes(files[0].type)),
      'Solo se permiten archivos PDF o Word (.doc, .docx)'
    ),
  idFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'El documento de identidad es obligatorio')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_IMAGE_TYPES.includes(files[0].type)),
      'Solo se permiten imágenes (JPG, PNG) o PDF'
    ),
  rutFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'La copia del RUT es obligatoria')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_IMAGE_TYPES.includes(files[0].type)),
      'Solo se permiten imágenes (JPG, PNG) o PDF'
    ),
  photoFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'La fotografía del autor es obligatoria')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_IMAGE_TYPES.includes(files[0].type)),
      'Solo se permiten imágenes (JPG, PNG) o PDF'
    ),
  audioFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'El archivo de audio es obligatorio')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_AUDIO), 'El archivo de audio no debe superar los 15MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_AUDIO_TYPES.includes(files[0].type)),
      'Solo se permiten archivos de audio MP3'
    ),
  bankCertificateFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'La certificación bancaria es obligatoria')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_DOC), 'El archivo no debe superar los 5MB')
    .refine(
      (files) => !files || (files[0] && files[0].type === 'application/pdf'),
      'Solo se permiten archivos en formato PDF'
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useRegisterViewModel() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const getTargetDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}-25T17:00:00-05:00`;
    };

    const targetIso = getTargetDate();
    const targetTime = new Date(targetIso).getTime();
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
      const difference = targetTime - adjustedNow;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

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
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const uploadFile = async (file: File, folder: string, authorPhone: string): Promise<string> => {
    const currentYear = new Date().getFullYear();
    const fileName = `${currentYear}/${authorPhone}/${folder}/${file.name}`;

    // Upload files to bucket 'unreleased-song'
    const { error, data } = await supabase.storage
      .from('unreleased-song')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Error subiendo archivo ${file.name}: ${error.message}`);
    }

    // Retrieve public url
    const { data: urlData } = supabase.storage
      .from('unreleased-song')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const phone = data.authorPhone;
      // 1. Upload files to Supabase Storage
      const lyricsUrl = await uploadFile(data.lyricsFile[0], 'lyrics', phone);
      const idUrl = await uploadFile(data.idFile[0], 'identifications', phone);
      const rutUrl = await uploadFile(data.rutFile[0], 'rut_files', phone);
      const photoUrl = await uploadFile(data.photoFile[0], 'author_photos', phone);
      const audioUrl = await uploadFile(data.audioFile[0], 'audio', phone);
      const bankCertificateUrl = await uploadFile(data.bankCertificateFile[0], 'bank_certificates', phone);

      // 2. Save metadata to Supabase DB 'registrations'
      const { error } = await supabase.from('unreleased_song').insert([
        {
          author_name: data.authorName,
          author_email: data.authorEmail,
          author_phone: data.authorPhone,
          song_name: data.songName,
          rhythm: data.rhythm,
          origin: data.origin,
          lyrics_url: lyricsUrl,
          id_url: idUrl,
          rut_url: rutUrl,
          photo_url: photoUrl,
          audio_url: audioUrl,
          bank_certificate_url: bankCertificateUrl,
        },
      ]);

      if (error) {
        throw error;
      }

      setSuccess(true);
      reset();
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Ocurrió un error inesperado durante el registro.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    submitting,
    success,
    errorMsg,
    setSuccess,
    rhythmOptions: RHYTHM_OPTIONS,
    timeLeft,
  };
}
