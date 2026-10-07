import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Redo2, Undo2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/Button';

const ALLOWED_LINK = /^(https?:\/\/|mailto:|tel:)/i;

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  label: string;
}

function ToolbarButton({ label, active, disabled, onClick, children }: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="rte__button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');

  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: false } })],
    content: value,
    injectCSS: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: { class: 'prose rte__content', role: 'textbox', 'aria-multiline': 'true', 'aria-label': label },
    },
    onUpdate: ({ editor: instance }) => onChange(instance.isEmpty ? '' : instance.getHTML()),
  });

  if (!editor) return <div className="rte rte--loading" />;

  const applyLink = () => {
    const href = linkUrl.trim();
    if (!ALLOWED_LINK.test(href)) {
      setLinkError('Tautan harus diawali https://, http://, mailto: atau tel:');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setLinkOpen(false);
  };

  const openLink = () => {
    setLinkUrl((editor.getAttributes('link') as { href?: string }).href ?? 'https://');
    setLinkError('');
    setLinkOpen(true);
  };

  const run = () => editor.chain().focus();

  return (
    <div className="rte">
      <div className="rte__toolbar" role="toolbar" aria-label="Format teks">
        <ToolbarButton label="Tebal" active={editor.isActive('bold')} onClick={() => run().toggleBold().run()}>
          <Bold size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Miring" active={editor.isActive('italic')} onClick={() => run().toggleItalic().run()}>
          <Italic size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Judul bagian" active={editor.isActive('heading', { level: 2 })} onClick={() => run().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Sub judul" active={editor.isActive('heading', { level: 3 })} onClick={() => run().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Daftar poin" active={editor.isActive('bulletList')} onClick={() => run().toggleBulletList().run()}>
          <List size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Daftar nomor" active={editor.isActive('orderedList')} onClick={() => run().toggleOrderedList().run()}>
          <ListOrdered size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Kutipan" active={editor.isActive('blockquote')} onClick={() => run().toggleBlockquote().run()}>
          <Quote size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Tautan" active={editor.isActive('link')} onClick={openLink}>
          <Link2 size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Urungkan" disabled={!editor.can().undo()} onClick={() => run().undo().run()}>
          <Undo2 size={18} aria-hidden="true" />
        </ToolbarButton>
        <ToolbarButton label="Ulangi" disabled={!editor.can().redo()} onClick={() => run().redo().run()}>
          <Redo2 size={18} aria-hidden="true" />
        </ToolbarButton>
      </div>
      {linkOpen && (
        <div className="rte__link">
          <label className="visually-hidden" htmlFor="rte-link-url">
            Alamat tautan
          </label>
          <input
            id="rte-link-url"
            className="input"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyLink();
              }
            }}
          />
          <Button size="sm" onClick={applyLink}>
            Terapkan
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              setLinkOpen(false);
            }}
          >
            Hapus tautan
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setLinkOpen(false)}>
            Batal
          </Button>
          {linkError && <p className="field__error">{linkError}</p>}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
