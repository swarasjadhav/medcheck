// One shared definition of the four evidence ratings.
// The app and the link-preview build step (scripts/prerender-claims.mjs)
// both read from here, so changing a label or color updates everywhere.
export const EVIDENCE_LEVELS = {
  strong: { label: "Strong evidence", value: 4, color: "#2D7D6E" },
  limited: { label: "Limited evidence", value: 3, color: "#4A6FA5" },
  unclear: { label: "Unclear / mixed", value: 2, color: "#8B8378" },
  contradicts: { label: "Contradicts claim", value: 1, color: "#C4571F" },
};
