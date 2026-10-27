import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less anon client for public reads (RLS applies), so pages that use it
 * can stay cached. Returns null when Supabase isn't configured.
 */
export function createSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
