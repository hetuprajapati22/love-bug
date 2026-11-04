import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://doxmngpihljsxkbjhwid.supabase.co',
  'sb_publishable_tz-oYdhmioXZSrDSeuXQHA_OW1avxg1'
);

// Try to see what the RPC returns for a dummy call — we just want the error message shape
// which reveals the function signature
const { data, error } = await sb.rpc('submit_level_answer', {
  p_session_id: '00000000-0000-0000-0000-000000000000',
  p_level_number: 1,
  p_answer: { choice: 'A', text: 'test' },
});

console.log('data:', JSON.stringify(data, null, 2));
console.log('error:', JSON.stringify(error, null, 2));
