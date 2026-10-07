import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AsyncView, EmptyBlock } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { formatDate } from '@/lib/format';
import { useDocumentMeta } from '@/lib/hooks';
import type { Announcement } from '@/lib/supabase/types';
import { deleteAnnouncement, listAnnouncements, saveAnnouncement, setAnnouncementPublished } from '../api';
import { useAdminMutation } from '../useAdminMutation';
import { useConfirm } from '../useConfirm';

const announcementSchema = z.object({
  title: z.string().trim().min(2, 'Judul minimal 2 karakter').max(150, 'Maksimal 150 karakter'),
  content: z.string().trim().min(2, 'Isi pengumuman wajib diisi').max(3000, 'Maksimal 3000 karakter'),
  published: z.boolean(),
});
type AnnouncementFormValues = z.infer<typeof announcementSchema>;

function AnnouncementForm({
  item,
  busy,
  onSubmit,
}: {
  item: Announcement | null;
  busy: boolean;
  onSubmit: (values: AnnouncementFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: item?.title ?? '', content: item?.content ?? '', published: item?.published ?? true },
  });

  return (
    <form className="form" onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
      <Field label="Judul" required error={errors.title?.message}>
        {(c) => <input className="input" {...c} {...register('title')} />}
      </Field>
      <Field label="Isi pengumuman" required error={errors.content?.message}>
        {(c) => <textarea className="input" rows={6} {...c} {...register('content')} />}
      </Field>
      <label className="check">
        <input type="checkbox" {...register('published')} />
        Tampilkan di situs
      </label>
      <Button type="submit" disabled={busy}>
        {busy ? 'Menyimpan…' : 'Simpan pengumuman'}
      </Button>
    </form>
  );
}

export function Announcements() {
  useDocumentMeta('Pengumuman admin');
  const [editing, setEditing] = useState<Announcement | 'new' | null>(null);
  const query = useQuery({ queryKey: ['admin', 'announcements'], queryFn: listAnnouncements });
  const { confirm, dialog } = useConfirm();

  const save = useAdminMutation({
    mutationFn: (values: AnnouncementFormValues) =>
      saveAnnouncement(editing && editing !== 'new' ? editing.id : null, values),
    success: 'Pengumuman disimpan',
    onSuccess: () => setEditing(null),
  });
  const togglePublished = useAdminMutation({
    mutationFn: (item: Announcement) => setAnnouncementPublished(item.id, !item.published),
  });
  const remove = useAdminMutation({ mutationFn: deleteAnnouncement, success: 'Pengumuman dihapus' });

  const onDelete = async (item: Announcement) => {
    if (await confirm({ title: 'Hapus pengumuman?', message: `"${item.title}" akan dihapus permanen.` })) remove.mutate(item.id);
  };

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Pengumuman</h1>
        <Button icon={Plus} onClick={() => setEditing('new')}>
          Buat pengumuman
        </Button>
      </div>
      <AsyncView query={query} isEmpty={(rows) => rows.length === 0} empty={<EmptyBlock title="Belum ada pengumuman" />}>
        {(items) => (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Judul</th>
                  <th scope="col">Dibuat</th>
                  <th scope="col">Tampil</th>
                  <th scope="col">
                    <span className="visually-hidden">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="table__title">{item.title}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>
                      <label className="check">
                        <input type="checkbox" checked={item.published} onChange={() => togglePublished.mutate(item)} />
                        <span className="visually-hidden">Tampilkan {item.title}</span>
                      </label>
                    </td>
                    <td className="table__actions">
                      <button type="button" className="icon-button icon-button--light" aria-label={`Ubah ${item.title}`} onClick={() => setEditing(item)}>
                        <Pencil size={18} aria-hidden="true" />
                      </button>
                      <button type="button" className="icon-button icon-button--light" aria-label={`Hapus ${item.title}`} onClick={() => void onDelete(item)}>
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AsyncView>
      <ModalDialog open={editing !== null} onClose={() => setEditing(null)} label="Formulir pengumuman" className="modal">
        <div className="modal__body">
          <h2 className="modal__title">{editing === 'new' ? 'Buat pengumuman' : 'Ubah pengumuman'}</h2>
          <AnnouncementForm item={editing === 'new' ? null : editing} busy={save.isPending} onSubmit={(values) => save.mutate(values)} />
        </div>
      </ModalDialog>
      {dialog}
    </>
  );
}
