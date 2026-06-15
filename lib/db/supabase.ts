import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

const localSupabaseUrl = "http://127.0.0.1:54321";

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? localSupabaseUrl;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseAnonKey) {
    throw new Error(
      "Configura NEXT_PUBLIC_SUPABASE_ANON_KEY dopo l'avvio di Supabase locale.",
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export type BeGearSupabaseClient = ReturnType<typeof createSupabaseBrowserClient>;
