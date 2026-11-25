// POST /api/delete-account
//
// Deletes the signed-in person's MedCheck account and everything tied to it.
// Saved claims are removed automatically because the saved_claims table uses
// "on delete cascade" (see supabase/schema.sql).
//
// This runs on Vercel's servers, not in the app, because deleting a user needs
// Supabase's SECRET key. Never put that key in the app or in any VITE_ variable.
//
// Vercel environment variables needed:
//   VITE_SUPABASE_URL      (already set for the app)
//   SUPABASE_SECRET_KEY    the sb_secret_... key from Supabase → Project Settings → API Keys
import { createClient } from "@supabase/supabase-js";

// The phone apps load from these addresses, so they need permission to call this.
const NATIVE_APP_ORIGINS = ["capacitor://localhost", "https://localhost", "http://localhost", "http://localhost:5173"];

function allowCors(req, res) {
  const origin = req.headers.origin;
  if (origin && NATIVE_APP_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  }
}

export default async function handler(req, res) {
  allowCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secretKey) {
    return res.status(500).json({ error: "Account deletion isn't set up yet. Please contact us." });
  }

  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Please sign in again, then try deleting your account." });

  const admin = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // Check the sign-in token, so people can only delete their own account.
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data || !data.user) {
    return res.status(401).json({ error: "Please sign in again, then try deleting your account." });
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
  if (deleteError) {
    console.error("delete-account failed", deleteError.message);
    return res.status(500).json({ error: "Couldn't delete your account. Please try again in a few minutes." });
  }

  return res.status(200).json({ deleted: true });
}
