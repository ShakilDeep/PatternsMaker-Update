import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it, vi} from 'vitest';
import SourceDropzone from './SourceDropzone';

afterEach(() => cleanup());

describe('SourceDropzone browse control', () => {
  it('exposes a Browse files button that opens the hidden file input', () => {
    const upload = vi.fn();
    render(<SourceDropzone upload={upload} busy={false} documents={[]} replaceSource={false} setReplaceSource={vi.fn()} />);
    const input = screen.getByLabelText('Upload source file') as HTMLInputElement;
    const click = vi.spyOn(input, 'click');
    fireEvent.click(screen.getByRole('button', {name: 'Browse files'}));
    expect(click).toHaveBeenCalled();
  });

  it('uploads the chosen file through the hidden input', () => {
    const upload = vi.fn();
    render(<SourceDropzone upload={upload} busy={false} documents={[]} replaceSource={false} setReplaceSource={vi.fn()} />);
    const file = new File(['xlsx'], 'Book.xlsx', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    fireEvent.change(screen.getByLabelText('Upload source file'), {target: {files: [file]}});
    expect(upload).toHaveBeenCalledWith(file, false);
  });
});
