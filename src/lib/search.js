// Fact Check search.
//
// People word the same claim many ways ("does wet hair give you a cold?",
// "cold weather makes you sick"), so instead of matching the exact text we split
// the search into meaningful words and score each claim by how many of them it
// shares with the claim, its aliases, its summary and its explanation.

const STOP_WORDS = new Set(
  (
    "a an the is are was were be been being do does did doing can could will would should " +
    "of to in on for with and or but if it its this that these those you your yours my me " +
    "i we us our they them their he she his her at by from as about into than then so too " +
    "very just really more most much many any some no not dont doesnt isnt arent true false " +
    "fact myth real really actually make makes made get gets getting give gives cause causes " +
    "help helps good bad people thing things what why how when who which"
  ).split(" ")
);

// A very light word-ending trim, so "colds" matches "cold", "glasses" matches "glass"
// and "cracking" matches "crack".
function stem(word) {
  if (word.length > 5 && /(sses|shes|ches|xes)$/.test(word)) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us")) {
    return word.slice(0, -1);
  }
  return word;
}

export function searchWords(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
    .map(stem);
}

// How much a match counts, depending on where the word appears.
const WEIGHTS = { claim: 3, short: 1.5, explanation: 0.75 };

function buildIndex(topics) {
  return topics.map((topic) => {
    const weights = new Map();
    const add = (text, weight) => {
      for (const w of searchWords(text)) {
        if ((weights.get(w) || 0) < weight) weights.set(w, weight);
      }
    };
    add(topic.claim, WEIGHTS.claim);
    (topic.aliases || []).forEach((alias) => add(alias, WEIGHTS.claim));
    add(topic.short, WEIGHTS.short);
    add(topic.explanation, WEIGHTS.explanation);
    return { topic, weights };
  });
}

let cachedTopics = null;
let cachedIndex = null;

/**
 * Returns { results, closeOnly } where results are topics sorted best first.
 * closeOnly is true when nothing is a strong match, so the screen can say
 * "we haven't reviewed that exact claim" above the closest ones.
 */
export function searchTopics(topics, query) {
  const queryWords = [...new Set(searchWords(query))];
  if (!queryWords.length) return { results: [], closeOnly: false, queryWords };

  if (cachedTopics !== topics) {
    cachedTopics = topics;
    cachedIndex = buildIndex(topics);
  }

  const scored = cachedIndex
    .map(({ topic, weights }) => {
      let score = 0;
      let missed = 0;
      for (const q of queryWords) {
        let best = weights.get(q) || 0;
        if (!best && q.length >= 4) {
          // Partly typed words: "vita" finds "vitamin".
          for (const [word, weight] of weights) {
            if (word.startsWith(q)) best = Math.max(best, weight * 0.8);
          }
        }
        if (!best) missed += 1;
        score += best;
      }
      return { topic, score, missed };
    })
    .filter((s) => s.score >= 1.5)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return { results: [], closeOnly: false, queryWords };

  // Drop weak extras that only share a word or two from the explanation.
  const top = scored[0];
  const results = scored.filter((s) => s.score >= top.score * 0.4).slice(0, 8);

  // A strong match covers every searched word and matches the claim itself.
  // Otherwise say these are only the closest claims ("vitamin D and COVID" is not
  // the same claim as "vitamin C and colds").
  const strongEnough = WEIGHTS.claim * Math.min(2, queryWords.length);
  const closeOnly = top.missed > 0 || top.score < strongEnough;
  return { results: results.map((s) => s.topic), closeOnly, queryWords };
}
