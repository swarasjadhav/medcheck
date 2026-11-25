// One shared definition of the four evidence ratings.
// The app and the link-preview build step (scripts/prerender-claims.mjs)
// both read from here, so changing a label or color updates everywhere.
//
// `color` is for the meter bars. `text` is a darker shade for small text on
// light backgrounds, so the labels meet accessibility contrast guidelines.
export const EVIDENCE_LEVELS = {
  strong: { label: "Strong evidence", value: 4, color: "#2D7D6E", text: "#2D7D6E" },
  limited: { label: "Limited evidence", value: 3, color: "#4A6FA5", text: "#4A6FA5" },
  unclear: { label: "Unclear / mixed", value: 2, color: "#8B8378", text: "#6F675C" },
  contradicts: { label: "Contradicts claim", value: 1, color: "#C4571F", text: "#B04D1B" },
};

// Strongest to weakest, for lists and the quiz.
export const LEVEL_ORDER = ["strong", "limited", "unclear", "contradicts"];

// What each rating means. Shown on the "How we rate evidence" page and in the quiz.
export const LEVEL_DEFINITIONS = {
  strong:
    "A systematic review of randomized trials, or several large trials, found consistent results that support the claim.",
  limited:
    "There is some good evidence, but the effect is small, applies only to some people, or comes mostly from observational studies.",
  unclear:
    "There are few studies, the results conflict, or the studies are low quality, so we can't say either way yet.",
  contradicts: "Good-quality studies show the claim is false.",
};
