// Tracks who is signed in. Works with no Supabase settings too (always signed out).
import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(!supabase);
  // True after someone opens a password-reset link, until they set a new password.
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });

    // Don't call other Supabase functions inside this callback; just record the change.
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setReady(true);
      if (event === "PASSWORD_RECOVERY") setRecovering(true);
      if (event === "SIGNED_OUT") setRecovering(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session ? session.user : null,
    ready,
    recovering,
    finishRecovery: () => setRecovering(false),
  };
}
