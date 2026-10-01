# MedCheck — Working Prototype

This is a complete, runnable React app: scrolling feed, fact-check search,
myth-or-fact quiz, and a source/evidence page, all wired to your 20 real
researched topics.

## What's in here
- `src/App.jsx` — the whole app shell: feed, fact-check search, source page
- `src/QuizScreen.jsx` — the myth-or-fact quiz, linked to real topics
- `src/topics-data.js` — your 20 researched topics with real sources
- `src/main.jsx`, `src/index.css`, `index.html` — boilerplate, you shouldn't
  need to touch these

## TACC workshop
Bring this folder on your laptop, already run `npm install` once beforehand
if you can (so you're not waiting on a download on workshop wifi). If
someone there asks about your tech stack: React (via Vite), with topic data
and an AI verification pipeline (separate — see the medcheck-verifier
folder from earlier) checking that written claims are backed by real PubMed
sources before publishing.


```bash
git init
git add .
git commit -m "Initial MedCheck prototype"
```
