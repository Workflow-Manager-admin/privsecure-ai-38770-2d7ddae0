import React, { useState } from "react";

/**
 * Digital Twin Scanner
 * - Shows AI scan summary on identity misuse (mocked/fake detection highlights)
 * - Stylometric analysis of writing style (simulated comparison/results)
 * - Result cards for matches with 'Report' and 'Mark Safe' actions
 * - Fully integrates with PrivSecure AI theme and "widget" layout
 */

// Mock: AI Scan Summary data
const aiScanSummary = {
  fakeProfiles: 2,
  reusedPhotos: 1,
  voiceImpersonations: 1,
  details: [
    {
      type: "Fake Profile",
      summary: "Detected patterns consistent with AI-generated/copycat social profile identities using your photo and name.",
    },
    {
      type: "Reused Photo",
      summary: "Public web profile found reusing your facial photo.",
    },
    {
      type: "Voice",
      summary:
        "Audio samples online show speech patterns close to yours, suggesting a possible voice clone attempt.",
    },
  ],
};

// Mock: Stylometric Analysis (Writing Style) Result
const stylometry = {
  overallLikelihood: "High",
  similarityScore: 92,
  suspectedProfiles: [
    {
      handle: "@copypersonaX",
      similarity: 93,
      matchedTraits: [
        "Phrases",
        "Formal Tone",
        "Misspellings",
        "Signature Sign-off",
      ],
      sampleSnippet:
        "Thank you for your patience regarding this matter. Rest assured,...",
    },
    {
      handle: "@harmlessAI_2",
      similarity: 89,
      matchedTraits: ["Technical Lingo", "Sentence Length"],
      sampleSnippet:
        "Based on the data pipeline established, we can infer that...",
    },
  ],
  referenceTrait: "Known genuine samples from your email, forum posts, and chat logs were used for comparison. Top overlaps shown below.",
};

// Mock: Result Cards (Impersonation Matches)
const resultCards = [
  {
    id: "pfake1",
    title: "Impersonated Social Profile",
    platform: "LinkedIn",
    username: "Jonas.Kaplan (AI-generated)",
    evidence:
      "Name, company and profile photo match your real details. About section content rephrased with minor wording changes.",
    status: "High Risk",
    type: "Profile",
    similarity: 94,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg", // for illustration; ok to use static/fake
  },
  {
    id: "pvoice1",
    title: "Voice Clone Clip Found",
    platform: "Tiktok (Audio Meme)",
    username: "VoiceOfJonas",
    evidence:
      "Sampled speech is a close match to your recent call. Pitch and cadence analysis score: 88/100.",
    status: "Medium Risk",
    type: "Voice",
    similarity: 88,
    avatar: null,
  },
  {
    id: "ptext1",
    title: "Writing Style Copycat",
    platform: "Twitter",
    username: "@almostjonas",
    evidence:
      "Writing style matches key/unique phrases and sign-off used in your business emails. No photo reuse.",
    status: "Suspicious",
    type: "Stylometry",
    similarity: 84,
    avatar: null,
  },
];

// Helpers for theme variables (CSS custom props)
function getCssVar(name, fallback = "#0ff") {
  return (
    (typeof window !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(name)
      : "") || fallback
  );
}

// Theme accent chips & icons
function Pill({ label, color = "var(--border-color)" }) {
  return (
    <span
      style={{
        background: "rgba(255,255,255,0.06)",
        border: `1.1px solid ${color}`,
        borderRadius: 16,
        color: color,
        fontWeight: 600,
        fontSize: "0.93em",
        padding: "2.8px 14px",
        marginRight: 10,
        letterSpacing: ".01em",
        marginBottom: 3,
      }}
    >
      {label}
    </span>
  );
}
function CircleIcon({ icon, color }) {
  return (
    <span
      style={{
        width: 28,
        height: 28,
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,255,255,.1)",
        borderRadius: "50%",
        color: color,
        fontSize: "1.2rem",
        marginRight: 8,
        border: `1.3px solid ${color}`,
        boxShadow: `0 0 7px 0 ${color}60`,
      }}
      aria-hidden
    >
      {icon}
    </span>
  );
}

