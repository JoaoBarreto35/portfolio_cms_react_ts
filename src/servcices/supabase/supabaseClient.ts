import { createClient } from "@supabase/supabase-js";

function getRequiredEnv(key: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

const supabaseUrl = getRequiredEnv("VITE_SUPABASE_URL");
const supabaseAnonKey = getRequiredEnv("VITE_SUPABASE_ANON_KEY");
