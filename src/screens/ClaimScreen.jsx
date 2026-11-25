// The evidence page for one claim.
import React from "react";
import { ChevronLeft, ChevronRight, ExternalLink, AlertTriangle } from "lucide-react";
import { EVIDENCE_LEVELS } from "../evidence-levels.js";
import {
  COLORS,
  SANS,
  SERIF,
  Disclaimer,
  EvidenceMeter,
  SaveButton,
  SectionLabel,
  ShareButton,
  secondaryButton,
} from "../ui.jsx";

function formatDate(isoDate) {
  const [y, m, d] = String(isoDate).split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

function NotFound({ onBack }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        fontFamily: SANS,
        color: "#5C574F",
        fontSize: 14,
        lineHeight: 1.6,
        padding: 24,
        textAlign: "center",
        background: COLORS.bg,
      }}
    >
      <h1 style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: COLORS.dark, margin: 0 }}>
        We couldn't find that claim
      </h1>
      The link may be mistyped, or the claim may have moved.
      <button onClick={onBack} style={{ ...secondaryButton, borderColor: COLORS.teal, color: COLORS.teal }}>
        Go to the feed
      </button>
    </div>
  );
}

export default function ClaimScreen({ topic, onBack, saved, onToggleSave, onOpenHowWeRate }) {
  if (!topic) return <NotFound onBack={onBack} />;

  const info = EVIDENCE_LEVELS[topic.verdict];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: COLORS.bg }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          padding: "16px 16px 0",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: COLORS.muted,
            fontFamily: SANS,
            fontSize: 14,
            padding: 6,
          }}
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShareButton topic={topic} />
          <SaveButton topic={topic} saved={saved} onToggle={onToggleSave} />
        </div>
      </div>

      <div style={{ padding: "12px 20px 28px" }}>
        <SectionLabel style={{ marginBottom: 10 }}>The claim</SectionLabel>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            fontWeight: 600,
            color: COLORS.dark,
            lineHeight: 1.35,
            margin: "0 0 16px",
          }}
        >
          "{topic.claim}"
        </h1>

        <div
          style={{
            background: COLORS.white,
            border: `1.5px solid ${info.color}33`,
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 16,
          }}
        >
          <EvidenceMeter level={topic.verdict} />
          <button
            onClick={onOpenHowWeRate}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              marginTop: 10,
              padding: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: SANS,
              fontSize: 12.5,
              fontWeight: 600,
              color: COLORS.teal,
            }}
          >
            What does this rating mean? <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>

        {topic.caution && (
          <div
            role="note"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              background: "#FDF1EA",
              border: "1px solid #E8B892",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 22,
            }}
          >
            <AlertTriangle size={16} color="#C4571F" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
            <span style={{ fontFamily: SANS, fontSize: 13, color: "#8A3F18", lineHeight: 1.5 }}>
              <span className="sr-only">Safety warning: </span>
              {topic.caution}
            </span>
          </div>
        )}

        <h2 className="section-heading">What the evidence says</h2>
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.65, color: COLORS.body, margin: "0 0 26px" }}>
          {topic.explanation}
        </p>

        {(topic.limitations || topic.wouldChange) && (
          <div
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              margin: "0 0 26px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {topic.limitations && (
              <div>
                <h2 className="section-heading" style={{ color: info.text, marginBottom: 5 }}>
                  Limitations
                </h2>
                <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: COLORS.body }}>
                  {topic.limitations}
                </div>
              </div>
            )}
            {topic.wouldChange && (
              <div>
                <h2 className="section-heading" style={{ color: info.text, marginBottom: 5 }}>
                  What would change this conclusion
                </h2>
                <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.55, color: COLORS.body }}>
                  {topic.wouldChange}
                </div>
              </div>
            )}
          </div>
        )}

        <h2 className="section-heading" style={{ marginBottom: 10 }}>
          Sources
        </h2>
        {topic.sources.map((s, i) => (
          <a
            key={i}
            href={s.url || "#"}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 10,
              textDecoration: "none",
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "13px 15px",
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: COLORS.dark, marginBottom: 3 }}>
                {s.title}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: COLORS.muted }}>
                {[s.type, s.publisher, s.year].filter(Boolean).join(" · ")}
              </div>
            </div>
            <ExternalLink size={15} color={COLORS.muted} style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
            <span className="sr-only">(opens in a new window)</span>
          </a>
        ))}

        <p style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.5, color: COLORS.muted, margin: "14px 0 0" }}>
          Reviewed by the MedCheck student team
          {topic.reviewedOn ? ` · Last reviewed ${formatDate(topic.reviewedOn)}` : ""}
        </p>
        <Disclaimer />
      </div>
    </div>
  );
}
