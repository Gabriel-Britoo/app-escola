import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://qdgmdforfavbwupnzeub.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ21kZm9yZmF2Ynd1cG56ZXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzU4MjMsImV4cCI6MjA3NzgxMTgyM30.oGHmudNL7Hbfy8baq4V8UiN1x1UuRmPWESTj0j7KPiw";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        "Supabase URL ou chave não estão configuradas corretamente"
    );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);