// Result card UI
function ResultCard({ card, onReport, onMarkSafe, markedSafe }) {
  const iconMap = {
    Profile: <CircleIcon icon="🕵️‍♂️" color="var(--primary)" />,
    Voice: <CircleIcon icon="🔊" color="#18ffe9" />,
    Stylometry: <CircleIcon icon="✍️" color="var(--secondary)" />,
  };
  return (
    <div
      className="result-card"
      tabIndex={0}
      aria-label={`Found: ${card.title}`}
      style={{
        background: "rgba(255,255,255, 0.035)",
        border: "1.6px solid var(--border-color)",
        borderRadius: 17,
        padding: "22px 20px",
        marginBottom: 21,
        boxShadow: "0 1px 8px #0112",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        opacity: markedSafe ? 0.6 : 1,
        filter: markedSafe ? "blur(0.4px) grayscale(0.45)" : "none",
        transition: "opacity 0.21s, filter 0.21s",
        position: "relative",
      }}
    >
      {/* Main row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        {card.avatar ? (
          <img
            src={card.avatar}
            alt="Profile avatar"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1.7px solid var(--primary)",
              marginRight: 6,
              boxShadow: "0 2px 10px #18eee6aa",
            }}
          />
        ) : (
          iconMap[card.type] || null
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "1.08em", color: "var(--primary)" }}>
            {card.title}
          </div>
          <div style={{ color: "var(--text-secondary)", fontSize: ".97em", fontWeight: 500 }}>
            <span>{card.platform}</span>
            {" · "}
            <span style={{ color: "var(--secondary)" }}>{card.username}</span>
          </div>
        </div>
        <Pill label={card.status} color="var(--secondary)" />
        <Pill label={`${card.similarity}% match`} color="var(--accent)" />
      </div>
      {/* Evidence */}
      <div style={{ color: "#b5fafd", fontSize: ".97em", marginTop: 5, lineHeight: 1.45 }}>
        {card.evidence}
      </div>
      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 12,
        }}
      >
        <button
          className="btn"
          onClick={onReport}
          disabled={markedSafe}
          style={{
            background: markedSafe ? "rgba(255,153,115,0.24)" : "var(--secondary)",
            color: "#001933",
            fontWeight: 700,
            borderRadius: 12,
            border: "none",
            boxShadow: "0 0.8px 6px 0 #0004",
            fontSize: "0.96em",
            padding: "7px 17px",
            opacity: markedSafe ? 0.64 : 1,
            cursor: markedSafe ? "default" : "pointer",
            transition: "background 0.18s, opacity 0.21s",
          }}
          aria-label="Report impersonation"
        >
          🚨 Report
        </button>
        <button
          className="btn"
          onClick={onMarkSafe}
          disabled={markedSafe}
          style={{
            background: markedSafe ? "#13a89a40" : "var(--accent)",
            color: "#002222",
            fontWeight: 600,
            borderRadius: 12,
            border: "none",
            boxShadow: "0 0.8px 6px 0 #0002",
            fontSize: "0.96em",
            padding: "7px 17px",
            opacity: markedSafe ? 0.55 : 1,
            cursor: markedSafe ? "default" : "pointer",
            transition: "background 0.18s, opacity 0.21s",
          }}
          aria-label="Mark as safe"
        >
          ✓ Mark Safe
        </button>
      </div>
      {markedSafe && (
        <div
          style={{
            position: "absolute",
            top: 9,
            right: 19,
            background: "#0ff2",
            color: "#157",
            fontWeight: 700,
            padding: "2px 11px",
            borderRadius: 8,
            fontSize: ".89em",
            opacity: 0.89,
            boxShadow: "0 1.2px 2px 0 #0002",
          }}
        >
          Marked Safe
        </div>
      )}
    </div>
  );
}

