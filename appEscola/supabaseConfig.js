import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://ukrbivktdbxzucopondq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrcmJpdmt0ZGJ4enVjb3BvbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzcxMzcsImV4cCI6MjA3Nzg1MzEzN30.JR9ttXaoLcmBBwpLJTNAmX_Xc6xqnh7nBggEDZbSJ-Q";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        "Supabase URL ou chave não estão configuradas corretamente"
    );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);