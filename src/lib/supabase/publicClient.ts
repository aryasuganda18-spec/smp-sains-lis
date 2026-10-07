import { PostgrestClient } from '@supabase/postgrest-js';
import type { Database } from './database.types';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './env';

export const publicDb = new PostgrestClient<Database>(`${SUPABASE_URL}/rest/v1`, {
  headers: {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
  },
});
