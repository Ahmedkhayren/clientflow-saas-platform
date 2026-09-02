import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export const isSupabaseConfigured = Boolean(url && key);
export function createClient() {
  if (!url || !key) throw new Error("Supabase is not configured");
  if (!browserClient) browserClient = createBrowserClient(url, key);
  return browserClient;
}
