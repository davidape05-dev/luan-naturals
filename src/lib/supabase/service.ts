// Service-role client — server-only, never import this in client
// components. Bypasses RLS, so every use of this must validate what
// it's doing itself (e.g. confirming an order/phone match before
// inserting a review).
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}