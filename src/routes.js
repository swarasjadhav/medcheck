// Maps each screen to a web address, so screens and claims have links people can share.
//
//   /                  Feed
//   /check             Fact Check
//   /quiz              Quiz
//   /saved             Saved claims
//   /account           Sign in, account, about
//   /account/reset     Where password-reset emails land
//   /how-we-rate       How we rate evidence
//   /claim/<id>        The evidence page for one claim, e.g. /claim/vitamin-c-colds
import { publicOrigin } from "./config.js";

const SCREEN_PATHS = {
  feed: "/",
  check: "/check",
  quiz: "/quiz",
  saved: "/saved",
  account: "/account",
  howWeRate: "/how-we-rate",
};

export function pathFor(screen, claimId) {
  if (screen === "claim" && claimId) return `/claim/${claimId}`;
  return SCREEN_PATHS[screen] || "/";
}

export function parsePath(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const claim = clean.match(/^\/claim\/([a-z0-9-]+)$/i);
  if (claim) return { screen: "claim", claimId: claim[1].toLowerCase() };
  if (clean === "/account/reset") return { screen: "account", claimId: null };
  const screen = Object.keys(SCREEN_PATHS).find((s) => SCREEN_PATHS[s] === clean);
  return { screen: screen || "feed", claimId: null };
}

// The full link to a claim. Inside the phone apps this is the public web address,
// so a shared link opens for anyone.
export function claimUrl(claimId) {
  return `${publicOrigin()}${pathFor("claim", claimId)}`;
}
