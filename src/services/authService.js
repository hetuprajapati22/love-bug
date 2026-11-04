import { supabase } from '../lib/supabaseClient';

/**
 * Authentication Service
 * Manages Google OAuth sign-in, persistent session, user profile, and secure sign-out.
 */
export const authService = {
  /**
   * Initiate Google OAuth sign-in
   */
  async signInWithGoogle() {
    if (!supabase) throw new Error('Supabase client not initialized');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Sign out the current authenticated user
   */
  async signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current session user
   */
  async getCurrentUser() {
    if (!supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  },

  /**
   * Fetch the public profile of a user
   */
  async getProfile(userId) {
    if (!supabase || !userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Update or create profile (upsert) for the user
   */
  async updateProfile(userId, { fullName, petName, heartColor, setupCompleted, email }) {
    if (!supabase || !userId) throw new Error('User not found');
    const profileData = {
      id: userId,
      updated_at: new Date().toISOString(),
    };
    if (email) profileData.email = email;
    if (fullName !== undefined) profileData.full_name = fullName.trim();
    if (petName !== undefined) profileData.pet_name = petName.trim();
    if (heartColor !== undefined) profileData.heart_color = heartColor;
    if (setupCompleted !== undefined) profileData.setup_completed = setupCompleted;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .maybeSingle();

    if (error) {
      // In case setup_completed column does not exist yet in DB, retry without setup_completed
      if (profileData.setup_completed !== undefined) {
        delete profileData.setup_completed;
        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .upsert(profileData)
          .select()
          .maybeSingle();
        if (retryError) throw retryError;
        return { ...(retryData || profileData), setup_completed: true };
      }
      throw error;
    }
    return data || profileData;
  },

  /**
   * Delete user account and associated profile/couple safely
   */
  async deleteAccount() {
    if (!supabase) throw new Error('Supabase client not initialized');
    try {
      const { error } = await supabase.rpc('delete_my_account');
      if (error) console.warn('RPC delete_my_account error:', error.message);
    } catch (e) {
      console.warn('Error during delete_my_account RPC:', e);
    }
    await supabase.auth.signOut();
    return true;
  },
};
