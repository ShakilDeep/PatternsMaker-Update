import {useRef} from 'react';
import {Upload} from 'lucide-react';

type Doc = {id: string; filename: string};
type Props = {
  upload: (file: File, replace?: boolean) => void;
  busy: boolean;
  documents: Doc[];
  replaceSource: boolean;
  setReplaceSource: (v: boolean) => void;
};

/**
 * Cross-browser dropzone.
 * Native file inputs ignore tiny width/height and stay visible as "Choose File".
 * Use a <label htmlFor> Browse control + off-screen input (never pointer-events:none).
 */
export default function SourceDropzone({upload, busy, documents, replaceSource, setReplaceSource}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    upload(file, replaceSource);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div
      className="dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        pick(e.dataTransfer.files);
      }}
    >
      <Upload />
      <strong>Drop your workbook or tech pack</strong>
      <span>XLSX or PDF · up to 10 MB</span>
      <label className="dropzone-replace">
        <input
          type="checkbox"
          checked={replaceSource}
          onChange={(e) => setReplaceSource(e.target.checked)}
        />
        Replace current source and retain its version
      </label>
      <input
        ref={inputRef}
        id="source-upload"
        className="sr-only"
        type="file"
        accept=".xlsx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        disabled={busy}
        onChange={(e) => pick(e.target.files)}
      />
      <label
        htmlFor="source-upload"
        className={`primary browse-files${busy ? ' is-disabled' : ''}`}
        aria-disabled={busy || undefined}
        onClick={(e) => {
          if (busy) e.preventDefault();
        }}
      >
        Browse files
      </label>
      {documents.map((d) => (
        <small key={d.id}>{d.filename}</small>
      ))}
    </div>
  );
}
