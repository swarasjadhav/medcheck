# MedCheck

**MedCheck helps people check whether a health claim is actually backed by evidence.**

A short-form, swipe-through app for teens and adults who see health claims on social media. Instead of a simple "true" or "false," MedCheck shows *how strong* the evidence is and links every claim to the real studies behind it.

Built for the 2026 Congressional App Challenge, Texas's 21st District.

- **Team:** Swara Jadhav, Revanth [last name], Sragvi [last name] ([school])
- **Demo video:** [paste your YouTube link here]
- **Live app (optional):** [paste your Vercel link here, or delete this line]

## Why we built it

Health myths spread fast online, and most posts show no source. Most fact-checking tools say only true or false, but evidence has shades: some claims are well supported, some are supported only a little, and some have never been properly tested.

[Add one or two sentences from your own "inspiration" answer here.]

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

**What our team did:** we chose the topic and the features, wrote the explanation for every topic, chose the sources, ran and tested the app, and made the demo video.

**What Claude (an AI assistant from Anthropic) helped with:**

- Planning the app and writing much of the code, such as the React components, styling, and bug fixes. We run it, test it, and can explain how it works.
- Drafting the short "Limitations" and "What would change this conclusion" notes on each topic, based on our explanations and sources. We check each note against its source.
- Making the app icon artwork.
- Building a verification script that uses the PubMed API and Claude to ask whether a source supports an explanation. We built it but have **not** run it on our final topics, so all of our checking was done by hand.
- Helping prepare our demo slides, video script, screen-recording edit, and this README.

The finished app does not use AI while it runs. It contains no AI calls, only the text we published.

## Medical disclaimer

For education only. MedCheck is not medical advice. Talk to a doctor or pharmacist about your own health. Ratings reflect the sources linked on each topic's evidence page and may change as new research appears.

## Version 2.0

- Short video explainers for each topic
- Flags that tell us when new research appears on a topic we have already reviewed
- More topics, chosen by the people who use the app

<!-- If you add the verifier folder to this repo, add a line under "How the code is organized" describing it. -->
