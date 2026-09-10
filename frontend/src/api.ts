export async function api<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
  const form = data instanceof FormData;
  const response = await fetch('/api/v1' + path, {
    method,
    headers: form ? undefined : {'Content-Type': 'application/json'},
    body: data === undefined ? undefined : form ? data : JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({message: 'The server could not complete this request.'}));
    throw new Error(error.message || 'Request failed');
  }
  return response.json() as Promise<T>;
}

export async function download(path: string, name: string) {
  const response = await fetch('/api/v1' + path);
  if (!response.ok) {
    const error = await response.json().catch(() => ({message: 'Download failed.'}));
    throw new Error(error.message || 'Download failed.');
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
