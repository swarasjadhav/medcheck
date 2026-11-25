// Saved claims.
//
// Saves always go on the device first, so saving works with no account and offline.
// When someone is signed in, saves also go to the `saved_claims` table in Supabase,
// so they show up on every device. Signing in adds this device's saves to the account.
// Signing out clears this device's copy, so the next person on a shared device
// doesn't see them.
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase.js";

const STORAGE_KEY = "medcheck.saved.v1";
const SYNC_ERROR = "Couldn't update your saved claims. Check your connection and try again.";

function readLocal() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeLocal(ids) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be full or blocked (private browsing). Saving still works until the page closes.
  }
}

export function useSavedClaims(user) {
  const [ids, setIds] = useState(readLocal);
  const [syncError, setSyncError] = useState("");
  const userId = user ? user.id : null;
  const previousUserId = useRef(userId);

  useEffect(() => {
    writeLocal(ids);
  }, [ids]);

  // Signing in or out.
  useEffect(() => {
    const before = previousUserId.current;
    previousUserId.current = userId;
    if (!supabase) return undefined;

    if (!userId) {
      if (before) {
        setIds([]);
        setSyncError("");
      }
      return undefined;
    }

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("saved_claims")
        .select("claim_id")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        setSyncError("Couldn't load your saved claims. Your saves on this device are still here.");
        return;
      }
      const remote = data.map((row) => row.claim_id);
      const onlyHere = readLocal().filter((id) => !remote.includes(id));
      if (onlyHere.length) {
        const { error: uploadError } = await supabase
          .from("saved_claims")
          .upsert(
            onlyHere.map((claimId) => ({ user_id: userId, claim_id: claimId })),
            { onConflict: "user_id,claim_id", ignoreDuplicates: true }
          );
        if (cancelled) return;
        if (uploadError) setSyncError("Some saves on this device couldn't be added to your account.");
      }
      setIds([...onlyHere, ...remote]);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = useCallback(
    async (claimId) => {
      const wasSaved = ids.includes(claimId);
      const apply = (save) =>
        setIds((current) =>
          save ? [claimId, ...current.filter((id) => id !== claimId)] : current.filter((id) => id !== claimId)
        );

      apply(!wasSaved);
      setSyncError("");
      if (!supabase || !userId) return;

      const { error } = wasSaved
        ? await supabase.from("saved_claims").delete().eq("user_id", userId).eq("claim_id", claimId)
        : await supabase
            .from("saved_claims")
            .upsert(
              { user_id: userId, claim_id: claimId },
              { onConflict: "user_id,claim_id", ignoreDuplicates: true }
            );

      if (error) {
        apply(wasSaved); // put it back the way it was
        setSyncError(SYNC_ERROR);
      }
    },
    [ids, userId]
  );

  return {
    savedIds: ids,
    isSaved: (claimId) => ids.includes(claimId),
    toggle,
    syncError,
  };
}
