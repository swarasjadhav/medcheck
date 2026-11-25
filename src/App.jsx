// The app shell: header, screens, tab bar, and moving between screens.
// Each screen lives in src/screens/. Shared UI is in src/ui.jsx.
import React, { useEffect, useState } from "react";
import { Home, FileSearch, HelpCircle, Bookmark, User } from "lucide-react";
import { TOPICS } from "./topics-data.js";
import { pathFor, parsePath } from "./routes.js";
import { useAuth } from "./lib/useAuth.js";
import { useSavedClaims } from "./lib/useSavedClaims.js";
import { COLORS, SANS, SERIF, Logo } from "./ui.jsx";
import FeedScreen from "./screens/FeedScreen.jsx";
import FactCheckScreen from "./screens/FactCheckScreen.jsx";
import ClaimScreen from "./screens/ClaimScreen.jsx";
import QuizScreen from "./screens/QuizScreen.jsx";
import SavedScreen from "./screens/SavedScreen.jsx";
import AccountScreen from "./screens/AccountScreen.jsx";
import HowWeRateScreen from "./screens/HowWeRateScreen.jsx";

const TABS = [
  { id: "feed", label: "Feed", Icon: Home },
  { id: "check", label: "Fact Check", Icon: FileSearch },
  { id: "quiz", label: "Quiz", Icon: HelpCircle },
  { id: "saved", label: "Saved", Icon: Bookmark },
];

const PAGE_TITLES = {
  feed: "MedCheck: what the evidence says about health claims",
  check: "Check a claim · MedCheck",
  quiz: "Quiz · MedCheck",
  saved: "Saved claims · MedCheck",
  account: "Account · MedCheck",
  howWeRate: "How we rate evidence · MedCheck",
};

function TabBar({ active, onChange }) {
  return (
    <nav aria-label="Main" className="tab-bar">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-current={isActive ? "page" : undefined}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "10px 0 12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? COLORS.teal : COLORS.muted,
            }}
          >
            <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden="true" />
            <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: isActive ? 700 : 500 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function App() {
  // The web address decides the first screen, so a shared link
  // like /claim/vitamin-c-colds opens straight to that claim.
  const [route, setRoute] = useState(() => parsePath(window.location.pathname));
  const [returnScreen, setReturnScreen] = useState("feed");

  const auth = useAuth();
  const saves = useSavedClaims(auth.user);

  const { screen, claimId } = route;
  const activeTopic = screen === "claim" ? TOPICS.find((t) => t.id === claimId) || null : null;

  // Switch screens and update the address bar to match.
  const go = (nextScreen, nextClaimId = null) => {
    if (screen !== "claim" && screen !== "howWeRate") setReturnScreen(screen);
    setRoute({ screen: nextScreen, claimId: nextClaimId });
    const path = pathFor(nextScreen, nextClaimId);
    if (path !== window.location.pathname) {
      window.history.pushState({ inApp: true }, "", path);
    }
  };

  const openTopic = (topic) => go("claim", topic.id);

  const goBack = () => {
    // Opened from inside the app: use the browser's history.
    // Opened from a shared link: there's nothing to go back to, so show where they came from.
    if (window.history.state && window.history.state.inApp) {
      window.history.back();
    } else {
      go(activeTopic || screen === "howWeRate" ? returnScreen : "feed");
    }
  };

  // Browser back/forward buttons.
  useEffect(() => {
    const onPopState = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // A password-reset email link opens the Account screen to choose a new password.
  useEffect(() => {
    if (auth.recovering && screen !== "account") go("account");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.recovering]);

  // Browser tab title.
  useEffect(() => {
    document.title = activeTopic
      ? `${activeTopic.claim}: what the evidence says · MedCheck`
      : PAGE_TITLES[screen] || PAGE_TITLES.feed;
  }, [screen, activeTopic]);

  const dark = screen === "feed";
  const activeTab = TABS.some((t) => t.id === screen) ? screen : screen === "claim" ? returnScreen : null;

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="app-header" style={{ background: dark ? COLORS.dark : COLORS.bg }}>
        <button
          onClick={() => go("feed")}
          aria-label="MedCheck home"
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <Logo size={24} />
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 16, color: dark ? COLORS.bg : COLORS.dark }}>
            MedCheck
          </span>
        </button>
        <button
          onClick={() => go("account")}
          aria-label={auth.user ? "Your account" : "Account and sign in"}
          aria-current={screen === "account" ? "page" : undefined}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: 999,
            border: `1px solid ${dark ? "rgba(250,248,244,0.35)" : COLORS.border}`,
            background: auth.user ? COLORS.teal : "none",
            color: auth.user || dark ? COLORS.bg : COLORS.dark,
            cursor: "pointer",
          }}
        >
          <User size={17} aria-hidden="true" />
        </button>
      </header>

      <main id="main" tabIndex={-1} className="app-main">
        {screen === "feed" && (
          <FeedScreen topics={TOPICS} onOpenTopic={openTopic} isSaved={saves.isSaved} onToggleSave={saves.toggle} />
        )}
        {screen === "check" && <FactCheckScreen topics={TOPICS} onOpenTopic={openTopic} />}
        {screen === "quiz" && <QuizScreen topics={TOPICS} onOpenTopic={openTopic} />}
        {screen === "saved" && (
          <SavedScreen
            topics={TOPICS}
            savedIds={saves.savedIds}
            onOpenTopic={openTopic}
            onToggleSave={saves.toggle}
            user={auth.user}
            syncError={saves.syncError}
            onGoToAccount={() => go("account")}
          />
        )}
        {screen === "account" && (
          <AccountScreen auth={auth} savedCount={saves.savedIds.length} onOpenHowWeRate={() => go("howWeRate")} />
        )}
        {screen === "howWeRate" && <HowWeRateScreen onBack={goBack} />}
        {screen === "claim" && (
          <ClaimScreen
            topic={activeTopic}
            onBack={activeTopic ? goBack : () => go("feed")}
            saved={activeTopic ? saves.isSaved(activeTopic.id) : false}
            onToggleSave={saves.toggle}
            onOpenHowWeRate={() => go("howWeRate")}
          />
        )}
      </main>

      <TabBar active={activeTab} onChange={(next) => go(next)} />
    </div>
  );
}
