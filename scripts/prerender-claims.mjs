// Runs after `vite build` (see "build" in package.json).
//
// Link previews on iMessage, Instagram, Discord and Google don't run our app's
// JavaScript, so they can't see which claim a link points to. This script writes
// one small HTML file per claim, dist/claim/<id>/index.html, with that claim's
// title, summary and preview tags. The page still loads the same app.
//
// It also checks the claim data and stops the build if an id is missing,
// repeated, or not safe to use in a web address.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { TOPICS } from "../src/topics-data.js";
import { EVIDENCE_LEVELS } from "../src/evidence-levels.js";

// The address the site is published at. Vercel sets VERCEL_PROJECT_PRODUCTION_URL
// during builds; set SITE_URL yourself to override it (for example, a custom domain).
const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://medcheck-steel.vercel.app")
).replace(/\/+$/, "");

const DIST = new URL("../dist/", import.meta.url);
const SEO_BLOCK = /<!-- seo:start[^>]*-->[\s\S]*?<!-- seo:end -->/;

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function seoTags({ title, description, path }) {
  const url = `${SITE_URL}${path}`;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  return [
    "<!-- seo:start -->",
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="MedCheck" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/icon-512.png" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    "<!-- seo:end -->",
  ].join("\n    ");
}

function checkClaims() {
  const seen = new Set();
  for (const topic of TOPICS) {
    if (!topic.id || !/^[a-z0-9-]+$/.test(topic.id)) {
      throw new Error(`Claim id must use only lowercase letters, numbers and dashes: "${topic.id}"`);
    }
    if (seen.has(topic.id)) throw new Error(`Two claims share the id "${topic.id}"`);
    if (!EVIDENCE_LEVELS[topic.verdict]) {
      throw new Error(`Claim "${topic.id}" has an unknown rating "${topic.verdict}"`);
    }
    seen.add(topic.id);
  }
}

async function main() {
  checkClaims();

  const template = await readFile(new URL("index.html", DIST), "utf8");
  if (!SEO_BLOCK.test(template)) {
    throw new Error("dist/index.html is missing the <!-- seo:start --> ... <!-- seo:end --> block");
  }

  // Home page: same text as before, plus preview tags.
  const home = template.replace(
    SEO_BLOCK,
    seoTags({
      title: "MedCheck: what the evidence says about health claims",
      description: "Check whether a health claim is backed by evidence. Every rating links to the real studies behind it.",
      path: "/",
    })
  );
  await writeFile(new URL("index.html", DIST), home);

  // One page per claim.
  for (const topic of TOPICS) {
    const level = EVIDENCE_LEVELS[topic.verdict].label;
    const html = template.replace(
      SEO_BLOCK,
      seoTags({
        title: `"${topic.claim}": what the evidence says · MedCheck`,
        description: `${level}. ${topic.short}`,
        path: `/claim/${topic.id}`,
      })
    );
    const dir = new URL(`claim/${topic.id}/`, DIST);
    await mkdir(dir, { recursive: true });
    await writeFile(new URL("index.html", dir), html);
  }

  console.log(`Wrote link-preview pages for ${TOPICS.length} claims (site: ${SITE_URL})`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
