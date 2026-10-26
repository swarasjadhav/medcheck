# MedCheck

**MedCheck helps people check whether a health claim is actually backed by evidence.**

A short-form, swipe-through app for teens and adults who see health claims on social media. Instead of a simple "true" or "false," MedCheck shows *how strong* the evidence is and links every claim to the real studies behind it.

Built for the 2026 Congressional App Challenge, Texas's 21st District.

- **Team:** Swara Jadhav, Revanth Movva, Sragvi Madishetty (Ronald Reagan High School)
- **Demo video:** https://www.youtube.com/watch?v=zVCDjAjTWhs
- **Live app:** https://medcheck-steel.vercel.app

## Why we built it

Nowadays, health information spreads faster than ever online, but the evidence behind it often gets lost. A confident-looking video or post can reach thousands of people without showing where the claim came from, and many existing fact-checking tools reduce complicated scientific questions to a simple “true” or “false.”

We were inspired by how often we saw health claims online that sounded convincing but were difficult to verify without digging through dense research papers ourselves. We wanted to make that process easier for everyone by creating a tool that does more than label a claim. It shows how strong the evidence is, where it comes from, and why the conclusion may change as new research emerges. Our goal is to give people the tools to make informed health decisions based on evidence, not on how convincing or popular a claim appears online.

## What the app does

- **Feed:** one claim at a time, with a short answer and an evidence meter.
- **Evidence page:** a plain-language explanation, its limitations, what new evidence would change the conclusion, and the real sources (publisher, year, link).
- **Fact Check:** search all 20 reviewed topics. If a claim has not been reviewed, the app says so instead of guessing, and links to a PubMed search.
- **Quiz:** six myth-or-fact questions. After each answer, one tap opens the full evidence for that topic.
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

These are open-source tools (React and Vite are MIT licensed, lucide-react is ISC, and both fonts use the SIL Open Font License). MedCheck has no backend, no accounts, and collects no user data. All content lives in one file, `src/topics-data.js`.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address it prints, usually http://localhost:5173.

To make a production build: `npm run build`.

## How the code is organized

```
src/
  App.jsx          App shell: Feed, Fact Check, evidence page, evidence meter
  QuizScreen.jsx   Myth-or-fact quiz, linked to the topics
  topics-data.js   All 20 topics, ratings, and sources
  main.jsx         Entry point
  index.css        Base styles
public/            App icons and manifest
index.html         Page shell and fonts
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

The Feed, Fact Check, and Quiz all read from this one file, so adding a topic means adding one object. `EVIDENCE_LEVELS` in `App.jsx` turns each `verdict` into a label, a color, and a number of bars. Each quiz question stores a `relatedTopicId`, and `topics.find()` looks up the full topic so the quiz can open its sources.

## How we use AI (full disclosure)

**What our team did:** we chose the topic and the features, chose the 20 claims and their sources, checked the explanations and ratings against those sources, ran and tested the app, and made the demo video.

**What AI (Claude, an AI assistant from Anthropic) helped with:**

- Turning the studies into plain-language explanations. Our team did not write every explanation by hand; AI helped draft them from the sources, and we check each one against its source. Every explanation links to the study it comes from.
- Drafting the short "Limitations" and "What would change this conclusion" notes on each topic. We check each note against its source.
- Planning the app, such as the React components, styling, and bug fixes. We run it, test it, and can explain how it works.
- Making the app icon artwork.
- Building a verification script that uses the PubMed API and Claude to ask whether a source supports an explanation. We built it but have **not** run it on our final topics, so all of our checking was done by hand.

The finished app does not use AI while it runs. It contains no AI calls, only the text we published.

## Medical disclaimer

For education only. MedCheck is not medical advice. Talk to a doctor or pharmacist about your own health. Ratings reflect the sources linked on each topic's evidence page and may change as new research appears.

## Version 2.0

- Short video explainers for each topic
- Flags that tell us when new research appears on a topic we have already reviewed
- More topics, chosen by the people who use the app
