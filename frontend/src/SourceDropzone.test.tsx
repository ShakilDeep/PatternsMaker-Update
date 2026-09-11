import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import SourceDropzone from './SourceDropzone';

afterEach(() => cleanup());

describe('SourceDropzone browse control', () => {
  it('uses a Browse files label linked to the file input (no programmatic click)', () => {
    const upload = vi.fn();
    render(<SourceDropzone upload={upload} busy={false} documents={[]} replaceSource={false} setReplaceSource={vi.fn()} />);
    const input = screen.getByLabelText('Browse files') as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(input.id).toBe('source-upload');
    expect(input.className).toMatch(/sr-only/);
    const label = document.querySelector('label[for="source-upload"]');
    expect(label).not.toBeNull();
    expect(label?.textContent).toBe('Browse files');
    expect(label?.tagName).toBe('LABEL');
  });

  it('uploads the chosen file through the hidden input', () => {
    const upload = vi.fn();
    render(<SourceDropzone upload={upload} busy={false} documents={[]} replaceSource={false} setReplaceSource={vi.fn()} />);
    const file = new File(['xlsx'], 'Book.xlsx', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    fireEvent.change(screen.getByLabelText('Browse files'), {target: {files: [file]}});
    expect(upload).toHaveBeenCalledWith(file, false);
  });
});
