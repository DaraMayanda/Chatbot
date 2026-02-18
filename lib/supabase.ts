import { createClient } from '@supabase/supabase-js';

// --- JALAN PINTAS (HARDCODE) ---
// Kita masukkan langsung URL dan Key-nya di sini biar pasti kebaca.
const supabaseUrl = 'https://ctpagkglucliakgfgbdw.supabase.co';
const supabaseKey = 'sb_publishable__eiafzHYR6DvtXMJvbViuA_idnES4vS';

export const supabase = createClient(supabaseUrl, supabaseKey);