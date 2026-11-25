// Small pieces of UI shared by several screens.
import React, { useEffect, useRef, useState } from "react";
import { Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { EVIDENCE_LEVELS } from "./evidence-levels.js";
import { claimUrl } from "./routes.js";

export const COLORS = {
  bg: "#FAF8F4",
  dark: "#1A2E35",
  teal: "#2D7D6E",
  rust: "#B04D1B",
  border: "#E4DFD6",
  muted: "#6B655C", // dark enough for small text on the cream background
  body: "#33302A",
  white: "#FFFFFF",
};

export const SERIF = "'Source Serif 4', Georgia, serif";
export const SANS = "Inter, sans-serif";

// App icon: a magnifying glass with a check mark inside (check the evidence),
// plus a small medical plus. Same artwork as public/icon.svg.
export function Logo({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2D7D6E" />
          <stop offset="1" stopColor="#1F5E52" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#mc-bg)" />
      <circle cx="232" cy="236" r="108" fill="none" stroke="#FAF8F4" strokeWidth="36" />
      <line x1="312" y1="316" x2="404" y2="408" stroke="#FAF8F4" strokeWidth="42" strokeLinecap="round" />
      <path d="M184 238 L222 276 L286 198" fill="none" stroke="#FAF8F4" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M396 84 V148 M364 116 H428" fill="none" stroke="#8FC9BC" strokeWidth="24" strokeLinecap="round" />
    </svg>
  );
}

// The four-bar evidence meter. Screen readers hear "Evidence: Limited evidence, 3 of 4".
export function EvidenceMeter({ level, size = "md", onDark = false }) {
  const info = EVIDENCE_LEVELS[level];
  const height = size === "sm" ? 14 : 20;
  return (
    <div
      role="img"
      aria-label={`Evidence: ${info.label}, ${info.value} of 4`}
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <div style={{ display: "flex", gap: 3 }} aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: size === "sm" ? 5 : 7,
              height: height - i * (size === "sm" ? 2 : 3),
              alignSelf: "flex-end",
              borderRadius: 2,
              background: i < info.value ? info.color : onDark ? "rgba(250,248,244,0.25)" : COLORS.border,
            }}
          />
        ))}
      </div>
      <span
        aria-hidden="true"
        style={{
          fontFamily: SANS,
          fontSize: size === "sm" ? 12 : 13,
          fontWeight: 600,
          color: onDark ? "#FAF8F4" : info.text,
        }}
      >
        {info.label}
      </span>
    </div>
  );
}

export function SectionLabel({ children, color = COLORS.muted, style }) {
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
        textTransform: "uppercase",
        color,
        marginBottom: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function ScreenTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h1 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: COLORS.dark, margin: "0 0 4px" }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontFamily: SANS, fontSize: 13, color: COLORS.muted, margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
      )}
    </div>
  );
}

// A claim in a list (Fact Check results, Saved, quiz review).
export function ClaimRow({ topic, onOpen, trailing }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 8, marginBottom: 10 }}>
      <button
        onClick={() => onOpen(topic)}
        style={{
          flex: 1,
          display: "block",
          textAlign: "left",
          background: COLORS.white,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: "14px 16px",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: SERIF,
            fontSize: 15.5,
            fontWeight: 600,
            color: COLORS.dark,
            marginBottom: 8,
            lineHeight: 1.35,
          }}
        >
          {topic.claim}
        </span>
        <EvidenceMeter level={topic.verdict} size="sm" />
      </button>
      {trailing}
    </div>
  );
}

export const pillButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  borderRadius: 999,
  padding: "10px 18px",
  fontFamily: SANS,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};

export const primaryButton = { ...pillButton, background: COLORS.dark, color: COLORS.bg, border: "none" };
export const secondaryButton = {
  ...pillButton,
  background: COLORS.white,
  color: COLORS.dark,
  border: `1.5px solid ${COLORS.border}`,
};

// Bookmark button. `onDark` is for the dark feed cards.
export function SaveButton({ topic, saved, onToggle, onDark = false, compact = false }) {
  const Icon = saved ? BookmarkCheck : Bookmark;
  const color = onDark ? "#FAF8F4" : COLORS.dark;
  return (
    <button
      onClick={() => onToggle(topic.id)}
      aria-pressed={saved}
      aria-label={saved ? `Saved: ${topic.claim}. Tap to remove.` : `Save: ${topic.claim}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: saved ? (onDark ? "rgba(250,248,244,0.14)" : "#2D7D6E14") : "none",
        border: `1px solid ${onDark ? "rgba(250,248,244,0.4)" : COLORS.border}`,
        borderRadius: 999,
        cursor: "pointer",
        color,
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: 600,
        padding: compact ? "8px" : "6px 12px",
      }}
    >
      <Icon size={15} />
      {!compact && (saved ? "Saved" : "Save")}
    </button>
  );
}

// Shares the claim's link: opens the phone's share sheet when there is one,
// otherwise copies the link and says so.
export function ShareButton({ topic }) {
  const [status, setStatus] = useState("");
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (message) => {
    setStatus(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 3000);
  };

  const share = async () => {
    const url = claimUrl(topic.id);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `"${topic.claim}" · MedCheck`,
          text: `${EVIDENCE_LEVELS[topic.verdict].label}: ${topic.short}`,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch (err) {
      if (err && err.name === "AbortError") return; // they closed the share sheet
      flash("Couldn't copy the link");
    }
  };

  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span role="status" aria-live="polite" style={{ fontFamily: SANS, fontSize: 12, color: COLORS.teal }}>
        {status}
      </span>
      <button
        onClick={share}
        aria-label={`Share the evidence for: ${topic.claim}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 999,
          cursor: "pointer",
          color: COLORS.dark,
          fontFamily: SANS,
          fontSize: 13,
          fontWeight: 600,
          padding: "6px 12px",
        }}
      >
        <Share2 size={15} />
        Share
      </button>
    </span>
  );
}

export function Disclaimer() {
  return (
    <p style={{ fontFamily: SANS, fontSize: 12, lineHeight: 1.5, color: COLORS.muted, margin: "18px 0 0" }}>
      For education only. MedCheck is not medical advice. Talk to a doctor or pharmacist about your own health.
    </p>
  );
}
