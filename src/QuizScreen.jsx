import React, { useState } from "react";
import { Check, X, RotateCcw, ArrowRight } from "lucide-react";

const COLORS = {
  bg: "#FAF8F4",
  dark: "#1A2E35",
  teal: "#2D7D6E",
  rust: "#C4571F",
  blue: "#4A6FA5",
  muted: "#8B8378",
  border: "#E4DFD6",
};

// Quiz questions reference real topic ids from topics-data.js so
// "See full evidence" opens the actual sourced page, not a dead link.
const QUIZ_QUESTIONS = [
  {
    id: "q1",
    statement: "Exercise can meaningfully help treat depression.",
    correctAnswer: "fact",
    explanation:
      "A 2024 meta-analysis of randomized controlled trials found exercise meaningfully reduces depressive symptoms — this is genuinely well-supported.",
    relatedTopicId: "exercise-depression",
  },
  {
    id: "q2",
    statement: "The MMR vaccine causes autism.",
    correctAnswer: "myth",
    explanation:
      "A Danish cohort study of over 657,000 children and a 2026 WHO evidence review both found no causal link between the MMR vaccine and autism.",
    relatedTopicId: "mmr-vaccine-autism",
  },
  {
    id: "q3",
    statement: "Antibiotics can effectively treat a cold or the flu.",
    correctAnswer: "myth",
    explanation:
      "Antibiotics only work on bacteria. Colds and flu are viral, so antibiotics don't help — and a Cochrane review found no benefit from using them for colds.",
    relatedTopicId: "antibiotics-cold-flu",
  },
  {
    id: "q4",
    statement: "Kids who spend more time outdoors are less likely to become nearsighted.",
    correctAnswer: "fact",
    explanation:
      "A randomized trial in China found kids who got 40 extra minutes outside daily had meaningfully lower rates of myopia after 3 years.",
    relatedTopicId: "outdoor-time-myopia",
  },
  {
    id: "q5",
    statement: "Cracking your knuckles causes arthritis.",
    correctAnswer: "myth",
    explanation:
      "Studies comparing habitual knuckle-crackers to non-crackers find no increased risk of hand osteoarthritis.",
    relatedTopicId: "knuckle-cracking-arthritis",
  },
  {
    id: "q6",
    statement: "Sugar causes hyperactivity in children.",
    correctAnswer: "myth",
    explanation:
      "At least 12 double-blind randomized trials found no link — including in kids with ADHD. The effect seems to come from parental expectation, not sugar.",
    relatedTopicId: "sugar-hyperactivity",
  },
];

function ResultBanner({ isCorrect }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 10,
        background: isCorrect ? "#2D7D6E1A" : "#C4571F1A",
        marginBottom: 14,
      }}
    >
      {isCorrect ? (
        <Check size={18} color={COLORS.teal} strokeWidth={2.5} />
      ) : (
        <X size={18} color={COLORS.rust} strokeWidth={2.5} />
      )}
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: isCorrect ? COLORS.teal : COLORS.rust,
        }}
      >
        {isCorrect ? "Correct!" : "Not quite"}
      </span>
    </div>
  );
}

export default function QuizScreen({ onOpenTopic, topics = [] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZ_QUESTIONS[index];
  const isAnswered = selected !== null;
  const isCorrect = isAnswered && selected === question.correctAnswer;

  function handleAnswer(choice) {
    if (isAnswered) return;
    setSelected(choice);
    if (choice === question.correctAnswer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (index + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function handleRestart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  function handleSeeEvidence() {
    if (!question.relatedTopicId) return;
    const fullTopic = topics.find((t) => t.id === question.relatedTopicId);
    if (fullTopic) onOpenTopic(fullTopic);
  }

  if (finished) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 28px",
          background: COLORS.bg,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.3,
            color: COLORS.muted,
            marginBottom: 8,
          }}
        >
          QUIZ COMPLETE
        </div>
        <h2
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 30,
            fontWeight: 600,
            color: COLORS.dark,
            margin: "0 0 6px",
          }}
        >
          {score} / {QUIZ_QUESTIONS.length}
        </h2>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: COLORS.muted,
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          {score === QUIZ_QUESTIONS.length
            ? "Perfect score — you're spotting evidence-backed claims well."
            : "Review the topics you missed in the Fact Check tab to see the full sources."}
        </p>
        <button
          onClick={handleRestart}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: COLORS.dark,
            color: COLORS.bg,
            border: "none",
            borderRadius: 999,
            padding: "11px 22px",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <RotateCcw size={15} />
          Try again
        </button>
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
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", gap: 5, marginBottom: 20 }}>
        {QUIZ_QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= index ? COLORS.teal : COLORS.border,
            }}
          />
        ))}
      </div>

      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.3,
          color: COLORS.muted,
          marginBottom: 10,
        }}
      >
        MYTH OR FACT — QUESTION {index + 1} OF {QUIZ_QUESTIONS.length}
      </div>

      <h2
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: 22,
          fontWeight: 600,
          color: COLORS.dark,
          lineHeight: 1.4,
          margin: "0 0 24px",
        }}
      >
        "{question.statement}"
      </h2>

      {!isAnswered && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => handleAnswer("myth")}
            style={{
              flex: 1,
              padding: "16px 0",
              borderRadius: 12,
              border: `1.5px solid ${COLORS.rust}`,
              background: "#fff",
              color: COLORS.rust,
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Myth
          </button>
          <button
            onClick={() => handleAnswer("fact")}
            style={{
              flex: 1,
              padding: "16px 0",
              borderRadius: 12,
              border: `1.5px solid ${COLORS.teal}`,
              background: "#fff",
              color: COLORS.teal,
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Fact
          </button>
        </div>
      )}

      {isAnswered && (
        <div>
          <ResultBanner isCorrect={isCorrect} />
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              lineHeight: 1.6,
              color: "#33302A",
              margin: "0 0 20px",
            }}
          >
            {question.explanation}
          </p>

          <div style={{ display: "flex", gap: 10, paddingBottom: 20 }}>
            {question.relatedTopicId && (
              <button
                onClick={handleSeeEvidence}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 999,
                  border: `1.5px solid ${COLORS.border}`,
                  background: "#fff",
                  color: COLORS.dark,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                See full evidence
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "12px 0",
                borderRadius: 999,
                border: "none",
                background: COLORS.dark,
                color: COLORS.bg,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {index + 1 >= QUIZ_QUESTIONS.length ? "See results" : "Next"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
