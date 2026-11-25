# MedCheck

**MedCheck helps people check whether a health claim is actually backed by evidence.**

A short-form, swipe-through app for teens and adults who see health claims on social media. Instead of a simple "true" or "false," MedCheck shows *how strong* the evidence is and links every claim to the real studies behind it.

Built for the 2026 Congressional App Challenge, Texas's 21st District.

- **Team:** Swara Jadhav, Revanth Movva, Sragvi Madishetty (Ronald Reagan High School)
- **Demo video:** https://www.youtube.com/watch?v=zVCDjAjTWhs
- **Live app:** https://medcheck-steel.vercel.app

## Why we built it

Nowadays, health information spreads faster than ever online, but the evidence behind it often gets lost. A confident-looking video or post can reach thousands of people without showing where the claim came from, and many existing fact-checking tools reduce complicated scientific questions to a simple “true” or “false.”

We were inspired by how often we saw health claims online that sounded convincing but were difficult to verify without digging through dense research papers ourselves. We wanted to make that process easier for everyone by creating a tool that does more than label a claim. It shows how strong the evidence is, where it comes from, and why the conclusion may change as new research emerges. Our goal is to give people the tools to make informed health decisions based on evidence, not on how convincing or popular a claim is online.

## What the app does

- **Feed:** one claim at a time, with a short answer and an evidence meter.
- **Evidence page:** a plain-language explanation, its limitations, what new evidence would change the conclusion, and the real sources (publisher, year, link).
- **Fact Check:** search all 20 reviewed topics, even when people word a claim differently ("does wet hair give you a cold?"). If a claim has not been reviewed, the app says so instead of guessing, shows the closest claims, gives four questions for checking it yourself, and links to a PubMed search.
- **Quiz:** "How strong is the evidence?" for six random claims, one from each rating. After each answer, one tap opens the full evidence for that topic.
- **Shareable links:** every claim has its own address (like `/claim/vitamin-c-colds`) and a Share button, and links show a preview in messages and social apps.
- **Saved claims:** tap Save on any claim. Saves stay on the device, or sync to an optional account.
- **Account (optional):** email and password sign-in, password reset, and in-app account deletion.
- **How we rate evidence:** a page explaining the four ratings and how claims are reviewed.
- **Works offline** on the website, and is built to be wrapped as iPhone and Android apps with Capacitor.
- **Safety caution:** topics with a possible safety concern, such as mouth taping, show a warning.
- **Education only:** every evidence page says MedCheck is not medical advice.

### The four evidence ratings

| Rating | Bars | What it means |
| --- | --- | --- |
| Strong evidence | 4 | Well-designed studies or reviews support the claim. |
| Limited evidence | 3 | There is some support, but it is modest or comes with caveats. |
| Unclear / mixed | 2 | The studies are too few, too small, or disagree. |
| Contradicts claim | 1 | The evidence points against the claim. |

## Built with

- JavaScript
- [React](https://react.dev) 18 and [Vite](https://vitejs.dev) 5
- [lucide-react](https://lucide.dev) for icons
- Google Fonts: Source Serif 4 and Inter
- [Supabase](https://supabase.com) for optional accounts and saved claims
- [Vercel](https://vercel.com) for hosting and one server function (`api/delete-account.js`)

These are open-source tools (React and Vite are MIT licensed, lucide-react is ISC, supabase-js is MIT, and both fonts use the SIL Open Font License). All claim content lives in one file, `src/topics-data.js`. The only personal data MedCheck stores is an account's email address and the list of claims it saved; see the privacy policy in `website/privacy.html`.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the Supabase values (optional)
npm run dev
```

Without the Supabase values the app still runs: sign-in is hidden and saved claims stay on the device. Setup steps for Supabase, the website and the app stores are in our build and launch guide.

Then open the address it prints, usually http://localhost:5173.

To make a production build: `npm run build`.

## How the code is organized

```
src/
  App.jsx               App shell: header, tab bar, moving between screens
  screens/              One file per screen: Feed, Fact Check, Claim, Quiz,
                        Saved, Account, How we rate evidence
  ui.jsx                Shared pieces: evidence meter, Save and Share buttons, colors
  topics-data.js        All 20 topics, ratings, search phrases and sources
  evidence-levels.js    The four ratings: labels, colors, definitions
  routes.js             Web addresses for each screen and claim
  config.js             Settings read from .env.local / Vercel
  lib/                  Accounts (useAuth), saved claims, search, Supabase client
  main.jsx, index.css   Entry point and base styles
api/delete-account.js   Server function that deletes an account (needs the Supabase secret key)
supabase/schema.sql     Database table and security rules, run once in Supabase
scripts/                Build step that writes a link-preview page for each claim
public/                 App icons, manifest, offline service worker
website/                The MedCheck website: home, privacy, terms, support, delete account
```

Every topic is one object in `src/topics-data.js`:

```js
{
  id: "vitamin-c-colds",
  claim: "Vitamin C prevents the common cold",
  verdict: "limited",        // strong | limited | unclear | contradicts
  short: "...",              // one-line answer shown on the Feed card
  explanation: "...",        // plain-language explanation
  limitations: "...",        // what the evidence can't tell us
  wouldChange: "...",        // what new evidence would change the conclusion
  caution: "...",            // optional safety note
  sources: [{ title, publisher, year, url }]
}
```

Each topic can also have `aliases` (other ways people search for it), `reviewedOn` (the date of its last full review) and a `type` on each source (such as "Meta-analysis"). The Feed, Fact Check, Quiz and Saved screens all read from this one file, so adding a topic means adding one object. `EVIDENCE_LEVELS` in `src/evidence-levels.js` turns each `verdict` into a label, a color, and a number of bars. The build checks every topic's `id` and `verdict` and stops if one is missing or repeated.

## How we use AI (full disclosure)

**What our team did:** we chose the topic and the features, chose the 20 claims and their sources, checked the explanations and ratings against those sources, ran and tested the app, and made the demo video.

**What AI (Claude, an AI assistant from Anthropic) helped with:**

- Turning the studies into plain-language explanations. Our team did not write every explanation by hand; AI helped draft them from the sources, and we check each one against its source. Every explanation links to the study it comes from.
- Drafting the short "Limitations" and "What would change this conclusion" notes on each topic. We check each note against its source.
- Planning the app, such as the React components, styling, and bug fixes. We run it, test it, and can explain how it works.
- Making the app icon artwork.
- Building a verification script that uses the PubMed API and Claude to ask whether a source supports an explanation. We built it but have **not** run it on our final topics, so all of our checking was done by hand.
- Writing version 2 code (shareable links, accounts, saved claims, search, the new quiz and the website) in pull requests that our team reviewed and tested before merging.

The finished app does not use AI while it runs. It contains no AI calls, only the text we published.

## Medical disclaimer

For education only. MedCheck is not medical advice. Talk to a doctor or pharmacist about your own health. Ratings reflect the sources linked on each topic's evidence page and may change as new research appears.

## Version 2.0

- Short video explainers for each topic
- Flags that tell us when new research appears on a topic we have already reviewed
- More topics, chosen by the people who use the app
