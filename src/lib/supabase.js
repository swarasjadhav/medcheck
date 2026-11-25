// One shared Supabase client for the whole app.
// It is null when the Supabase settings are missing, so every caller checks
// `accountsEnabled` (or `supabase`) before using it.
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../config.js";

export const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          persistSession: true, // stay signed in after closing the app
          autoRefreshToken: true,
          detectSessionInUrl: true, // finishes email confirmation and password-reset links
        },
      })
    : null;

export const accountsEnabled = Boolean(supabase);
