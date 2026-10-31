import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { authService } from '../services/authService';
import { coupleService } from '../services/coupleService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [couple, setCouple] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile and couple data
  const loadUserData = useCallback(async (currentUser) => {
    if (!currentUser) {
      setUser(null);
      setProfile(null);
      setCouple(null);
      setLoading(false);
      return;
    }

    try {
      setUser(currentUser);

      // Fetch profile
      let prof = await authService.getProfile(currentUser.id);
      // Fallback if trigger was delayed by milliseconds
      if (!prof) {
        prof = {
          id: currentUser.id,
          email: currentUser.email,
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Sweetheart',
          pet_name: currentUser.user_metadata?.full_name || 'Love Bug',
          heart_color: '#F8C9D8',
        };
      }
      setProfile(prof);

      // Fetch active couple data
      const coupleData = await coupleService.getMyCoupleData();
      setCouple(coupleData);
    } catch (err) {
      console.error('Failed to load user auth context:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen to Supabase Auth State Changes
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUserData(session?.user || null);
    });

    // Realtime auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          await loadUserData(session?.user || null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setCouple(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadUserData]);

  // Refresh profile & couple info on demand
  const refreshUserData = useCallback(async () => {
    if (user) {
      await loadUserData(user);
    }
  }, [user, loadUserData]);

  // Update profile helper
  const handleUpdateProfile = async (updates) => {
    if (!user) throw new Error('Not logged in');
    const updated = await authService.updateProfile(user.id, {
      ...updates,
      email: user.email,
    });
    setProfile(updated);
    return updated;
  };

  // Sign out helper
  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setCouple(null);
  };

  const isProfileComplete = Boolean(
    profile &&
    (
      profile.setup_completed === true ||
      (
        profile.pet_name &&
        profile.pet_name.trim().length > 0 &&
        profile.pet_name.trim() !== (profile.full_name || '').trim() &&
        profile.pet_name !== 'Love Bug' &&
        profile.pet_name !== 'Sweetheart'
      )
    )
  );

  const value = {
    user,
    profile,
    couple,
    loading,
    refreshUserData,
    updateProfile: handleUpdateProfile,
    signOut: handleSignOut,
    isProfileComplete,
    isCoupled: Boolean(couple && couple.couple_id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
