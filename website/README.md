# MedCheck website

Plain HTML and CSS, no build step. This is the public site for MedCheck: the home page, privacy policy, terms, help page and account-deletion page that the App Store and Google Play ask for.

| Page | Address after deploy |
| --- | --- |
| `index.html` | `/` |
| `privacy.html` | `/privacy` |
| `terms.html` | `/terms` |
| `support.html` | `/support` |
| `delete-account.html` | `/delete-account` |

## Before you publish

1. Replace every `team-email@example.com` with your real team email. Check with:
   `grep -rn "example.com" website/` (it should print nothing).
2. Have a parent, teacher or adviser read `privacy.html` and `terms.html`.
3. When the store listings go live, replace the two "Coming soon" lines in `index.html` with the store links.

## Preview on your computer

```bash
cd website
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy on Vercel (a second project from the same repo)

1. Vercel → Add New → Project → import `swarasjadhav/medcheck` again.
2. Project name: `medcheck-website`. Root Directory: `website`. Framework Preset: Other. Leave the build command empty.
3. Deploy. `vercel.json` in this folder turns on clean addresses, so `privacy.html` is served at `/privacy`.
4. In the **app** project on Vercel, set `VITE_WEBSITE_URL` to this site's address and redeploy, so the app's Account screen links here.
