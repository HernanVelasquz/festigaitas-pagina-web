import { useState } from 'react';
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
  songName: z.string().min(1, 'El nombre de la canción es obligatorio'),
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
  audioFile: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, 'El archivo de audio es obligatorio')
    .refine((files) => !files || (files[0] && files[0].size <= MAX_FILE_SIZE_AUDIO), 'El archivo de audio no debe superar los 15MB')
    .refine(
      (files) => !files || (files[0] && ALLOWED_AUDIO_TYPES.includes(files[0].type)),
      'Solo se permiten archivos de audio MP3'
    ),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegisterViewModel() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    // Upload files to bucket 'registration-files'
    const { error, data } = await supabase.storage
      .from('registration-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Error subiendo archivo ${file.name}: ${error.message}`);
    }

    // Retrieve public url
    const { data: urlData } = supabase.storage
      .from('registration-files')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Upload files to Supabase Storage
      const lyricsUrl = await uploadFile(data.lyricsFile[0], 'lyrics');
      const idUrl = await uploadFile(data.idFile[0], 'identifications');
      const audioUrl = await uploadFile(data.audioFile[0], 'audio');

      // 2. Save metadata to Supabase DB 'registrations'
      const { error } = await supabase.from('registrations').insert([
        {
          author_name: data.authorName,
          song_name: data.songName,
          rhythm: data.rhythm,
          origin: data.origin,
          lyrics_url: lyricsUrl,
          id_url: idUrl,
          audio_url: audioUrl,
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
  };
}
