import type { KaryoSession } from '@/types';

const SESSION_CONTEXT_KEY = 'karyo_session_context';

export function writeSessionContext(session: KaryoSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_CONTEXT_KEY, JSON.stringify(session));
}

export function readSessionContext(): KaryoSession | null {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(SESSION_CONTEXT_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<KaryoSession>;
    if (!parsed.user_id || !parsed.role || !parsed.expires_at) return null;

    const session: KaryoSession = {
      ...parsed,
      satuan_id: parsed.satuan_id ?? null,
      kompi_id: parsed.kompi_id ?? null,
      peleton_id: parsed.peleton_id ?? null,
      expires_at: parsed.expires_at,
      user_id: parsed.user_id,
      role: parsed.role,
    };

    if (new Date(session.expires_at) < new Date()) {
      clearSessionContext();
      return null;
    }

    return session;
  } catch {
    clearSessionContext();
    return null;
  }
}

export function clearSessionContext(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_CONTEXT_KEY);
}