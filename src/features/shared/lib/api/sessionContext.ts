import { supabase } from '../supabase';
import { readSessionContext } from '../sessionContext';

/**
 * Bind current caller identity into DB session context for SECURITY DEFINER RPC.
 * This is a safe no-op when backend already reads identity from custom headers.
 */
export async function ensureSessionContext(callerId: string, callerRole: string): Promise<void> {
  const { error } = await supabase.rpc('set_session_context', {
    p_user_id: callerId,
    p_role: callerRole,
  });

  if (error) throw error;
}

export async function ensureStoredSessionContext(): Promise<void> {
  const session = readSessionContext();
  if (!session) {
    return;
  }

  const { error } = await supabase.rpc('set_session_context', {
    p_user_id: session.user_id,
    p_role: session.role,
    p_satuan_id: session.satuan_id ?? null,
    p_kompi_id: session.kompi_id ?? null,
    p_peleton_id: session.peleton_id ?? null,
  });

  if (error) throw error;
}
