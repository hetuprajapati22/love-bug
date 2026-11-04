import { supabase } from '../lib/supabaseClient';

/**
 * Admin Service
 * Handles data fetching for Hetu's private admin panel.
 * Uses secure RPC function admin_get_overview() with fallback queries.
 */
export const adminService = {
  /**
   * Fetch complete admin overview (users, couples, sessions progress)
   */
  async getOverview() {
    if (!supabase) throw new Error('Supabase client not initialized');

    try {
      // 1. Try secure RPC function
      const { data, error } = await supabase.rpc('admin_get_overview');
      if (!error && data) {
        return data;
      }
    } catch (rpcErr) {
      console.warn('RPC admin_get_overview not available, falling back to direct queries:', rpcErr);
    }

    // 2. Fallback direct queries if RPC is not run yet
    try {
      const [profilesRes, couplesRes, sessionsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('couples').select('*'),
        supabase.from('game_sessions').select('*').order('created_at', { ascending: false }),
      ]);

      const profiles = profilesRes.data || [];
      const couples = couplesRes.data || [];
      const sessions = sessionsRes.data || [];

      // Map profiles for quick lookup
      const profileMap = {};
      profiles.forEach((p) => {
        profileMap[p.id] = p;
      });

      // Enrich couples with partner names
      const enrichedCouples = couples.map((c) => ({
        id: c.id,
        status: c.status,
        created_at: c.created_at,
        partner_1_name: profileMap[c.partner_1_id]?.full_name || 'Partner 1',
        partner_1_pet: profileMap[c.partner_1_id]?.pet_name || 'Pet 1',
        partner_2_name: profileMap[c.partner_2_id]?.full_name || 'Partner 2',
        partner_2_pet: profileMap[c.partner_2_id]?.pet_name || 'Pet 2',
      }));

      // Enrich sessions with pet names
      const enrichedSessions = sessions.map((s) => ({
        id: s.id,
        couple_id: s.couple_id,
        game_type: s.game_type,
        status: s.status,
        current_level: s.current_level,
        current_stage: s.current_stage,
        created_at: s.created_at,
        started_at: s.started_at,
        completed_at: s.completed_at,
        p1_pet: profileMap[s.partner_1_id]?.pet_name || 'Partner 1',
        p2_pet: profileMap[s.partner_2_id]?.pet_name || 'Partner 2',
      }));

      return {
        total_users: profiles.length,
        total_couples: couples.length,
        total_sessions: sessions.length,
        couples: enrichedCouples,
        sessions: enrichedSessions,
      };
    } catch (err) {
      console.error('Error in adminService.getOverview:', err);
      throw err;
    }
  },

  /**
   * Reset all test game sessions back to level 1 waiting
   */
  async resetAllSessions() {
    if (!supabase) return;
    const { error } = await supabase
      .from('game_sessions')
      .update({
        status: 'waiting',
        partner_1_ready: false,
        partner_2_ready: false,
        current_level: 1,
        current_stage: 1,
      })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) throw error;
    return true;
  },

  /**
   * Get past sessions history for current couple
   */
  async getMyHistory() {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.rpc('get_my_game_history');
      if (!error && data) return data;
    } catch (_) {}

    // Fallback: fetch from game_sessions directly
    const { data } = await supabase
      .from('game_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    return data || [];
  },
};
