import { createClient } from "@supabase/supabase-js";

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uwxqrdbkfctxutuigkqz.supabase.co";

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_aLZ8Ck7YvPakD-2Q7ZXgcQ_uNMl32qg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
