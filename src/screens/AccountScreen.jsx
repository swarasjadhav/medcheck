// Account: sign in, create an account, reset a password, sign out, delete the account,
// plus links about MedCheck. Uses Supabase email + password accounts.
import React, { useState } from "react";
import { ChevronRight, LogOut, Trash2, ExternalLink } from "lucide-react";
import { supabase, accountsEnabled } from "../lib/supabase.js";
import { WEBSITE_URL, publicOrigin } from "../config.js";
import { COLORS, SANS, SERIF, Disclaimer, ScreenTitle, SectionLabel, primaryButton, secondaryButton } from "../ui.jsx";

const MIN_PASSWORD = 8;

// Supabase's error messages, reworded for people.
function friendlyError(error) {
  const message = (error && error.message) || "Something went wrong. Please try again.";
  if (/invalid login credentials/i.test(message)) return "That email and password don't match. Try again or reset your password.";
  if (/email not confirmed/i.test(message)) return "Please confirm your email first. Check your inbox for the link we sent.";
  if (/already registered|already been registered/i.test(message)) return "There's already an account with that email. Try signing in instead.";
  if (/rate limit|too many/i.test(message)) return "Too many tries. Please wait a few minutes and try again.";
  if (/network|fetch/i.test(message)) return "Couldn't reach MedCheck. Check your internet connection.";
  return message;
}

const card = {
  background: COLORS.white,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 12,
  padding: "16px",
  marginBottom: 16,
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 10,
  border: `1px solid ${COLORS.border}`,
  fontFamily: SANS,
  fontSize: 16, // 16px stops iPhones from zooming in
  color: COLORS.dark,
  background: COLORS.white,
  marginBottom: 12,
};

const labelStyle = { display: "block", fontFamily: SANS, fontSize: 13, fontWeight: 600, color: COLORS.dark, marginBottom: 5 };

function Message({ kind, children }) {
  if (!children) return null;
  const color = kind === "error" ? COLORS.rust : COLORS.teal;
  return (
    <p role={kind === "error" ? "alert" : "status"} style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.5, color, margin: "0 0 12px" }}>
      {children}
    </p>
  );
}

