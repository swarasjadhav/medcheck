// How we rate evidence: what the four ratings mean and how claims are reviewed.
import React from "react";
import { ChevronLeft } from "lucide-react";
import { LEVEL_DEFINITIONS, LEVEL_ORDER } from "../evidence-levels.js";
import { COLORS, SANS, Disclaimer, EvidenceMeter, ScreenTitle } from "../ui.jsx";

// Keep this list true to what the team actually does today. Add steps (for example,
// a teacher's or doctor's review) only once they are really happening.
const REVIEW_STEPS = [
  "We start from strong sources: systematic reviews such as Cochrane, guideline groups such as the CDC or WHO, and major medical journals.",
  "We check every explanation and rating against its sources by hand before it's published.",
  "Every page lists its sources, its limitations, and what new evidence would change our conclusion.",
];

const paragraph = { fontFamily: SANS, fontSize: 14.5, lineHeight: 1.6, color: COLORS.body, margin: "0 0 14px" };

export default function HowWeRateScreen({ onBack }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: COLORS.bg }}>
      <div style={{ padding: "16px 16px 0" }}>
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
      </div>
      <div style={{ padding: "8px 20px 28px" }}>
        <ScreenTitle
          title="How we rate evidence"
          subtitle="We don't label claims true or false. We rate how strong the research behind them is."
        />

        {LEVEL_ORDER.map((level) => (
          <div
            key={level}
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 10,
            }}
          >
            <EvidenceMeter level={level} />
            <p style={{ ...paragraph, margin: "8px 0 0", fontSize: 14 }}>{LEVEL_DEFINITIONS[level]}</p>
          </div>
        ))}

        <h2 className="section-heading" style={{ marginTop: 22 }}>
          How we review a claim
        </h2>
        <ol style={{ ...paragraph, paddingLeft: 20 }}>
          {REVIEW_STEPS.map((step) => (
            <li key={step} style={{ marginBottom: 8 }}>
              {step}
            </li>
          ))}
        </ol>

        <h2 className="section-heading">Why ratings can change</h2>
        <p style={paragraph}>
          Science keeps going. When important new research comes out, we review the claim again and update its
          rating and the date on its page.
        </p>
        <Disclaimer />
      </div>
    </div>
  );
}
