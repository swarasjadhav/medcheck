import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ExternalLink, Home, FileSearch, BookMarked, ChevronUp, ChevronDown, HelpCircle, AlertTriangle } from "lucide-react";
import { TOPICS } from "./topics-data.js";
import QuizScreen from "./QuizScreen.jsx";

// ---------------------------------------------------------------------------
// SHARED UI PIECES
// ---------------------------------------------------------------------------

const EVIDENCE_LEVELS = {
  strong: { label: "Strong evidence", value: 4, color: "#2D7D6E" },
  limited: { label: "Limited evidence", value: 3, color: "#4A6FA5" },
  unclear: { label: "Unclear / mixed", value: 2, color: "#8B8378" },
  contradicts: { label: "Contradicts claim", value: 1, color: "#C4571F" },
};

function EvidenceMeter({ level, size = "md" }) {
  const info = EVIDENCE_LEVELS[level];
  const bars = 4;
  const height = size === "sm" ? 14 : 20;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: bars }).map((_, i) => (
          <div
            key={i}
            style={{
              width: size === "sm" ? 5 : 7,
              height: height - i * (size === "sm" ? 2 : 3),
              alignSelf: "flex-end",
              borderRadius: 2,
              background: i < info.value ? info.color : "#E4DFD6",
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: size === "sm" ? 12 : 13,
          fontWeight: 600,
          color: info.color,
        }}
      >
        {info.label}
      </span>
    </div>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: "feed", label: "Feed", Icon: Home },
    { id: "check", label: "Fact Check", Icon: FileSearch },
    { id: "quiz", label: "Quiz", Icon: HelpCircle },
    { id: "sources", label: "Sources", Icon: BookMarked },
  ];
  return (
    <div
      style={{
        display: "flex",
        borderTop: "1px solid #E4DFD6",
        background: "#FAF8F4",
        flexShrink: 0,
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "10px 0 12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? "#2D7D6E" : "#8B8378",
            }}
          >
            <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10.5,
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SCREEN 1: SCROLLING FEED
// ---------------------------------------------------------------------------

function FeedCard({ topic, onOpen }) {
  const info = EVIDENCE_LEVELS[topic.verdict];
  return (
    <div
      style={{
        height: "100%",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "32px 24px",
        boxSizing: "border-box",
        background: `linear-gradient(180deg, #1A2E35 0%, #16262C 100%)`,
        color: "#FAF8F4",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.3,
          color: info.color,
          marginBottom: 14,
        }}
      >
        MYTH OR FACT
      </div>
      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: 24,
          lineHeight: 1.3,
          fontWeight: 600,
          margin: 0,
          marginBottom: 18,
        }}
      >
        "{topic.claim}"
      </h2>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 15,
          lineHeight: 1.6,
          color: "#D8D2C6",
          margin: 0,
          marginBottom: 16,
        }}
      >
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
          <AlertTriangle size={15} color="#E08A52" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#F0D9C8", lineHeight: 1.4 }}>
            {topic.caution}
          </span>
        </div>
      )}
      <div style={{ marginBottom: 22 }}>
        <EvidenceMeter level={topic.verdict} />
      </div>
      <button
        onClick={() => onOpen(topic)}
        style={{
          alignSelf: "flex-start",
          background: "none",
          border: "1.5px solid rgba(250,248,244,0.4)",
          color: "#FAF8F4",
          borderRadius: 999,
          padding: "9px 18px",
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        See the evidence
      </button>
      <div
        style={{
          position: "absolute",
          bottom: 18,
          right: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "rgba(250,248,244,0.35)",
        }}
      >
        <ChevronUp size={16} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10 }}>swipe</span>
        <ChevronDown size={16} />
      </div>
    </div>
  );
}

