import { createClient } from '@supabase/supabase-js';

// Use service_role key to create the function
const sb = createClient(
  'https://doxmngpihljsxkbjhwid.supabase.co',
  'sb_publishable_tz-oYdhmioXZSrDSeuXQHA_OW1avxg1'
);

// We need to run the SQL via the Supabase Dashboard or supabase CLI.
// Let's try rpc approach to check if function already exists
const { data, error } = await sb.rpc('check_reveal_status', {
  p_session_id: '00000000-0000-0000-0000-000000000000',
  p_level_number: 1,
});

console.log('data:', JSON.stringify(data, null, 2));
console.log('error:', JSON.stringify(error, null, 2));
