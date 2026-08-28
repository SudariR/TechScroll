const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function headers(adminKey: string) {
  return { 'Content-Type': 'application/json', 'x-admin-key': adminKey };
}

export interface AdminClip {
  id: string;
  title: string;
  hook: string;
  takeaway: string;
  category: string;
  scenes: unknown;
  published: boolean;
  featured: boolean;
  model: string | null;
  promptVersion: string | null;
  createdAt: string;
}

export async function generateClip(
  adminKey: string,
  body: { title: string; source: string; content: string; sourceUrl?: string },
): Promise<AdminClip> {
  const res = await fetch(`${BASE}/clips/generate`, {
    method: 'POST',
    headers: headers(adminKey),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listAllClips(adminKey: string): Promise<AdminClip[]> {
  const res = await fetch(`${BASE}/clips/all`, { headers: headers(adminKey) });
  if (!res.ok) throw new Error(`Failed to load clips (${res.status})`);
  return res.json();
}

export async function publishClip(adminKey: string, id: string): Promise<AdminClip> {
  const res = await fetch(`${BASE}/clips/${id}/publish`, {
    method: 'POST',
    headers: headers(adminKey),
  });
  if (!res.ok) throw new Error(`Failed to publish (${res.status})`);
  return res.json();
}

export async function toggleFeatured(adminKey: string, id: string): Promise<AdminClip> {
  const res = await fetch(`${BASE}/clips/${id}/feature`, {
    method: 'POST',
    headers: headers(adminKey),
  });
  if (!res.ok) throw new Error(`Failed to toggle featured (${res.status})`);
  return res.json();
}

export async function deleteClip(adminKey: string, id: string): Promise<void> {
  const res = await fetch(`${BASE}/clips/${id}`, {
    method: 'DELETE',
    headers: headers(adminKey),
  });
  if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
}