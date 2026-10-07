import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { CONTACT, WHATSAPP_MESSAGES } from '@/data/site';
import { submitRegistration } from '@/lib/api/content';
import { whatsAppLink } from '@/lib/whatsapp';
import { PPDB_DEFAULTS, type PpdbFormValues, ppdbSchema, toRegistrationPayload } from './schema';

interface Submitted {
  parentName: string;
  studentName: string;
}

export function PpdbForm() {
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PpdbFormValues>({ resolver: zodResolver(ppdbSchema), defaultValues: PPDB_DEFAULTS });

  const mutation = useMutation({ mutationFn: submitRegistration });

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const onSubmit = handleSubmit(async (values) => {
    const done = { parentName: values.parentName.trim(), studentName: values.studentName.trim() };
    if (values.website) {
      setSubmitted(done);
      return;
    }
    await mutation.mutateAsync(toRegistrationPayload(values)).then(
      () => setSubmitted(done),
      () => undefined,
    );
  });

  if (submitted) {
    const firstName = submitted.parentName.split(' ')[0] ?? submitted.parentName;
    return (
      <div ref={successRef} tabIndex={-1} className="form-success" role="status">
        <CheckCircle2 size={36} aria-hidden="true" />
        <h3>Terima kasih, {firstName}.</h3>
        <p>
          Data <strong>{submitted.studentName}</strong> sudah kami terima. Admin akan menghubungi lewat WhatsApp untuk
          jadwal tes dan wawancara.
        </p>
        <div className="form-success__actions">
          <ButtonLink
            variant="gold"
            href={whatsAppLink(CONTACT.whatsappId, WHATSAPP_MESSAGES.registered(submitted.parentName, submitted.studentName))}
          >
            Konfirmasi lewat WhatsApp
          </ButtonLink>
          <Button
            variant="outline"
            onClick={() => {
              reset(PPDB_DEFAULTS);
              mutation.reset();
              setSubmitted(null);
            }}
          >
            Daftarkan calon siswa lain
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={(event) => void onSubmit(event)} noValidate>
      <fieldset className="form__group">
        <legend>Calon siswa</legend>
        <Field label="Nama lengkap" required error={errors.studentName?.message}>
          {(c) => <input className="input" {...c} {...register('studentName')} autoComplete="off" />}
        </Field>
        <div className="form__row">
          <Field label="Jenis kelamin" optional error={errors.gender?.message}>
            {(c) => (
              <select className="input" {...c} {...register('gender')}>
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            )}
          </Field>
          <Field label="NISN" optional hint="10 angka" error={errors.nisn?.message}>
            {(c) => <input className="input" inputMode="numeric" maxLength={10} {...c} {...register('nisn')} />}
          </Field>
        </div>
        <div className="form__row">
          <Field label="Tempat lahir" optional error={errors.birthplace?.message}>
            {(c) => <input className="input" {...c} {...register('birthplace')} autoComplete="off" />}
          </Field>
          <Field label="Tanggal lahir" optional error={errors.birthdate?.message}>
            {(c) => <input className="input" type="date" {...c} {...register('birthdate')} />}
          </Field>
        </div>
        <Field label="Asal sekolah" optional error={errors.previousSchool?.message}>
          {(c) => <input className="input" {...c} {...register('previousSchool')} autoComplete="off" />}
        </Field>
        <Field label="Alamat" optional error={errors.address?.message}>
          {(c) => <textarea className="input" rows={2} {...c} {...register('address')} autoComplete="street-address" />}
        </Field>
      </fieldset>

      <fieldset className="form__group">
        <legend>Orang tua / wali</legend>
        <div className="form__row">
          <Field label="Nama lengkap" required error={errors.parentName?.message}>
            {(c) => <input className="input" {...c} {...register('parentName')} autoComplete="name" />}
          </Field>
          <Field label="Pekerjaan" optional error={errors.parentJob?.message}>
            {(c) => <input className="input" {...c} {...register('parentJob')} autoComplete="organization-title" />}
          </Field>
        </div>
        <div className="form__row">
          <Field label="Nomor WhatsApp" required error={errors.whatsapp?.message}>
            {(c) => <input className="input" type="tel" inputMode="tel" {...c} {...register('whatsapp')} autoComplete="tel" />}
          </Field>
          <Field label="Email" optional error={errors.email?.message}>
            {(c) => <input className="input" type="email" {...c} {...register('email')} autoComplete="email" />}
          </Field>
        </div>
      </fieldset>

      <fieldset className="form__group">
        <legend>Tambahan</legend>
        <Field label="Minat tinggal di asrama" optional error={errors.boarding?.message}>
          {(c) => (
            <select className="input" {...c} {...register('boarding')}>
              <option value="">Belum menentukan</option>
              <option value="ya">Ya, berminat</option>
              <option value="tidak">Tidak</option>
            </select>
          )}
        </Field>
        <Field label="Pesan atau pertanyaan" optional error={errors.message?.message}>
          {(c) => <textarea className="input" rows={3} {...c} {...register('message')} />}
        </Field>
      </fieldset>

      <div className="visually-hidden" aria-hidden="true">
        <label>
          Jangan diisi
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      {mutation.isError && (
        <p className="form__error" role="alert">
          Formulir belum terkirim. Periksa koneksi internet lalu coba lagi, atau hubungi admin lewat WhatsApp.
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" icon={Send} disabled={mutation.isPending} block>
        {mutation.isPending ? 'Mengirim…' : 'Kirim pendaftaran'}
      </Button>
    </form>
  );
}
