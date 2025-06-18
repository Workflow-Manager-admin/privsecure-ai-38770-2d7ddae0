import React, { useState, useEffect } from "react";

/**
 * Mock static data for earned badges/XP/points.
 */
const MOCK_BADGES = [
  {
    id: "stealth-navigator",
    title: "Stealth Navigator",
    icon: "🕵️‍♂️",
    desc: "Browsed in incognito 7 days.",
    earned: true,
  },
  {
    id: "data-minimalist",
    title: "Data Minimalist",
    icon: "🍃",
    desc: "Revoked 5+ unused app permissions.",
    earned: true,
  },
  {
    id: "cookie-rebel",
    title: "Cookie Rebel",
    icon: "🍪",
    desc: "Blocked 10+ trackers.",
    earned: true,
  },
  {
    id: "leak-survivor",
    title: "Leak Survivor",
    icon: "🛡️",
    desc: "Detected & secured a dark web leak.",
    earned: true,
  },
  {
    id: "ghost-mode",
    title: "Ghost Mode",
    icon: "👻",
    desc: "Blurred profile across 3+ sites.",
    earned: false,
  },
  {
    id: "encryption-adept",
    title: "Encryption Adept",
    icon: "🔒",
    desc: "Enabled 2FA everywhere.",
    earned: false,
  }
];

const MOCK_XP = 280;
const LEVEL = 3;
const NEXT_LVL_XP = 360; // XP needed for next level
const LAST_LVL_XP = 180;
const PROGRESS = Math.min(1, (MOCK_XP - LAST_LVL_XP) / (NEXT_LVL_XP - LAST_LVL_XP));
const NEXT_BADGE_UNLOCKED = MOCK_XP >= 300 ? true : false;

// Simple unlock animation duration (ms)
const ANIMATION_DURATION = 1650;

// Theme color hooks
function getCssVar(name, fallback = "#0ff") {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;
}

// Progress bar component
function XPProgressBar({ percent, xp, nextXP, lvl }) {
  const [animated, setAnimated] = useState(percent * 100);
  useEffect(() => {
    let raf, startVal = animated, start = Date.now();
    function animate() {
      const now = Date.now();
      const elapsed = Math.min((now - start) / 650, 1);
      const next = startVal + (percent * 100 - startVal) * elapsed;
      setAnimated(next);
      if (elapsed < 1) raf = requestAnimationFrame(animate);
      else setAnimated(percent * 100);
    }
    animate();
    return () => raf && cancelAnimationFrame(raf);
  // eslint-disable-next-line
  }, [percent]);

  return (
    <div style={{
      width: "100%",
      background: "rgba(255,255,255,0.10)",
      borderRadius: 14,
      height: 22,
      margin: "19px 0 14px 0",
      border: "1.4px solid var(--border-color)",
      overflow: "hidden",
      boxShadow: "0px 1.5px 7px 0 #0002",
      position: "relative"
    }}>
      <div
        style={{
          width: `${Math.max(0, Math.min(100, animated))}%`,
          height: "100%",
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          borderRadius: 14,
          transition: "width 0.38s cubic-bezier(.45,1.45,.72,.43)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative"
        }}
      >
        <span style={{
          fontWeight: 700,
          fontSize: "0.97em",
          color: "#13323c",
          marginRight: 17,
          opacity: animated > 18 ? 0.84 : 0,
          textShadow: "0 0px 4px #fff6"
        }}>
          {xp} / {nextXP} xp
        </span>
      </div>
      {/* Lvl & Next */}
      <span style={{
        position: "absolute",
        left: 14,
        top: 3,
        fontWeight: 600,
        color: "var(--primary)",
        fontSize: "1.04em"
      }}>
        Lv {lvl}
      </span>
      <span style={{
        position: "absolute",
        right: 13,
        top: 3,
        fontWeight: 600,
        color: "var(--secondary)",
        background: "#ff9edb14",
        borderRadius: 9,
        fontSize: "0.97em",
        padding: "1.5px 8px"
      }}>Next: Lv {lvl + 1}</span>
    </div>
  );
}