function FeedScreen({ onOpenTopic }) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {TOPICS.map((t) => (
        <FeedCard key={t.id} topic={t} onOpen={onOpenTopic} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SCREEN 2: FACT-CHECK SEARCH
// ---------------------------------------------------------------------------

function FactCheckScreen({ onOpenTopic }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return TOPICS;
    const q = query.toLowerCase();
    return TOPICS.filter(
      (t) =>
        t.claim.toLowerCase().includes(q) || t.short.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#FAF8F4" }}>
      <div style={{ padding: "20px 20px 8px" }}>
        <h1
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 22,
            fontWeight: 600,
            color: "#1A2E35",
            margin: "0 0 4px",
          }}
        >
          Check a claim
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            color: "#8B8378",
            margin: "0 0 16px",
          }}
        >
          Search a medical claim you've heard to see what the evidence says.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid #E4DFD6",
            borderRadius: 12,
            padding: "10px 14px",
          }}
        >
          <Search size={17} color="#8B8378" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. vitamin C, antibiotics, sugar..."
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              background: "transparent",
              color: "#1A2E35",
            }}
          />
        </div>
      </div>

      <div style={{ padding: "8px 20px 20px" }}>
        {results.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              fontFamily: "Inter, sans-serif",
              color: "#8B8378",
              fontSize: 14,
            }}
          >
            No matching claims yet. Try different words.
          </div>
        )}
        {results.map((t) => {
          return (
            <button
              key={t.id}
              onClick={() => onOpenTopic(t)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "#fff",
                border: "1px solid #E4DFD6",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 15.5,
                  fontWeight: 600,
                  color: "#1A2E35",
                  marginBottom: 8,
                  lineHeight: 1.35,
                }}
              >
                {t.claim}
              </div>
              <EvidenceMeter level={t.verdict} size="sm" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SCREEN 3: SOURCE / EVIDENCE DETAIL PAGE
// ---------------------------------------------------------------------------

function SourceScreen({ topic, onBack }) {
  if (!topic) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          color: "#8B8378",
          fontSize: 14,
          padding: 20,
          textAlign: "center",
          background: "#FAF8F4",
        }}
      >
        Open a topic from the Feed, Fact Check, or Quiz tab to see its full sources here.
      </div>
    );
  }

  const info = EVIDENCE_LEVELS[topic.verdict];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#FAF8F4" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
            color: "#8B8378",
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            padding: 4,
          }}
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </div>

      <div style={{ padding: "12px 20px 28px" }}>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.3,
            color: "#8B8378",
            marginBottom: 10,
          }}
        >
          THE CLAIM
        </div>
        <h1
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 22,
            fontWeight: 600,
            color: "#1A2E35",
            lineHeight: 1.35,
            margin: "0 0 16px",
          }}
        >
          "{topic.claim}"
        </h1>

        <div
          style={{
            background: "#fff",
            border: `1.5px solid ${info.color}33`,
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 16,
          }}
        >
          <EvidenceMeter level={topic.verdict} />
        </div>

        {topic.caution && (
          <div
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
            <AlertTriangle size={16} color="#C4571F" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#8A3F18", lineHeight: 1.5 }}>
              {topic.caution}
            </span>
          </div>
        )}

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.3,
            color: "#8B8378",
            marginBottom: 8,
          }}
        >
          WHAT THE EVIDENCE SAYS
        </div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            lineHeight: 1.65,
            color: "#33302A",
            margin: "0 0 26px",
          }}
        >
          {topic.explanation}
        </p>

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.3,
            color: "#8B8378",
            marginBottom: 10,
          }}
        >
          SOURCES
        </div>
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
              background: "#fff",
              border: "1px solid #E4DFD6",
              borderRadius: 12,
              padding: "13px 15px",
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#1A2E35",
                  marginBottom: 3,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#8B8378",
                }}
              >
                {s.publisher} · {s.year}
              </div>
            </div>
            <ExternalLink size={15} color="#8B8378" style={{ flexShrink: 0, marginTop: 2 }} />
          </a>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// APP SHELL
// ---------------------------------------------------------------------------

export default function App() {
  const [tab, setTab] = useState("feed");
  const [activeTopic, setActiveTopic] = useState(null);

  const openTopic = (topic) => {
    setActiveTopic(topic);
    setTab("sources");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 390,
        height: 720,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        background: "#FAF8F4",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(26,46,53,0.25)",
        fontFamily: "Inter, sans-serif",
        border: "1px solid #E4DFD6",
      }}
    >
      {/* status-bar-ish header */}
      <div
        style={{
          padding: "14px 18px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: tab === "feed" ? "#1A2E35" : "#FAF8F4",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontWeight: 700,
            fontSize: 16,
            color: tab === "feed" ? "#FAF8F4" : "#1A2E35",
          }}
        >
          MedCheck
        </span>
        <span
          style={{
            fontSize: 11,
            color: tab === "feed" ? "rgba(250,248,244,0.5)" : "#8B8378",
          }}
        >
          {TOPICS.length} topics
        </span>
      </div>

      {tab === "feed" && <FeedScreen onOpenTopic={openTopic} />}
      {tab === "check" && <FactCheckScreen onOpenTopic={openTopic} />}
      {tab === "quiz" && <QuizScreen onOpenTopic={openTopic} topics={TOPICS} />}
      {tab === "sources" && (
        <SourceScreen topic={activeTopic} onBack={() => setTab("check")} />
      )}

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
