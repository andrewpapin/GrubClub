import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hooadhlgxaivkgvqptcu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mbD4oZ--UcHch6Khs5uKEw_3IIQUohg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
