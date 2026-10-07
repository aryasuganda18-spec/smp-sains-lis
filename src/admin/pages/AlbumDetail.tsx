import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ImagePlus, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/app/routes';
import { AsyncView, EmptyBlock } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { NotFound } from '@/pages/NotFound';
import { useDocumentMeta } from '@/lib/hooks';
import { validateImageFile } from '@/lib/image';
import { isUuid } from '@/lib/slug';
import type { Album, GalleryPhoto } from '@/lib/supabase/types';
import {
  addPhoto,
  deleteAlbum,
  deletePhoto,
  getAlbum,
  listPhotos,
  setAlbumCover,
  updateAlbum,
  updatePhotoCaption,
} from '../api';
import { uploadImage } from '../storage';
import { useToast } from '../toastContext';
import { useAdminMutation } from '../useAdminMutation';
import { useConfirm } from '../useConfirm';
import { AlbumForm } from './AlbumForm';

interface UploadProgress {
  done: number;
  total: number;
}

function AlbumEditor({ album, photos }: { album: Album; photos: GalleryPhoto[] }) {
  const navigate = useNavigate();
  const notify = useToast();
  const { confirm, dialog } = useConfirm();
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const update = useAdminMutation({
    mutationFn: (values: { title: string; description: string }) => updateAlbum(album.id, values),
    success: 'Album diperbarui',
  });
  const removeAlbum = useAdminMutation({
    mutationFn: () => deleteAlbum(album.id),
    success: 'Album dihapus',
    onSuccess: () => void navigate(ADMIN_ROUTES.albums),
  });
  const setCover = useAdminMutation({
    mutationFn: (photo: GalleryPhoto) => setAlbumCover(album.id, photo),
    success: 'Sampul album diganti',
  });
  const removePhoto = useAdminMutation({
    mutationFn: (photo: GalleryPhoto) => deletePhoto(photo, album),
    success: 'Foto dihapus',
  });
  const saveCaption = useAdminMutation({
    mutationFn: ({ photo, caption }: { photo: GalleryPhoto; caption: string }) => updatePhotoCaption(photo.id, caption),
  });

  const upload = useAdminMutation({
    mutationFn: async (files: File[]) => {
      let failed = 0;
      let firstUploaded: GalleryPhoto | null = null;
      setProgress({ done: 0, total: files.length });
      for (const [index, file] of files.entries()) {
        try {
          const problem = validateImageFile(file);
          if (problem) throw new Error(problem);
          const photo = await addPhoto(album.id, await uploadImage(file, 'albums'));
          firstUploaded ??= photo;
        } catch {
          failed += 1;
        }
        setProgress({ done: index + 1, total: files.length });
      }
      if (firstUploaded && !album.cover_image_path) await setAlbumCover(album.id, firstUploaded);
      setProgress(null);
      if (failed > 0) notify(`${failed} foto gagal diunggah (format harus JPG/PNG/WebP, maksimal 15 MB).`, 'error');
      return files.length - failed;
    },
    onSuccess: (uploaded) => {
      if (uploaded > 0) notify(`${uploaded} foto diunggah`);
    },
  });

  const onDeleteAlbum = async () => {
    const ok = await confirm({
      title: 'Hapus album?',
      message: `Album "${album.title}" dan ${photos.length} fotonya akan dihapus permanen.`,
    });
    if (ok) removeAlbum.mutate();
  };

  const onDeletePhoto = async (photo: GalleryPhoto) => {
    const ok = await confirm({ title: 'Hapus foto?', message: 'Foto ini akan dihapus permanen.' });
    if (ok) removePhoto.mutate(photo);
  };

  return (
    <>
      <section className="panel" aria-labelledby="album-detail-title">
        <h2 id="album-detail-title" className="panel__title">
          Detail album
        </h2>
        <AlbumForm
          defaults={{ title: album.title, description: album.description }}
          submitLabel="Simpan perubahan"
          busy={update.isPending}
          onSubmit={(values) => update.mutate(values)}
        />
      </section>

      <section className="panel" aria-labelledby="photos-title">
        <div className="admin__head">
          <h2 id="photos-title" className="panel__title">
            Foto ({photos.length})
          </h2>
          <label className="button button--primary button--md" aria-disabled={upload.isPending}>
            <ImagePlus size={18} aria-hidden="true" />
            {progress ? `Mengunggah ${progress.done}/${progress.total}…` : 'Unggah foto'}
            <input
              className="visually-hidden"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              disabled={upload.isPending}
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                event.target.value = '';
                if (files.length > 0) upload.mutate(files);
              }}
            />
          </label>
        </div>
        {photos.length === 0 ? (
          <EmptyBlock title="Album ini belum berisi foto" />
        ) : (
          <ul className="admin-photos">
            {photos.map((photo) => {
              const isCover = album.cover_image_path === photo.file_path;
              return (
                <li key={photo.id} className="admin-photo">
                  <img src={photo.file_url} alt={photo.caption || 'Foto album'} loading="lazy" width={320} height={240} />
                  <label className="visually-hidden" htmlFor={`caption-${photo.id}`}>
                    Keterangan foto
                  </label>
                  <input
                    id={`caption-${photo.id}`}
                    className="input"
                    placeholder="Keterangan (opsional)"
                    maxLength={150}
                    defaultValue={photo.caption}
                    onBlur={(event) => {
                      const caption = event.target.value.trim();
                      if (caption !== photo.caption) saveCaption.mutate({ photo, caption });
                    }}
                  />
                  <div className="admin-photo__actions">
                    <Button size="sm" variant={isCover ? 'gold' : 'outline'} icon={Star} disabled={isCover} onClick={() => setCover.mutate(photo)}>
                      {isCover ? 'Sampul' : 'Jadikan sampul'}
                    </Button>
                    <button type="button" className="icon-button icon-button--light" aria-label="Hapus foto" onClick={() => void onDeletePhoto(photo)}>
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="panel panel--danger">
        <h2 className="panel__title">Hapus album</h2>
        <p>Album beserta seluruh fotonya akan terhapus permanen.</p>
        <Button variant="danger" icon={Trash2} onClick={() => void onDeleteAlbum()}>
          Hapus album
        </Button>
      </section>
      {dialog}
    </>
  );
}

export function AlbumDetail() {
  const { albumId = '' } = useParams();
  useDocumentMeta('Ubah album');
  const valid = isUuid(albumId);
  const albumQuery = useQuery({ queryKey: ['admin', 'album', albumId], queryFn: () => getAlbum(albumId), enabled: valid });
  const photosQuery = useQuery({ queryKey: ['admin', 'photos', albumId], queryFn: () => listPhotos(albumId), enabled: valid });

  if (!valid) return <NotFound />;

  return (
    <>
      <Link to={ADMIN_ROUTES.albums} className="link-arrow link-arrow--back">
        <ArrowLeft size={18} aria-hidden="true" /> Semua album
      </Link>
      <AsyncView query={albumQuery}>
        {(album) =>
          album === null ? (
            <NotFound />
          ) : (
            <>
              <h1 className="admin__title">{album.title}</h1>
              <AsyncView query={photosQuery}>{(photos) => <AlbumEditor album={album} photos={photos} />}</AsyncView>
            </>
          )
        }
      </AsyncView>
    </>
  );
}
