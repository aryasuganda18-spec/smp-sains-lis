import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAlbumPath } from '@/app/routes';
import { AsyncView, EmptyBlock } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { useDocumentMeta } from '@/lib/hooks';
import { createAlbum, listAlbums } from '../api';
import { useAdminMutation } from '../useAdminMutation';
import { AlbumForm } from './AlbumForm';

export function Albums() {
  useDocumentMeta('Galeri admin');
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const query = useQuery({ queryKey: ['admin', 'albums'], queryFn: listAlbums });
  const create = useAdminMutation({
    mutationFn: createAlbum,
    success: 'Album dibuat. Sekarang unggah fotonya.',
    onSuccess: (album) => void navigate(adminAlbumPath(album.id)),
  });

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Galeri</h1>
        <Button icon={Plus} onClick={() => setCreating(true)}>
          Album baru
        </Button>
      </div>
      <AsyncView
        query={query}
        isEmpty={(rows) => rows.length === 0}
        empty={<EmptyBlock title="Belum ada album" text="Buat album untuk mengelompokkan foto kegiatan." />}
      >
        {(albums) => (
          <ul className="card-grid card-grid--3">
            {albums.map((album) => (
              <li key={album.id} className="album-card">
                <Link to={adminAlbumPath(album.id)}>
                  {album.cover_image_url ? (
                    <img src={album.cover_image_url} alt="" width={400} height={300} loading="lazy" />
                  ) : (
                    <div className="album-card__placeholder" aria-hidden="true" />
                  )}
                  <span className="album-card__title">{album.title}</span>
                  {album.description && <span className="album-card__text">{album.description}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AsyncView>
      <ModalDialog open={creating} onClose={() => setCreating(false)} label="Album baru" className="modal">
        <div className="modal__body">
          <h2 className="modal__title">Album baru</h2>
          <AlbumForm
            defaults={{ title: '', description: '' }}
            submitLabel="Buat album"
            busy={create.isPending}
            onSubmit={(values) => create.mutate(values)}
          />
        </div>
      </ModalDialog>
    </>
  );
}
