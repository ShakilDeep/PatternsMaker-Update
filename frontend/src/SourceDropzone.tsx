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

/** Cross-browser dropzone: hide native file UI; Browse opens the picker in all browsers. */
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
        className="sr-only file-picker"
        aria-label="Upload source file"
        type="file"
        accept=".xlsx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        disabled={busy}
        onChange={(e) => pick(e.target.files)}
      />
      <button
        type="button"
        className="primary"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        Browse files
      </button>
      {documents.map((d) => (
        <small key={d.id}>{d.filename}</small>
      ))}
    </div>
  );
}
