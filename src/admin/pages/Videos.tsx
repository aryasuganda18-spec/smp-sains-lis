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
import type { Video } from '@/lib/supabase/types';
import { getYouTubeId, isHttpsUrl, youTubeThumbnailUrl } from '@/lib/youtube';
import { deleteVideo, listVideos, saveVideo, setVideoPublished } from '../api';
import { useAdminMutation } from '../useAdminMutation';
import { useConfirm } from '../useConfirm';

const videoSchema = z.object({
  title: z.string().trim().min(2, 'Judul minimal 2 karakter').max(150, 'Maksimal 150 karakter'),
  video_url: z.string().trim().max(500, 'Terlalu panjang').refine(isHttpsUrl, 'Masukkan tautan lengkap yang diawali https://'),
  description: z.string().trim().max(500, 'Maksimal 500 karakter'),
  published: z.boolean(),
});
type VideoFormValues = z.infer<typeof videoSchema>;

function VideoForm({ video, busy, onSubmit }: { video: Video | null; busy: boolean; onSubmit: (values: VideoFormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: video?.title ?? '',
      video_url: video?.video_url ?? '',
      description: video?.description ?? '',
      published: video?.published ?? true,
    },
  });

  return (
    <form className="form" onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
      <Field label="Judul" required error={errors.title?.message}>
        {(c) => <input className="input" {...c} {...register('title')} />}
      </Field>
      <Field label="Tautan video" required hint="Tautan YouTube akan diputar di situs" error={errors.video_url?.message}>
        {(c) => <input className="input" type="url" inputMode="url" {...c} {...register('video_url')} />}
      </Field>
      <Field label="Deskripsi" optional error={errors.description?.message}>
        {(c) => <textarea className="input" rows={2} {...c} {...register('description')} />}
      </Field>
      <label className="check">
        <input type="checkbox" {...register('published')} />
        Tampilkan di situs
      </label>
      <Button type="submit" disabled={busy}>
        {busy ? 'Menyimpan…' : 'Simpan video'}
      </Button>
    </form>
  );
}

export function Videos() {
  useDocumentMeta('Video admin');
  const [editing, setEditing] = useState<Video | 'new' | null>(null);
  const query = useQuery({ queryKey: ['admin', 'videos'], queryFn: listVideos });
  const { confirm, dialog } = useConfirm();

  const save = useAdminMutation({
    mutationFn: (values: VideoFormValues) => {
      const id = editing && editing !== 'new' ? editing.id : null;
      const youtubeId = getYouTubeId(values.video_url);
      return saveVideo(id, { ...values, thumbnail: youtubeId ? youTubeThumbnailUrl(youtubeId) : null });
    },
    success: 'Video disimpan',
    onSuccess: () => setEditing(null),
  });
  const togglePublished = useAdminMutation({
    mutationFn: (video: Video) => setVideoPublished(video.id, !video.published),
  });
  const remove = useAdminMutation({ mutationFn: deleteVideo, success: 'Video dihapus' });

  const onDelete = async (video: Video) => {
    if (await confirm({ title: 'Hapus video?', message: `"${video.title}" akan dihapus permanen.` })) remove.mutate(video.id);
  };

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Video</h1>
        <Button icon={Plus} onClick={() => setEditing('new')}>
          Tambah video
        </Button>
      </div>
      <AsyncView query={query} isEmpty={(rows) => rows.length === 0} empty={<EmptyBlock title="Belum ada video" />}>
        {(videos) => (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Judul</th>
                  <th scope="col">Ditambahkan</th>
                  <th scope="col">Tampil</th>
                  <th scope="col">
                    <span className="visually-hidden">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id}>
                    <td>
                      <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="table__title">
                        {video.title}
                      </a>
                    </td>
                    <td>{formatDate(video.created_at)}</td>
                    <td>
                      <label className="check">
                        <input type="checkbox" checked={video.published} onChange={() => togglePublished.mutate(video)} />
                        <span className="visually-hidden">Tampilkan {video.title}</span>
                      </label>
                    </td>
                    <td className="table__actions">
                      <button type="button" className="icon-button icon-button--light" aria-label={`Ubah ${video.title}`} onClick={() => setEditing(video)}>
                        <Pencil size={18} aria-hidden="true" />
                      </button>
                      <button type="button" className="icon-button icon-button--light" aria-label={`Hapus ${video.title}`} onClick={() => void onDelete(video)}>
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
      <ModalDialog open={editing !== null} onClose={() => setEditing(null)} label="Formulir video" className="modal">
        <div className="modal__body">
          <h2 className="modal__title">{editing === 'new' ? 'Tambah video' : 'Ubah video'}</h2>
          <VideoForm video={editing === 'new' ? null : editing} busy={save.isPending} onSubmit={(values) => save.mutate(values)} />
        </div>
      </ModalDialog>
      {dialog}
    </>
  );
}
