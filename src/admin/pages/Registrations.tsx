import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Download, Eye, MessageCircle, Trash2 } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { AsyncView, EmptyBlock } from '@/components/ui/AsyncView';
import { Button } from '@/components/ui/Button';
import { ModalDialog } from '@/components/ui/ModalDialog';
import { SCHOOL } from '@/data/site';
import { toCsv, downloadCsv } from '@/lib/csv';
import { formatDateTime } from '@/lib/format';
import { useDocumentMeta } from '@/lib/hooks';
import { REGISTRATION_STATUSES, type Registration, type RegistrationStatus } from '@/lib/supabase/types';
import { toWhatsAppId, whatsAppLink } from '@/lib/whatsapp';
import {
  REGISTRATIONS_PAGE_SIZE,
  deleteRegistration,
  listAllRegistrations,
  listRegistrations,
  setRegistrationStatus,
} from '../api';
import { describeError } from '../errors';
import { useToast } from '../toastContext';
import { useAdminMutation } from '../useAdminMutation';
import { useConfirm } from '../useConfirm';

const STATUS_LABEL: Record<RegistrationStatus, string> = {
  baru: 'Baru',
  dihubungi: 'Sudah dihubungi',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
};

const CSV_HEADER = [
  'Tanggal', 'Status', 'Nama siswa', 'Jenis kelamin', 'Tempat lahir', 'Tanggal lahir', 'NISN', 'Asal sekolah',
  'Alamat', 'Nama orang tua', 'Pekerjaan', 'WhatsApp', 'Email', 'Minat asrama', 'Pesan',
];

const boardingLabel = (value: boolean | null) => (value === null ? 'Belum menentukan' : value ? 'Ya' : 'Tidak');

function toCsvRow(r: Registration): string[] {
  return [
    formatDateTime(r.created_at), r.status, r.student_name, r.student_gender ?? '', r.student_birthplace,
    r.student_birthdate ?? '', r.nisn, r.previous_school, r.student_address, r.parent_name, r.parent_job,
    r.whatsapp, r.email, boardingLabel(r.boarding_interest), r.message,
  ];
}

