// Fact Check: search the claims we've reviewed.
import React, { useMemo, useState } from "react";
import { Search, ExternalLink, Lightbulb } from "lucide-react";
import { searchTopics } from "../lib/search.js";
import { COLORS, SANS, SERIF, ClaimRow, ScreenTitle, SectionLabel } from "../ui.jsx";

// Shown when we haven't reviewed a claim, so people can check it themselves.
const CHECK_IT_YOURSELF = [
  "Who is making the claim, and are they selling something?",
  "Does it link to a study, or just to another post?",
  "Is it one small study, or a review of many studies?",
  "Was it tested in people, or only in animals or cells?",
];

function NotReviewedCard({ query, closeOnly }) {
  return (
    <div
      style={{
        padding: "20px 18px",
        fontFamily: SANS,
        color: "#5C574F",
        fontSize: 14,
        lineHeight: 1.6,
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <h2 style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: COLORS.dark, margin: "0 0 6px" }}>
        {closeOnly ? "We haven't reviewed that exact claim" : "We haven't reviewed this claim yet"}
      </h2>
      <p style={{ margin: "0 0 12px" }}>
        That doesn't mean it's true or false. We only rate claims we've checked against real sources.
        {closeOnly && " The closest claims we've reviewed are below."}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: COLORS.dark, marginBottom: 6 }}>
        <Lightbulb size={15} aria-hidden="true" /> Check it yourself
      </div>
      <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
        {CHECK_IT_YOURSELF.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
      <a
        href={`https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query.trim())}`}
        target="_blank"
        rel="noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, color: COLORS.teal, fontWeight: 600 }}
      >
        Search PubMed for it <ExternalLink size={14} aria-hidden="true" />
        <span className="sr-only">(opens in a new window)</span>
      </a>
    </div>
  );
}

export default function FactCheckScreen({ topics, onOpenTopic }) {
  const [query, setQuery] = useState("");

  const { results, closeOnly, searched } = useMemo(() => {
    if (!query.trim()) return { results: topics, closeOnly: false, searched: false };
    return { ...searchTopics(topics, query), searched: true };
  }, [query, topics]);

  const nothingFound = searched && results.length === 0;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: COLORS.bg }}>
      <div style={{ padding: "20px 20px 8px" }}>
        <ScreenTitle title="Check a claim" subtitle="Search a health claim you've heard to see what the evidence says." />
        <label htmlFor="claim-search" className="sr-only">
          Search health claims
        </label>
        <div
          className="search-box"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "10px 14px",
          }}
        >
          <Search size={17} color={COLORS.muted} aria-hidden="true" />
          <input
            id="claim-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. vitamin C, wet hair, energy drinks"
            autoComplete="off"
            enterKeyHint="search"
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              fontFamily: SANS,
              fontSize: 16, // 16px stops iPhones from zooming in on the box
              background: "transparent",
              color: COLORS.dark,
            }}
          />
        </div>
      </div>

      <div style={{ padding: "8px 20px 20px" }}>
        <p role="status" aria-live="polite" className="sr-only">
          {searched ? (nothingFound ? "No reviewed claims match." : `${results.length} claims found.`) : ""}
        </p>
        {(nothingFound || closeOnly) && <NotReviewedCard query={query} closeOnly={closeOnly} />}
        {searched && results.length > 0 && (
          <SectionLabel>{closeOnly ? "Closest claims we've reviewed" : "Claims we've reviewed"}</SectionLabel>
        )}
        {results.map((t) => (
          <ClaimRow key={t.id} topic={t} onOpen={onOpenTopic} />
        ))}
      </div>
    </div>
  );
}
