import {afterEach, expect, it, vi} from 'vitest';
import {download} from './api';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('appends a temporary link so marker downloads trigger after fetch', async () => {
  const click = vi.fn();
  const remove = vi.fn();
  const appendChild = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => {
    Object.assign(node as HTMLAnchorElement, {click, remove});
    return node;
  });
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    blob: async () => new Blob(['<svg/>'], {type: 'image/svg+xml'}),
  })));
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:marker'),
    revokeObjectURL: vi.fn(),
  });

  await download('/projects/x/exports/marker-svg?size=L', '1078983_L_marker_demo.svg');

  expect(fetch).toHaveBeenCalledWith('/api/v1/projects/x/exports/marker-svg?size=L');
  expect(appendChild).toHaveBeenCalled();
  expect(click).toHaveBeenCalled();
  expect(remove).toHaveBeenCalled();
});
