// Maps each screen to a web address, so every claim has a link people can share.
//
//   /                 Feed
//   /check            Fact Check
//   /quiz             Quiz
//   /sources          Sources (no claim picked yet)
//   /claim/<id>       The evidence page for one claim, e.g. /claim/vitamin-c-colds

const TAB_PATHS = {
  feed: "/",
  check: "/check",
  quiz: "/quiz",
  sources: "/sources",
};

export function pathFor(tab, topicId) {
  if (tab === "sources" && topicId) return `/claim/${topicId}`;
  return TAB_PATHS[tab] || "/";
}

export function parsePath(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const claim = clean.match(/^\/claim\/([a-z0-9-]+)$/i);
  if (claim) return { tab: "sources", topicId: claim[1].toLowerCase() };
  const tab = Object.keys(TAB_PATHS).find((t) => TAB_PATHS[t] === clean);
  return { tab: tab || "feed", topicId: null };
}

// The full link to a claim on whatever site the app is running on
// (the live site, a Vercel preview, or a future custom domain).
export function claimUrl(topicId) {
  return `${window.location.origin}${pathFor("sources", topicId)}`;
}