function LegalLink({ path, children }) {
  if (!WEBSITE_URL) return null;
  return (
    <a href={`${WEBSITE_URL}${path}`} target="_blank" rel="noreferrer" style={{ color: COLORS.teal, fontWeight: 600 }}>
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Signed out: sign in, create account, forgot password
// ---------------------------------------------------------------------------

function SignInForms() {
  const [mode, setMode] = useState("signIn"); // signIn | signUp | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOldEnough, setIsOldEnough] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setNotice("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const cleanEmail = email.trim();
    if (!cleanEmail) return setError("Enter your email address.");

    if (mode === "signUp") {
      if (password.length < MIN_PASSWORD) return setError(`Use a password with at least ${MIN_PASSWORD} characters.`);
      if (!isOldEnough) return setError("You need to be 13 or older to create an account.");
    }
    if (mode === "signIn" && !password) return setError("Enter your password.");

    setBusy(true);
    try {
      if (mode === "signIn") {
        const { error: err } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (err) setError(friendlyError(err));
      } else if (mode === "signUp") {
        const { data, error: err } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${publicOrigin()}/account`,
            data: { confirmed_13_or_older: true },
          },
        });
        if (err) setError(friendlyError(err));
        else if (!data.session) {
          setNotice(`Almost done! We sent a link to ${cleanEmail}. Open it to confirm your account, then sign in here.`);
          setMode("signIn");
          setPassword("");
        }
      } else {
        const { error: err } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${publicOrigin()}/account/reset`,
        });
        if (err) setError(friendlyError(err));
        else setNotice(`If there's an account for ${cleanEmail}, we sent a link to reset your password.`);
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const titles = { signIn: "Sign in", signUp: "Create an account", forgot: "Reset your password" };
  const buttonText = { signIn: "Sign in", signUp: "Create account", forgot: "Send reset link" };

  return (
    <div style={card}>
      {mode !== "forgot" && (
        <div role="tablist" aria-label="Sign in or create an account" style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {["signIn", "signUp"].map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 999,
                border: `1.5px solid ${mode === m ? COLORS.dark : COLORS.border}`,
                background: mode === m ? COLORS.dark : COLORS.white,
                color: mode === m ? COLORS.bg : COLORS.dark,
                fontFamily: SANS,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {titles[m]}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} noValidate>
        {mode === "forgot" && (
          <h2 style={{ fontFamily: SERIF, fontSize: 18, color: COLORS.dark, margin: "0 0 12px" }}>{titles.forgot}</h2>
        )}
        <Message kind="error">{error}</Message>
        <Message kind="notice">{notice}</Message>

        <label htmlFor="account-email" style={labelStyle}>
          Email
        </label>
        <input
          id="account-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {mode !== "forgot" && (
          <>
            <label htmlFor="account-password" style={labelStyle}>
              Password{mode === "signUp" ? ` (at least ${MIN_PASSWORD} characters)` : ""}
            </label>
            <input
              id="account-password"
              type="password"
              autoComplete={mode === "signUp" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </>
        )}

        {mode === "signUp" && (
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontFamily: SANS, fontSize: 13.5, color: COLORS.body, lineHeight: 1.5, marginBottom: 14 }}>
            <input
              type="checkbox"
              checked={isOldEnough}
              onChange={(e) => setIsOldEnough(e.target.checked)}
              style={{ width: 18, height: 18, marginTop: 2, flexShrink: 0 }}
            />
            <span>
              I'm 13 or older
              {WEBSITE_URL && (
                <>
                  {" "}and I agree to the <LegalLink path="/terms">Terms</LegalLink> and{" "}
                  <LegalLink path="/privacy">Privacy Policy</LegalLink>
                </>
              )}
              .
            </span>
          </label>
        )}

        <button type="submit" disabled={busy} style={{ ...primaryButton, width: "100%", opacity: busy ? 0.6 : 1 }}>
          {busy ? "Please wait…" : buttonText[mode]}
        </button>
      </form>

      <div style={{ marginTop: 12, textAlign: "center" }}>
        {mode === "forgot" ? (
          <button onClick={() => switchMode("signIn")} style={linkButton}>
            Back to sign in
          </button>
        ) : (
          <button onClick={() => switchMode("forgot")} style={linkButton}>
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
}

const linkButton = {
  background: "none",
  border: "none",
  padding: 6,
  cursor: "pointer",
  fontFamily: SANS,
  fontSize: 13.5,
  fontWeight: 600,
  color: COLORS.teal,
};

// ---------------------------------------------------------------------------
// After opening a password-reset link
// ---------------------------------------------------------------------------

function NewPasswordForm({ onDone }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (password.length < MIN_PASSWORD) return setError(`Use a password with at least ${MIN_PASSWORD} characters.`);
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(friendlyError(err));
    else onDone();
  };

  return (
    <form onSubmit={submit} style={card} noValidate>
      <h2 style={{ fontFamily: SERIF, fontSize: 18, color: COLORS.dark, margin: "0 0 12px" }}>Choose a new password</h2>
      <Message kind="error">{error}</Message>
      <label htmlFor="new-password" style={labelStyle}>
        New password (at least {MIN_PASSWORD} characters)
      </label>
      <input
        id="new-password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button type="submit" disabled={busy} style={{ ...primaryButton, width: "100%", opacity: busy ? 0.6 : 1 }}>
        {busy ? "Saving…" : "Save new password"}
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Signed in
// ---------------------------------------------------------------------------

function SignedIn({ user, savedCount, onAccountDeleted }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signOut = async () => {
    setError("");
    const { error: err } = await supabase.auth.signOut();
    if (err) setError(friendlyError(err));
  };

  const deleteAccount = async () => {
    setBusy(true);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session && data.session.access_token;
      if (!token) throw new Error("Please sign in again, then try deleting your account.");
      const response = await fetch(`${publicOrigin()}/api/delete-account`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Couldn't delete your account. Please try again.");
      await supabase.auth.signOut({ scope: "local" });
      onAccountDeleted();
    } catch (err) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <div style={card}>
      <SectionLabel>Signed in as</SectionLabel>
      <p style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: COLORS.dark, margin: "0 0 4px", wordBreak: "break-all" }}>
        {user.email}
      </p>
      <p style={{ fontFamily: SANS, fontSize: 13.5, color: COLORS.muted, margin: "0 0 16px" }}>
        {savedCount === 1 ? "1 saved claim" : `${savedCount} saved claims`} in your account
      </p>
      <Message kind="error">{error}</Message>
      <button onClick={signOut} style={{ ...secondaryButton, width: "100%", marginBottom: 10 }}>
        <LogOut size={15} aria-hidden="true" /> Sign out
      </button>

      {!confirming ? (
        <button onClick={() => setConfirming(true)} style={{ ...linkButton, color: COLORS.rust, width: "100%" }}>
          Delete my account
        </button>
      ) : (
        <div role="alertdialog" aria-labelledby="delete-title" aria-describedby="delete-text" style={{ marginTop: 8, padding: 14, borderRadius: 10, background: "#FDF1EA", border: "1px solid #E8B892" }}>
          <h2 id="delete-title" style={{ fontFamily: SERIF, fontSize: 16, color: COLORS.dark, margin: "0 0 6px" }}>
            Delete your account?
          </h2>
          <p id="delete-text" style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.5, color: COLORS.body, margin: "0 0 12px" }}>
            This permanently deletes your account, your email address and your saved claims. It can't be undone.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setConfirming(false)} disabled={busy} style={{ ...secondaryButton, flex: 1 }}>
              Cancel
            </button>
            <button
              onClick={deleteAccount}
              disabled={busy}
              style={{ ...primaryButton, flex: 1, background: COLORS.rust, opacity: busy ? 0.6 : 1 }}
            >
              <Trash2 size={15} aria-hidden="true" /> {busy ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// About links (always shown)
// ---------------------------------------------------------------------------

function AboutLinks({ onOpenHowWeRate }) {
  const row = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "13px 2px",
    background: "none",
    border: "none",
    borderBottom: `1px solid ${COLORS.border}`,
    fontFamily: SANS,
    fontSize: 14.5,
    color: COLORS.dark,
    textDecoration: "none",
    cursor: "pointer",
    textAlign: "left",
  };
  const external = [
    ["/privacy", "Privacy policy"],
    ["/terms", "Terms of use"],
    ["/support", "Help and contact"],
  ];
  return (
    <div>
      <SectionLabel>About MedCheck</SectionLabel>
      <button onClick={onOpenHowWeRate} style={row}>
        How we rate evidence <ChevronRight size={16} color={COLORS.muted} aria-hidden="true" />
      </button>
      {WEBSITE_URL &&
        external.map(([path, label]) => (
          <a key={path} href={`${WEBSITE_URL}${path}`} target="_blank" rel="noreferrer" style={row}>
            {label}
            <ExternalLink size={15} color={COLORS.muted} aria-hidden="true" />
            <span className="sr-only">(opens in a new window)</span>
          </a>
        ))}
      <Disclaimer />
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function AccountScreen({ auth, savedCount, onOpenHowWeRate }) {
  const [deleted, setDeleted] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const { user, ready, recovering, finishRecovery } = auth;

  let body;
  if (!accountsEnabled) {
    body = (
      <div style={card}>
        <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.6, color: COLORS.body, margin: 0 }}>
          Accounts are coming soon. For now, your saved claims are kept on this device.
        </p>
      </div>
    );
  } else if (!ready) {
    body = <p style={{ fontFamily: SANS, color: COLORS.muted }}>Loading…</p>;
  } else if (recovering && user) {
    body = (
      <NewPasswordForm
        onDone={() => {
          setPasswordChanged(true);
          finishRecovery();
        }}
      />
    );
  } else if (user) {
    body = (
      <>
        <Message kind="notice">{passwordChanged ? "Your new password is saved." : ""}</Message>
        <SignedIn user={user} savedCount={savedCount} onAccountDeleted={() => setDeleted(true)} />
      </>
    );
  } else {
    body = (
      <>
        <Message kind="notice">{deleted ? "Your account and saved claims were deleted." : ""}</Message>
        <SignInForms />
      </>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", background: COLORS.bg, padding: "20px 20px 28px" }}>
      <ScreenTitle
        title="Account"
        subtitle={accountsEnabled ? "An account keeps your saved claims on all your devices. It's optional." : undefined}
      />
      {body}
      <AboutLinks onOpenHowWeRate={onOpenHowWeRate} />
    </div>
  );
}