// Badge card with animation on unlock
function BadgeCard({ badge, animateUnlock }) {
  const [showAnim, setShowAnim] = useState(false);

  useEffect(() => {
    if (animateUnlock) {
      setShowAnim(true);
      const timer = setTimeout(() => setShowAnim(false), ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [animateUnlock]);

  return (
    <div
      className="badge-card"
      tabIndex={0}
      aria-label={`Badge: ${badge.title}${badge.earned ? " (earned)" : " (locked)"}`}
      style={{
        background: badge.earned
          ? "linear-gradient(135deg, #0ff3 80%, #ff9edb21)"
          : "linear-gradient(135deg, #071c44 70%, #2b2943 100%)",
        border: badge.earned
          ? "2px solid var(--accent)"
          : "1.4px dashed #7782af",
        borderRadius: 19,
        boxShadow: badge.earned
          ? "0 2px 12px #22fff355"
          : "0 1.2px 7px #0003",
        margin: "0 auto",
        minWidth: 140,
        maxWidth: 188,
        width: "100%",
        minHeight: 110,
        padding: "18px 12px 15px 12px",
        opacity: badge.earned ? 1 : 0.52,
        filter: badge.earned ? "none" : "grayscale(0.79) blur(0.17px)",
        position: "relative",
        overflow: "visible",
        transform: showAnim
          ? "scale(1.19) rotate(-2deg)"
          : "scale(1)",
        zIndex: showAnim ? 50 : 1,
        transition:
          "transform 0.59s cubic-bezier(.61,1.7,.32,.82), box-shadow .17s, filter .19s"
      }}
    >
      {showAnim && (
        <div style={{
          position: "absolute",
          top: -28,
          left: 0,
          right: 0,
          margin: "auto",
          width: 62,
          textAlign: "center",
          pointerEvents: "none",
          animation: "popBadgeAnim 1.7s cubic-bezier(.42,1.44,.81,.74) both"
        }}>
          <span
            style={{
              fontSize: "2.2rem",
              filter: "drop-shadow(0 0 22px #0ff8)",
              color: "#fff",
              textShadow: "0 0 18px #0ff, 0 1px 28px #ff9edb"
            }}
            aria-hidden
          >✨</span>
        </div>
      )}
      <div style={{
        fontSize: badge.icon.length < 3 ? "2.2rem" : "1.5rem",
        marginBottom: 7,
        filter: badge.earned ? "drop-shadow(0 0 4px #0ff7)" : "none",
        textAlign: "center"
      }}>
        {badge.icon}
      </div>
      <div style={{
        fontWeight: 700,
        fontSize: "1.09em",
        color: badge.earned ? "var(--primary)" : "var(--text-secondary)",
        marginBottom: 4,
        letterSpacing: ".013em",
        textAlign: "center"
      }}>{badge.title}</div>
      <div style={{
        fontWeight: 500,
        fontSize: ".97em",
        color: badge.earned ? "var(--secondary)" : "#b4b6cb",
        textAlign: "center"
      }}>{badge.desc}</div>
      {!badge.earned && (
        <div style={{
          position: "absolute",
          bottom: 8,
          left: 0, right: 0,
          textAlign: "center",
          color: "#b0e2ef",
          fontSize: ".93em",
          fontWeight: 700,
          letterSpacing: ".01em"
        }}>
          Locked
        </div>
      )}
      {/* Animation CSS */}
      <style>{`
        @keyframes popBadgeAnim {
          0% { opacity: 0; transform: scale(0.62) translateY(19px);}
          35% { opacity: 1; transform: scale(1.16) translateY(0);}
          55% { opacity: 0.97; transform: scale(0.94) translateY(-12px);}
          85% { opacity: 0.6;}
          100% { opacity: 0; transform: scale(1) translateY(-32px);}
        }
      `}</style>
    </div>
  );
}

// helper: Responsive grid CSS for badges
const badgeGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(163px, 1fr))",
  gap: "19px 16px",
  width: "100%",
  margin: "0 auto",
  marginTop: 8,
  marginBottom: 4,
  alignContent: "start"
};

// PUBLIC_INTERFACE
function PrivacyBadgeSystem(props) {
  // Simple state to play demo animation for next badge unlock
  const [unlockedBadgeIdx, setUnlockedBadgeIdx] = useState(null);

  useEffect(() => {
    // Demo: if user crosses XP = 300, "Ghost Mode" is unlocked!
    if (MOCK_XP >= 300) {
      // Find first locked badge
      const idx = MOCK_BADGES.findIndex(b => !b.earned);
      if (idx !== -1) {
        setTimeout(() => setUnlockedBadgeIdx(idx), 700);
        setTimeout(() => setUnlockedBadgeIdx(null), 2200);
      }
    }
  }, []);

  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 310,
        width: "100%",
        background: "rgba(255,255,255,0.037)",
        border: "1.8px solid var(--border-color)",
        boxShadow: "0 0 0 0 transparent",
        padding: "0",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "visible"
      }}
      tabIndex={0}
      aria-label="Privacy badge system widget"
    >
      {/* Header */}
      <div style={{
        fontWeight: 700,
        fontSize: "1.17rem",
        color: "var(--primary)",
        textShadow: "0px 4px 15px #0ff6",
        letterSpacing: ".019em",
        padding: "21px 21px 2px 21px"
      }}>
        Privacy Behavior Badges & XP Rewards
      </div>
      <div style={{
        color: "var(--text-secondary)",
        fontSize: "1.01em",
        fontWeight: 500,
        marginBottom: 10,
        padding: "0 21px 7px 21px"
      }}>
        Collect badges and XP for privacy-strengthening actions. Level up to unlock new achievements, see your XP progress, and get recognized for your digital privacy habits!
      </div>

      {/* XP and Progress System */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 23,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 21px",
        marginBottom: 7,
        width: "100%"
      }}>
        <div style={{
          fontWeight: 800,
          color: "var(--primary)",
          fontSize: "1.35em",
          display: "flex",
          alignItems: "center",
          gap: 7,
          textShadow: "0 1px 7px #00fff155"
        }}>
          <span style={{
            background: "radial-gradient(ellipse at 40% 50%, #0ff 80%, #11a5b9 100%)",
            color: "#0c242e",
            borderRadius: 19,
            padding: "6px 15px 6px 15px",
            marginRight: 6,
            fontWeight: 900,
            fontSize: "1.13em",
            boxShadow: "0 1.2px 9px #0ff3"
          }}>★</span>
          {MOCK_XP} XP
        </div>
        <div style={{
          fontWeight: 700,
          fontSize: "1.08em",
          color: "#ffc65f",
          background: "#0ff1",
          borderRadius: 12,
          padding: "4px 15px",
          textShadow: "0 0 7px #ffc65fbb"
        }}>
          <span role="img" aria-label="level-up">🏆</span> Level {LEVEL}
        </div>
      </div>
      <XPProgressBar percent={PROGRESS} xp={MOCK_XP} nextXP={NEXT_LVL_XP} lvl={LEVEL} />

      {/* BADGE WALL */}
      <div style={badgeGridStyle}>
        {MOCK_BADGES.map((badge, idx) =>
          <BadgeCard
            key={badge.id}
            badge={badge}
            animateUnlock={unlockedBadgeIdx === idx}
          />
        )}
      </div>
      {/* NEW BADGE UNLOCK MESSAGE */}
      {NEXT_BADGE_UNLOCKED && unlockedBadgeIdx != null && (
        <div
          style={{
            position: "absolute",
            left: 0, right: 0, top: 27,
            margin: "auto",
            zIndex: 80,
            pointerEvents: "none",
            textAlign: "center",
            fontSize: "1.21em",
            padding: "12px 20px",
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 2px 18px #0ff, 0 1px 30px #ff9edb",
            background: "rgba(18,255,246,0.09)",
            borderRadius: 22,
            maxWidth: 430,
            marginTop: 10,
            animation: "notifFlashIn 1.68s cubic-bezier(.51,1.24,.22,.78)"
          }}
        >
          <span role="img" aria-label="unlocked badge">🎉</span> New badge earned: <span style={{ color: "var(--primary)", fontWeight: 900 }}>{MOCK_BADGES[unlockedBadgeIdx]?.title}</span>!
        </div>
      )}
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 800px) {
          .badge-card { min-width: 111px; max-width: unset; font-size: .88em;}
        }
        @media (max-width: 550px) {
          .widget[aria-label="Privacy badge system widget"] {
            padding: 0 !important;
          }
          .badge-card {
            min-width: 100px;
            padding: 13px 4px 11px 4px;
            font-size: .86em;
          }
        }
        @keyframes notifFlashIn {
          0% { opacity: 0; transform: translateY(-52px) scale(0.7);}
          30% { opacity: 1; transform: translateY(-10px) scale(1.08);}
          65% { opacity: 1; transform: translateY(7px) scale(1);}
          100% { opacity: 0; transform: translateY(-22px) scale(0.95);}
        }
      `}</style>
      {/* Footer Tip */}
      <div style={{
        marginTop: 19,
        color: "var(--text-secondary)",
        fontSize: ".95em",
        textAlign: "right",
        paddingRight: 18,
        letterSpacing: ".007em"
      }}>
        Demo: Badges, XP & animation are static mock data for UI showcase.
      </div>
    </div>
  );
}

export default PrivacyBadgeSystem;
