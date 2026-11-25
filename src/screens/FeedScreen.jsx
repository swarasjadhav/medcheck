// Feed: one claim per screen, swipe up for the next.
import React from "react";
import { AlertTriangle, ChevronUp, ChevronDown } from "lucide-react";
import { EVIDENCE_LEVELS } from "../evidence-levels.js";
import { EvidenceMeter, SaveButton, SANS, SERIF } from "../ui.jsx";

function FeedCard({ topic, onOpen, saved, onToggleSave, index, total }) {
  const info = EVIDENCE_LEVELS[topic.verdict];
  return (
    <article
      aria-label={`Claim ${index + 1} of ${total}`}
      className="feed-card"
      style={{
        height: "100%",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px 24px",
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #1A2E35 0%, #16262C 100%)",
        color: "#FAF8F4",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.3,
          color: "#8FC9BC",
          marginBottom: 14,
        }}
      >
        HEALTH CLAIM
      </div>
      <h2 style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 1.3, fontWeight: 600, margin: "0 0 18px" }}>
        "{topic.claim}"
      </h2>
      <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.6, color: "#D8D2C6", margin: "0 0 16px" }}>
        {topic.short}
      </p>
      {topic.caution && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            background: "rgba(196,87,31,0.18)",
            border: "1px solid rgba(196,87,31,0.4)",
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 16,
          }}
        >
          <AlertTriangle size={15} color="#E08A52" style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
          <span style={{ fontFamily: SANS, fontSize: 12.5, color: "#F0D9C8", lineHeight: 1.4 }}>{topic.caution}</span>
        </div>
      )}
      <div style={{ marginBottom: 22 }}>
        <EvidenceMeter level={topic.verdict} onDark />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => onOpen(topic)}
          style={{
            background: "none",
            border: "1.5px solid rgba(250,248,244,0.5)",
            color: "#FAF8F4",
            borderRadius: 999,
            padding: "9px 18px",
            fontFamily: SANS,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
          aria-label={`See the evidence: ${topic.claim} (${info.label})`}
        >
          See the evidence
        </button>
        <SaveButton topic={topic} saved={saved} onToggle={onToggleSave} onDark />
      </div>
      <div
        aria-hidden="true"
        className="swipe-hint"
        style={{
          position: "absolute",
          bottom: 18,
          right: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "rgba(250,248,244,0.45)",
        }}
      >
        <ChevronUp size={16} />
        <span style={{ fontFamily: SANS, fontSize: 10 }}>swipe</span>
        <ChevronDown size={16} />
      </div>
    </article>
  );
}

export default function FeedScreen({ topics, onOpenTopic, isSaved, onToggleSave }) {
  return (
    <div className="feed-scroller" style={{ flex: 1, overflowY: "scroll", scrollSnapType: "y mandatory" }}>
      <h1 className="sr-only">MedCheck feed: health claims and how strong the evidence is</h1>
      {topics.map((t, i) => (
        <FeedCard
          key={t.id}
          topic={t}
          index={i}
          total={topics.length}
          onOpen={onOpenTopic}
          saved={isSaved(t.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
