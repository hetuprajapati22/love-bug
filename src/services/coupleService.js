import { supabase } from '../lib/supabaseClient';

/**
 * Couple Service
 * Handles invitation generation, partner joining, active couple data, and unlinking.
 * All logic runs via secure Supabase RPC functions with full server-side validation.
 */
export const coupleService = {
  /**
   * Generate a unique expiring invite code (e.g. LB-7K3Q)
   */
  async createInviteCode() {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.rpc('create_invite_code');
    if (error) throw error;
    return data;
  },

  /**
   * Connect with a partner using their invite code
   */
  async joinWithInviteCode(inviteCode) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const cleanCode = inviteCode.trim().toUpperCase();
    const { data, error } = await supabase.rpc('join_with_invite_code', {
      p_invite_code: cleanCode,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Fetch active couple details and partner profile
   */
  async getMyCoupleData() {
    if (!supabase) return null;
    const { data, error } = await supabase.rpc('get_my_couple_data');
    if (error) {
      console.error('Error fetching couple data:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Safely unlink from current couple
   */
  async leaveCouple() {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.rpc('leave_couple');
    if (error) throw error;
    return data;
  },
};