function RegistrationDetail({ row }: { row: Registration }) {
  const items: [string, string][] = [
    ['Masuk', formatDateTime(row.created_at)],
    ['Jenis kelamin', row.student_gender ?? '-'],
    ['Tempat, tanggal lahir', `${row.student_birthplace || '-'}, ${row.student_birthdate ?? '-'}`],
    ['NISN', row.nisn || '-'],
    ['Asal sekolah', row.previous_school || '-'],
    ['Alamat', row.student_address || '-'],
    ['Orang tua / wali', `${row.parent_name}${row.parent_job ? ` (${row.parent_job})` : ''}`],
    ['WhatsApp', row.whatsapp],
    ['Email', row.email || '-'],
    ['Minat asrama', boardingLabel(row.boarding_interest)],
    ['Pesan', row.message || '-'],
  ];
  return (
    <dl className="detail">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Registrations() {
  useDocumentMeta('Pendaftar PPDB');
  const notify = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState<Registration | null>(null);
  const [exporting, setExporting] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const filter = { search: deferredSearch, status };
  const { confirm, dialog } = useConfirm();

  const query = useQuery({
    queryKey: ['admin', 'registrations', filter, page],
    queryFn: () => listRegistrations(filter, page),
    placeholderData: keepPreviousData,
  });

  const changeStatus = useAdminMutation({
    mutationFn: ({ id, next }: { id: string; next: RegistrationStatus }) => setRegistrationStatus(id, next),
    success: 'Status diperbarui',
  });
  const remove = useAdminMutation({ mutationFn: deleteRegistration, success: 'Data pendaftar dihapus' });

  const onDelete = async (row: Registration) => {
    if (await confirm({ title: 'Hapus data pendaftar?', message: `Data ${row.student_name} akan dihapus permanen.` })) {
      remove.mutate(row.id);
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const rows = await listAllRegistrations(filter);
      downloadCsv(`pendaftar-ppdb-${new Date().toISOString().slice(0, 10)}.csv`, toCsv([CSV_HEADER, ...rows.map(toCsvRow)]));
    } catch (error) {
      notify(describeError(error), 'error');
    } finally {
      setExporting(false);
    }
  };

  const reset = (apply: () => void) => {
    apply();
    setPage(0);
  };

  return (
    <>
      <div className="admin__head">
        <h1 className="admin__title">Pendaftar PPDB</h1>
        <Button variant="outline" icon={Download} onClick={() => void exportCsv()} disabled={exporting}>
          {exporting ? 'Menyiapkan…' : 'Unduh CSV'}
        </Button>
      </div>
      <div className="toolbar">
        <div className="field">
          <label className="field__label" htmlFor="reg-search">
            Cari nama atau nomor
          </label>
          <input id="reg-search" className="input" type="search" value={search} onChange={(e) => reset(() => setSearch(e.target.value))} />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="reg-status">
            Status
          </label>
          <select id="reg-status" className="input" value={status} onChange={(e) => reset(() => setStatus(e.target.value))}>
            <option value="">Semua</option>
            {REGISTRATION_STATUSES.map((item) => (
              <option key={item} value={item}>
                {STATUS_LABEL[item]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AsyncView query={query} isEmpty={(data) => data.rows.length === 0} empty={<EmptyBlock title="Tidak ada pendaftar yang cocok" />}>
        {({ rows, total }) => {
          const pages = Math.max(1, Math.ceil(total / REGISTRATIONS_PAGE_SIZE));
          return (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Calon siswa</th>
                      <th scope="col">Orang tua</th>
                      <th scope="col">Masuk</th>
                      <th scope="col">Status</th>
                      <th scope="col">
                        <span className="visually-hidden">Aksi</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="table__title">{row.student_name}</td>
                        <td>
                          {row.parent_name}
                          <br />
                          <span className="muted">{row.whatsapp}</span>
                        </td>
                        <td>{formatDateTime(row.created_at)}</td>
                        <td>
                          <select
                            className="input input--compact"
                            aria-label={`Status ${row.student_name}`}
                            value={row.status}
                            onChange={(event) => changeStatus.mutate({ id: row.id, next: event.target.value as RegistrationStatus })}
                          >
                            {REGISTRATION_STATUSES.map((item) => (
                              <option key={item} value={item}>
                                {STATUS_LABEL[item]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="table__actions">
                          <button type="button" className="icon-button icon-button--light" aria-label={`Detail ${row.student_name}`} onClick={() => setDetail(row)}>
                            <Eye size={18} aria-hidden="true" />
                          </button>
                          <a
                            className="icon-button icon-button--light"
                            aria-label={`WhatsApp ${row.parent_name}`}
                            href={whatsAppLink(
                              toWhatsAppId(row.whatsapp),
                              `Assalamu'alaikum Bapak/Ibu ${row.parent_name}, kami dari ${SCHOOL.shortName} menindaklanjuti pendaftaran ${row.student_name}.`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle size={18} aria-hidden="true" />
                          </a>
                          <button type="button" className="icon-button icon-button--light" aria-label={`Hapus ${row.student_name}`} onClick={() => void onDelete(row)}>
                            <Trash2 size={18} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <nav className="pager" aria-label="Halaman">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  Sebelumnya
                </Button>
                <span>
                  Halaman {page + 1} dari {pages} · {total} pendaftar
                </span>
                <Button variant="outline" size="sm" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>
                  Berikutnya
                </Button>
              </nav>
            </>
          );
        }}
      </AsyncView>
      <ModalDialog open={detail !== null} onClose={() => setDetail(null)} label="Detail pendaftar" className="modal">
        {detail && (
          <div className="modal__body">
            <h2 className="modal__title">{detail.student_name}</h2>
            <RegistrationDetail row={detail} />
            <div className="modal__actions">
              <Button variant="outline" onClick={() => setDetail(null)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </ModalDialog>
      {dialog}
    </>
  );
}
