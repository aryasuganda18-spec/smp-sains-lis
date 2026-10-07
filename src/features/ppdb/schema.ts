import { z } from 'zod';
import type { RegistrationInsert } from '@/lib/supabase/types';
import { isValidPhone, normalizePhone } from '@/lib/whatsapp';

const MIN_AGE_YEARS = 9;
const MAX_AGE_YEARS = 18;

export function isPlausibleBirthdate(value: string, today = new Date()): boolean {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const age = (today.getTime() - date.getTime()) / (365.25 * 24 * 3600 * 1000);
  return age >= MIN_AGE_YEARS && age <= MAX_AGE_YEARS;
}

const optionalText = (max: number) => z.string().trim().max(max, `Maksimal ${max} karakter`);
const requiredName = (label: string) =>
  z.string().trim().min(2, `${label} minimal 2 huruf`).max(100, 'Maksimal 100 karakter');

export const ppdbSchema = z.object({
  studentName: requiredName('Nama calon siswa'),
  gender: z.enum(['', 'Laki-laki', 'Perempuan']),
  birthplace: optionalText(100),
  birthdate: z.string().refine((v) => v === '' || isPlausibleBirthdate(v), 'Periksa kembali tanggal lahir'),
  nisn: z.string().trim().refine((v) => v === '' || /^\d{10}$/.test(v), 'NISN terdiri dari 10 angka'),
  previousSchool: optionalText(150),
  address: optionalText(300),
  parentName: requiredName('Nama orang tua/wali'),
  parentJob: optionalText(100),
  whatsapp: z.string().trim().refine(isValidPhone, 'Nomor WhatsApp tidak valid, contoh 081234567890'),
  email: z
    .string()
    .trim()
    .max(150, 'Maksimal 150 karakter')
    .refine((v) => v === '' || z.email().safeParse(v).success, 'Format email tidak valid'),
  boarding: z.enum(['', 'ya', 'tidak']),
  message: optionalText(500),
  website: z.string(),
});

export type PpdbFormValues = z.infer<typeof ppdbSchema>;

export const PPDB_DEFAULTS: PpdbFormValues = {
  studentName: '',
  gender: '',
  birthplace: '',
  birthdate: '',
  nisn: '',
  previousSchool: '',
  address: '',
  parentName: '',
  parentJob: '',
  whatsapp: '',
  email: '',
  boarding: '',
  message: '',
  website: '',
};

export function toRegistrationPayload(values: PpdbFormValues): RegistrationInsert {
  return {
    source: 'ppdb_form',
    student_name: values.studentName.trim(),
    student_gender: values.gender || null,
    student_birthplace: values.birthplace.trim(),
    student_birthdate: values.birthdate || null,
    student_address: values.address.trim(),
    previous_school: values.previousSchool.trim(),
    nisn: values.nisn.trim(),
    parent_name: values.parentName.trim(),
    parent_job: values.parentJob.trim(),
    whatsapp: normalizePhone(values.whatsapp),
    email: values.email.trim(),
    boarding_interest: values.boarding === '' ? null : values.boarding === 'ya',
    message: values.message.trim(),
  };
}
