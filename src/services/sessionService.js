import { supabase } from '../lib/supabaseClient';

/**
 * Session Service
 * Handles real-time multiplayer sessions, lobby readiness, and answer locking.
 * All logic runs via secure server-side RPC functions.
 */
export const sessionService = {
  /**
   * Join existing waiting/active lobby or create a new one
   */
  async joinOrCreateLobby(gameType) {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.rpc('join_or_create_lobby', {
      p_game_type: gameType,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Leave lobby or unmark readiness
   */
  async leaveLobby(sessionId) {
    if (!supabase || !sessionId) return;
    const { data, error } = await supabase.rpc('leave_lobby', {
      p_session_id: sessionId,
    });
    if (error) console.error('Error leaving lobby:', error.message);
    return data;
  },

  /**
   * Reset session to Level 1 waiting state so couple can start fresh together
   */
  async resetSession(sessionId) {
    if (!supabase || !sessionId) return;
    const { data, error } = await supabase
      .from('game_sessions')
      .update({
        status: 'waiting',
        partner_1_ready: true,
        partner_2_ready: false,
        current_level: 1,
        current_stage: 1,
      })
      .eq('id', sessionId)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error resetting session:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Fetch current session data
   */
  async getSession(sessionId) {
    if (!supabase || !sessionId) return null;
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching session:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Submit locked answer for current level
   */
  async submitAnswer(sessionId, levelNumber, answer) {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.rpc('submit_level_answer', {
      p_session_id: sessionId,
      p_level_number: levelNumber,
      p_answer: answer,
    });
    if (error) throw error;
    return { ...data, current_level: levelNumber };
  },

  /**
   * Check if both partners have answered (read-only — never overwrites answers)
   */
  async checkRevealStatus(sessionId, levelNumber) {
    if (!supabase || !sessionId) return null;
    try {
      // Read answers directly — RLS allows reading both answers once count >= 2
      const { data: answers, error } = await supabase
        .from('session_answers')
        .select('user_id, answer')
        .eq('session_id', sessionId)
        .eq('level_number', levelNumber);

      if (error || !answers) return null;

      const bothAnswered = answers.length >= 2;
      if (!bothAnswered) return { both_answered: false };

      return {
        both_answered: true,
        answers, // array of { user_id, answer }
      };
    } catch {
      return null;
    }
  },

  /**
   * Advance question index after both answers are submitted
   * Gracefully handles race conditions if partner already advanced
   */
  async advanceLevel(sessionId) {
    if (!supabase) throw new Error('Supabase client not initialized');
    try {
      const { data, error } = await supabase.rpc('advance_session_level', {
        p_session_id: sessionId,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      // If error occurred (e.g. partner already advanced level in DB),
      // fetch latest session and return its actual level
      const sess = await this.getSession(sessionId);
      if (sess) {
        return {
          current_level: sess.current_level,
          current_stage: sess.current_stage,
          status: sess.status,
          already_advanced: true,
        };
      }
      throw err;
    }
  },

  /**
   * Fetch answers for current level (RLS automatically hides partner's answer until both submitted)
   */
  async getLevelAnswers(sessionId, levelNumber) {
    if (!supabase || !sessionId) return [];
    const { data, error } = await supabase
      .from('session_answers')
      .select('*')
      .eq('session_id', sessionId)
      .eq('level_number', levelNumber);

    if (error) {
      console.error('Error fetching level answers:', error.message);
      return [];
    }
    return data || [];
  },
};
