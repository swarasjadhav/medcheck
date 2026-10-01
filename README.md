# MedCheck — Working Prototype

This is a complete, runnable React app: scrolling feed, fact-check search,
myth-or-fact quiz, and a source/evidence page, all wired to your 20 real
researched topics.

## Run it (do this tonight)

**1. Check you have Node.js installed:**
```bash
node -v
```
If that errors or shows a version below 18, install Node.js LTS from
nodejs.org first (just click through the installer, defaults are fine).

**2. Open a terminal in this folder** (the one with `package.json` in it),
then run:
```bash
npm install
```
This downloads React and the icon library the app uses. Takes a minute or two.

**3. Start it:**
```bash
npm run dev
```
Terminal will print a local address, something like:
```
Local:   http://localhost:5173/
```
Open that link in your browser. The app should load with the dark feed
screen first.

**4. Click through all 4 tabs** (Feed, Fact Check, Quiz, Sources) to confirm
everything works before tomorrow.

## If something goes wrong

- **"command not found: npm"** — Node.js isn't installed, or your terminal
  needs restarting after installing it.
- **A red error screen in the browser** — copy the exact error text; it's
  almost always a typo in one of the three source files (App.jsx,
  QuizScreen.jsx, topics-data.js) if you've edited them.
- **Blank white page, no error** — open the browser's developer console
  (F12 or right-click → Inspect → Console tab) and check for an error there.

## What's in here
- `src/App.jsx` — the whole app shell: feed, fact-check search, source page
- `src/QuizScreen.jsx` — the myth-or-fact quiz, linked to real topics
- `src/topics-data.js` — your 20 researched topics with real sources
- `src/main.jsx`, `src/index.css`, `index.html` — boilerplate, you shouldn't
  need to touch these

## For tomorrow's TACC workshop
Bring this folder on your laptop, already run `npm install` once beforehand
if you can (so you're not waiting on a download on workshop wifi). If
someone there asks about your tech stack: React (via Vite), with topic data
and an AI verification pipeline (separate — see the medcheck-verifier
folder from earlier) checking that written claims are backed by real PubMed
sources before publishing.

## Strongly recommended before/at the workshop: push this to GitHub
The Congressional App Challenge submission needs a code repository link.
Do this once, tonight if you can:
```bash
git init
git add .
git commit -m "Initial MedCheck prototype"
```
Then create a new empty repo on github.com, and follow the commands GitHub
shows you under "...or push an existing repository from the command line."
Workshop staff tomorrow can also help with this if you get stuck.
