// Quiz: "How strong is the evidence?" for six random claims.
// Matches the app's idea: claims aren't just true or false, the evidence has a strength.
import React, { useEffect, useState } from "react";
import { Check, X, RotateCcw, ArrowRight } from "lucide-react";
import { EVIDENCE_LEVELS, LEVEL_ORDER } from "../evidence-levels.js";
import { COLORS, SANS, SERIF, ClaimRow, SectionLabel, primaryButton, secondaryButton } from "../ui.jsx";

const QUESTIONS_PER_ROUND = 6;

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// One claim from each rating, then random others, in random order.
function pickRound(topics) {
  const shuffled = shuffle(topics);
  const picked = [];
  for (const level of LEVEL_ORDER) {
    const match = shuffled.find((t) => t.verdict === level && !picked.includes(t));
    if (match) picked.push(match);
  }
  for (const t of shuffled) {
    if (picked.length >= QUESTIONS_PER_ROUND) break;
    if (!picked.includes(t)) picked.push(t);
  }
  return shuffle(picked.slice(0, QUESTIONS_PER_ROUND));
}

function Feedback({ answer, correct }) {
  const isRight = answer === correct;
  const distance = Math.abs(LEVEL_ORDER.indexOf(answer) - LEVEL_ORDER.indexOf(correct));
  const close = !isRight && distance === 1;
  const color = isRight ? COLORS.teal : close ? "#4A6FA5" : COLORS.rust;
  const heading = isRight ? "Correct!" : close ? "Close!" : "Not quite";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 10,
        background: `${color}1A`,
        marginBottom: 14,
        fontFamily: SANS,
        fontSize: 14,
        color,
      }}
    >
      {isRight ? <Check size={18} strokeWidth={2.5} aria-hidden="true" /> : <X size={18} strokeWidth={2.5} aria-hidden="true" />}
      <span>
        <strong>{heading}</strong> {isRight ? "" : `It's rated ${EVIDENCE_LEVELS[correct].label.toLowerCase()}.`}
      </span>
    </div>
  );
}

// Kept outside the component so "See full evidence" → Back returns to the same question.
let lastQuiz = null;

export default function QuizScreen({ topics, onOpenTopic }) {
  const [round, setRound] = useState(() => (lastQuiz ? lastQuiz.round : pickRound(topics)));
  const [index, setIndex] = useState(() => (lastQuiz ? lastQuiz.index : 0));
  const [answers, setAnswers] = useState(() => (lastQuiz ? lastQuiz.answers : [])); // the level picked for each question

  useEffect(() => {
    lastQuiz = { round, index, answers };
  }, [round, index, answers]);

  const finished = index >= round.length;
  const topic = round[index];
  const answer = answers[index];
  const score = answers.filter((a, i) => round[i] && a === round[i].verdict).length;

  const restart = () => {
    setRound(pickRound(topics));
    setIndex(0);
    setAnswers([]);
  };

  if (finished) {
    const missed = round.filter((t, i) => answers[i] !== t.verdict);
    return (
      <div style={{ flex: 1, overflowY: "auto", background: COLORS.bg, padding: "28px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <SectionLabel>Quiz complete</SectionLabel>
          <h1 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, color: COLORS.dark, margin: "0 0 6px" }}>
            {score} / {round.length}
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 14, color: COLORS.muted, margin: "0 0 18px", lineHeight: 1.5 }}>
            {score === round.length
              ? "Perfect! You can tell strong evidence from weak evidence."
              : "Judging evidence takes practice. Open the claims below to see why each got its rating."}
          </p>
          <button onClick={restart} style={primaryButton}>
            <RotateCcw size={15} aria-hidden="true" />
            Play again
          </button>
        </div>
        {missed.length > 0 && (
          <>
            <SectionLabel>Review the ones you missed</SectionLabel>
            {missed.map((t) => (
              <ClaimRow key={t.id} topic={t} onOpen={onOpenTopic} />
            ))}
          </>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: COLORS.bg,
        padding: "20px 20px 0",
        overflowY: "auto",
      }}
    >
      <h1 className="sr-only">Quiz: how strong is the evidence?</h1>
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={round.length}
        aria-valuenow={index + 1}
        style={{ display: "flex", gap: 5, marginBottom: 20 }}
      >
        {round.map((t, i) => (
          <div
            key={t.id}
            style={{ flex: 1, height: 4, borderRadius: 2, background: i <= index ? COLORS.teal : COLORS.border }}
          />
        ))}
      </div>

      <SectionLabel style={{ marginBottom: 10 }}>
        How strong is the evidence? · Question {index + 1} of {round.length}
      </SectionLabel>

      <h2 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: COLORS.dark, lineHeight: 1.4, margin: "0 0 20px" }}>
        "{topic.claim}"
      </h2>

      <div role="group" aria-label="Pick a rating" style={{ display: "grid", gap: 10, marginBottom: 18 }}>
        {LEVEL_ORDER.map((level) => {
          const info = EVIDENCE_LEVELS[level];
          const chosen = answer === level;
          const isCorrect = answer && level === topic.verdict;
          return (
            <button
              key={level}
              onClick={() => !answer && setAnswers((a) => [...a.slice(0, index), level])}
              disabled={Boolean(answer)}
              aria-pressed={chosen}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 16px",
                borderRadius: 12,
                border: `1.5px solid ${isCorrect ? info.color : chosen ? COLORS.dark : COLORS.border}`,
                background: isCorrect ? `${info.color}14` : COLORS.white,
                color: info.text,
                fontFamily: SANS,
                fontSize: 15,
                fontWeight: 700,
                cursor: answer ? "default" : "pointer",
                opacity: answer && !isCorrect && !chosen ? 0.55 : 1,
              }}
            >
              {info.label}
              <span aria-hidden="true" style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 6,
                      height: 16 - i * 3,
                      alignSelf: "flex-end",
                      borderRadius: 2,
                      background: i < info.value ? info.color : COLORS.border,
                    }}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div role="status" aria-live="polite">
        {answer && (
          <div>
            <Feedback answer={answer} correct={topic.verdict} />
            <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.6, color: COLORS.body, margin: "0 0 20px" }}>
              {topic.short}
            </p>
          </div>
        )}
      </div>

      {answer && (
        <div style={{ display: "flex", gap: 10, paddingBottom: 20 }}>
          <button onClick={() => onOpenTopic(topic)} style={{ ...secondaryButton, flex: 1, fontSize: 13 }}>
            See full evidence
          </button>
          <button onClick={() => setIndex((i) => i + 1)} style={{ ...primaryButton, flex: 1, fontSize: 13 }}>
            {index + 1 >= round.length ? "See results" : "Next"}
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
