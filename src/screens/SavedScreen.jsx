// Saved: claims the person bookmarked.
import React from "react";
import { Bookmark } from "lucide-react";
import { accountsEnabled } from "../lib/supabase.js";
import { COLORS, SANS, ClaimRow, ScreenTitle, SaveButton, secondaryButton } from "../ui.jsx";

export default function SavedScreen({ topics, savedIds, onOpenTopic, onToggleSave, user, syncError, onGoToAccount }) {
  // Keep the order people saved them in (newest first), and skip ids we no longer have.
  const saved = savedIds.map((id) => topics.find((t) => t.id === id)).filter(Boolean);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: COLORS.bg, padding: "20px 20px 24px" }}>
      <ScreenTitle
        title="Saved claims"
        subtitle={
          user
            ? "Saved to your account, so they show up on all your devices."
            : "Saved on this device."
        }
      />

      {syncError && (
        <p role="alert" style={{ fontFamily: SANS, fontSize: 13, color: COLORS.rust, margin: "0 0 14px" }}>
          {syncError}
        </p>
      )}

      {saved.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "28px 18px",
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            fontFamily: SANS,
            fontSize: 14,
            lineHeight: 1.6,
            color: "#5C574F",
          }}
        >
          <Bookmark size={22} color={COLORS.teal} aria-hidden="true" />
          <p style={{ margin: "8px 0 0" }}>
            Nothing saved yet. Tap <strong>Save</strong> on any claim to keep it here.
          </p>
        </div>
      ) : (
        saved.map((t) => (
          <ClaimRow
            key={t.id}
            topic={t}
            onOpen={onOpenTopic}
            trailing={<SaveButton topic={t} saved onToggle={onToggleSave} compact />}
          />
        ))
      )}

      {accountsEnabled && !user && (
        <div style={{ marginTop: 18, fontFamily: SANS, fontSize: 13.5, color: COLORS.muted, lineHeight: 1.5 }}>
          <p style={{ margin: "0 0 10px" }}>Sign in to keep your saved claims on your phone and laptop.</p>
          <button onClick={onGoToAccount} style={secondaryButton}>
            Sign in or create an account
          </button>
        </div>
      )}
    </div>
  );
}
