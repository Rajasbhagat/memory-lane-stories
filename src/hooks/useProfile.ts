import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  display_name: string;
  total_sessions: number;
  total_mistakes_spotted: number;
  total_hints_used: number;
  best_star_rating: number;
  scenarios_completed: number;
}

const PROFILE_ID_KEY = "mindset-profile-id";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const storedId = localStorage.getItem(PROFILE_ID_KEY);

      if (storedId) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", storedId)
          .maybeSingle();

        if (data) {
          setProfile(data as Profile);
          setLoading(false);
          return;
        }
      }

      // No stored profile or not found in DB — create one
      const name = localStorage.getItem("mindset-name")?.trim() || "Detective";
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({ display_name: name })
        .select()
        .single();

      if (newProfile) {
        localStorage.setItem(PROFILE_ID_KEY, newProfile.id);
        setProfile(newProfile as Profile);
      }
      setLoading(false);
    };

    init();
  }, []);

  const updateProfile = useCallback(
    async (stats: {
      mistakesSpotted: number;
      hintsUsed: number;
      scenariosCompleted: number;
      stars: number;
    }) => {
      if (!profile) return;

      const updated = {
        total_sessions: profile.total_sessions + 1,
        total_mistakes_spotted: profile.total_mistakes_spotted + stats.mistakesSpotted,
        total_hints_used: profile.total_hints_used + stats.hintsUsed,
        scenarios_completed: profile.scenarios_completed + stats.scenariosCompleted,
        best_star_rating: Math.max(profile.best_star_rating, stats.stars),
        updated_at: new Date().toISOString(),
      };

      const { data } = await supabase
        .from("profiles")
        .update(updated)
        .eq("id", profile.id)
        .select()
        .single();

      if (data) setProfile(data as Profile);
    },
    [profile]
  );

  const updateName = useCallback(
    async (name: string) => {
      if (!profile) return;
      await supabase
        .from("profiles")
        .update({ display_name: name, updated_at: new Date().toISOString() })
        .eq("id", profile.id);
      setProfile((p) => (p ? { ...p, display_name: name } : p));
    },
    [profile]
  );

  return { profile, loading, updateProfile, updateName };
}
