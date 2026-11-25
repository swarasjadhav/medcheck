// Settings that differ between the live site, Vercel previews and the phone apps.
// Set them in Vercel (Project → Settings → Environment Variables) and in a
// .env.local file on your laptop. See .env.example for the full list.
const env = import.meta.env;

// Supabase (accounts and saved claims). If these are empty, the app still works:
// sign-in is hidden and saved claims stay on the device.
export const SUPABASE_URL = env.VITE_SUPABASE_URL || "";
export const SUPABASE_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || "";

// The public address of the web app. Shared links, emails and the phone apps use it.
export const SITE_URL = (env.VITE_SITE_URL || "https://medcheck-steel.vercel.app").replace(/\/+$/, "");

// The MedCheck website (privacy policy, terms, support). Links to it are hidden until it's set.
export const WEBSITE_URL = (env.VITE_WEBSITE_URL || "").replace(/\/+$/, "");

// True inside the iPhone or Android app built with Capacitor.
export function isNativeApp() {
  const cap = typeof window !== "undefined" ? window.Capacitor : undefined;
  return Boolean(cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform());
}

// The address that links and API calls should use. On the live site or a preview
// it's that site. In the phone apps, and on a laptop running `npm run dev`, the page
// isn't served from a public address, so it's SITE_URL.
export function publicOrigin() {
  const { protocol, hostname, origin } = window.location;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  if ((protocol === "https:" || protocol === "http:") && !isLocal && !isNativeApp()) {
    return origin;
  }
  return SITE_URL;
}
