import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';

const albumSchema = z.object({
  title: z.string().trim().min(2, 'Judul minimal 2 karakter').max(100, 'Maksimal 100 karakter'),
  description: z.string().trim().max(300, 'Maksimal 300 karakter'),
});
export type AlbumValues = z.infer<typeof albumSchema>;

export function AlbumForm({
  defaults,
  submitLabel,
  busy,
  onSubmit,
}: {
  defaults: AlbumValues;
  submitLabel: string;
  busy: boolean;
  onSubmit: (values: AlbumValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlbumValues>({ resolver: zodResolver(albumSchema), defaultValues: defaults });

  return (
    <form className="form" onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
      <Field label="Judul album" required error={errors.title?.message}>
        {(c) => <input className="input" {...c} {...register('title')} />}
      </Field>
      <Field label="Deskripsi" optional error={errors.description?.message}>
        {(c) => <textarea className="input" rows={2} {...c} {...register('description')} />}
      </Field>
      <Button type="submit" disabled={busy}>
        {busy ? 'Menyimpan…' : submitLabel}
      </Button>
    </form>
  );
}