// Stylometric Analysis Section
function StylometryWidget({ stylometry }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255, 0.028)",
        borderRadius: 16,
        border: "1.3px solid var(--border-color)",
        marginBottom: 26,
        padding: "25px 19px",
        boxShadow: "0 0.5px 8px #0027",
      }}
    >
      <div
        style={{
          color: "var(--secondary)",
          fontWeight: 700,
          fontSize: "1.09em",
          marginBottom: 8,
          letterSpacing: ".018em",
        }}
      >
        ✍️ Stylometric Analysis (Writing Style)
      </div>
      <div style={{ marginBottom: 7, color: "#ccf8fe" }}>
        <span style={{ fontWeight: 600 }}>
          Imitation likelihood:&nbsp;
        </span>
        <span style={{ color: "var(--accent)", fontWeight: 700 }}>
          {stylometry.overallLikelihood} ({stylometry.similarityScore}%)&nbsp;
        </span>
        <span style={{ color: "var(--text-secondary)", fontSize: ".98em" }}>
          – Is your writing style being impersonated online?
        </span>
      </div>
      <div style={{ marginBottom: 7, color: "#aef" }}>
        {stylometry.referenceTrait}
      </div>
      <ul style={{ margin: "10px 0 0 0", paddingLeft: 0, listStyle: "none" }}>
        {stylometry.suspectedProfiles.map((p, idx) => (
          <li
            key={p.handle}
            style={{
              background: "rgba(40,255,255,0.06)",
              borderRadius: 11,
              marginBottom: 10,
              padding: "8px 11px 6px 11px",
              border: "1px solid var(--border-color)",
              color: "#cafff2",
            }}
          >
            <span style={{ color: "var(--primary)", fontWeight: 600 }}>{p.handle}</span>
            <span style={{ marginLeft: 13, color: "var(--secondary)", fontWeight: 700 }}>
              {p.similarity}% similarity
            </span>
            <div style={{ fontSize: ".97em", margin: "3.5px 0 0 0" }}>
              <span style={{ color: "var(--accent)" }}>Matched traits:</span>{" "}
              {p.matchedTraits.join(", ")}
            </div>
            <div
              style={{
                color: "#cbf",
                fontWeight: 500,
                marginTop: 5,
                paddingLeft: 7,
                fontStyle: "italic",
                fontSize: ".96em",
                borderLeft: "2.7px solid var(--primary)",
              }}
            >
              “{p.sampleSnippet}”
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// AI Scan Summary Section
function AIScanSummaryWidget({ summary }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255, 0.022)",
        borderRadius: 16,
        border: "1.35px solid var(--border-color)",
        marginBottom: 26,
        padding: "25px 19px 17px 19px",
        boxShadow: "0 0.5px 9px #0025",
      }}
    >
      <div
        style={{
          color: "var(--primary)",
          fontWeight: 700,
          fontSize: "1.12em",
          marginBottom: 8,
          letterSpacing: ".016em",
        }}
      >
        🤖 AI Misuse Scan Summary
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 9,
        }}
      >
        <Pill label={`Fake Profiles: ${summary.fakeProfiles}`} color="#ff6373" />
        <Pill label={`Reused Photos: ${summary.reusedPhotos}`} color="#ffc65f" />
        <Pill label={`Voice Clones: ${summary.voiceImpersonations}`} color="#13fff7" />
      </div>
      <ul style={{ margin: "0 0 0 0", paddingLeft: 10 }}>
        {summary.details.map((d) => (
          <li
            key={d.type}
            style={{
              color: "#b2ecff",
              marginBottom: 7,
              fontWeight: 510,
              fontSize: "0.99em",
            }}
          >
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
              {d.type}:
            </span>{" "}
            <span>{d.summary}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// PUBLIC_INTERFACE
function DigitalTwinScanner(props) {
  // Maintain state of which cards are marked safe
  const [safeIds, setSafeIds] = useState([]);

  // Handle Mark Safe and Report events (mock, just update UI)
  function handleMarkSafe(id) {
    setSafeIds((prev) => [...prev, id]);
  }
  function handleReport(id) {
    // Placeholder: could trigger a modal or notification (not needed here)
    window.alert("Report submitted! Our AI team will review this instance.");
  }

  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 240,
        width: "100%",
        padding: 0,
        background: "rgba(255,255,255,0.039)",
        boxShadow: "0 0 0 0 transparent",
        border: "1.6px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
      }}
      tabIndex={0}
      aria-label="Digital twin scanner widget"
    >
      {/* Section heading */}
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.17rem",
          color: "var(--primary)",
          textShadow: "0px 2px 10px #0ff2",
          letterSpacing: ".017em",
          padding: "23px 22px 5px 22px",
        }}
      >
        Digital Twin Scanner – AI Impersonation Threats
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.01em",
          fontWeight: 500,
          marginBottom: 13,
          padding: "0 22px 6px 22px",
        }}
      >
        Scan results for AI-based misuse, identity copycats, and online impostors. Review findings, compare writing style, and take action if a match is not safe.
      </div>

      {/* Main layout: summary, stylometry, result cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          width: "100%",
          padding: "0 12px 14px 12px",
        }}
      >
        <AIScanSummaryWidget summary={aiScanSummary} />
        <StylometryWidget stylometry={stylometry} />
        <div>
          <div
            style={{
              color: "#ffccee",
              fontWeight: 700,
              fontSize: "1.05em",
              margin: "8px 0 10px 7px",
              letterSpacing: ".017em",
              paddingLeft: 7,
            }}
          >
            Potential Impersonation Matches
          </div>
          {resultCards.map((card) => (
            <ResultCard
              key={card.id}
              card={card}
              onReport={() => handleReport(card.id)}
              onMarkSafe={() => handleMarkSafe(card.id)}
              markedSafe={safeIds.includes(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DigitalTwinScanner;
