import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";

/**
 * STATIC: Mock privacy action items list
 * Each item includes: { id, label, priority: "High"/"Medium"/"Low", isCompleted (bool), actionType: "revoke"|"delete"|"review", streakCount }
 */
const mockActions = [
  {
    id: 1,
    label: "Revoke access to unused Google Drive apps",
    priority: "High",
    isCompleted: false,
    actionType: "revoke",
    streakCount: 3,
  },
  {
    id: 2,
    label: "Review data permissions for Instagram",
    priority: "Medium",
    isCompleted: true,
    actionType: "review",
    streakCount: 6,
  },
  {
    id: 3,
    label: "Request deletion of old account from XYZ Forum",
    priority: "High",
    isCompleted: false,
    actionType: "delete",
    streakCount: 2,
  },
  {
    id: 4,
    label: "Opt out from targeted ad tracking",
    priority: "Low",
    isCompleted: false,
    actionType: "revoke",
    streakCount: 0,
  }
];

/**
 * Returns a color for Priority level badge matching the app's color style.
 */
function priorityColor(priority) {
  if (priority === "High") return "var(--secondary)";
  if (priority === "Medium") return "var(--primary)";
  return "#a3fff8";
}

/**
 * Badge component for Priority
 */
function PriorityBadge({ priority }) {
  return (
    <span
      style={{
        background: "rgba(0,0,0,0.31)",
        color: priorityColor(priority),
        fontWeight: 700,
        border: `1.2px solid ${priorityColor(priority)}`,
        fontSize: "0.92em",
        textTransform: "uppercase",
        padding: "2.5px 12px",
        marginRight: 11,
        borderRadius: 15,
        letterSpacing: ".03em",
        boxShadow: `0 0px 5px 0 ${priorityColor(priority)}10`
      }}
    >
      {priority}
    </span>
  );
}

/**
 * One-click Action Button
 */
function ActionButton({ actionType, completed, onClick }) {
  let label, icon, color, accent;
  switch (actionType) {
    case "revoke":
      label = completed ? "Revoked" : "Revoke Access";
      icon = "🔌";
      color = "var(--accent)";
      accent = "#18ffe7";
      break;
    case "delete":
      label = completed ? "Requested" : "Request Deletion";
      icon = "🗑️";
      color = "#ff5470";
      accent = "#ffb8b8";
      break;
    case "review":
    default:
      label = completed ? "Reviewed" : "Review";
      icon = "🔍";
      color = "var(--secondary)";
      accent = "#fff2fc";
      break;
  }
  return (
    <button
      aria-label={label}
      disabled={completed}
      onClick={onClick}
      style={{
        cursor: completed ? "default" : "pointer",
        opacity: completed ? 0.59 : 1,
        background: completed ? "rgba(43,43,54,0.31)" : color,
        color: completed ? "#aaa" : "#000",
        border: `1px solid ${accent}`,
        borderRadius: 13,
        fontWeight: 600,
        fontSize: "0.93em",
        padding: "6.5px 14px",
        position: "relative",
        transition: "filter 0.15s, background 0.23s",
        marginLeft: 6,
        boxShadow: "0 1.2px 4.2px 0 #0004"
      }}
      tabIndex={0}
    >
      {icon} {label}
    </button>
  );
}

/**
 * Animated Progress Bar (horizontal)
 */
function AnimatedProgressBar({ percent }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let frame;
    const duration = 680; // ms
    const start = animated;
    const diff = percent - start;
    const t0 = performance.now();
    const animate = (now) => {
      let elapsed = now - t0;
      let progress = Math.min(elapsed / duration, 1);
      setAnimated(start + diff * progress);
      if (progress < 1) frame = requestAnimationFrame(animate);
      else setAnimated(percent);
    };
    frame = requestAnimationFrame(animate);
    return () => frame && cancelAnimationFrame(frame);
    // eslint-disable-next-line
  }, [percent]);
  return (
    <div
      aria-label="progress bar"
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.07)",
        borderRadius: 13,
        height: 16,
        margin: "8px 0 0 0",
        border: "1.3px solid var(--border-color)",
        overflow: "hidden",
        boxShadow: "0px 1px 8px 0 #0003"
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(100, animated))}%`,
          height: "100%",
          background: "linear-gradient(90deg, var(--primary), var(--secondary))",
          borderRadius: 13,
          transition: "width 0.3s cubic-bezier(.45,1.45,.72,.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative"
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "0.92em",
            color: "#113",
            marginRight: 13,
            opacity: animated > 12 ? 0.74 : 0,
            textShadow: "0 0px 4px #fff6"
          }}
        >
          {Math.round(animated)}%
        </span>
      </div>
    </div>
  );
}

/**
 * Streak Tracker (fire icon and count)
 */
function StreakTracker({ streak }) {
  return (
    <span
      title={streak > 0 ? `Streak: ${streak} day${streak !== 1 ? "s" : ""}` : "Start your privacy streak!"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontWeight: 700,
        fontSize: "1.08em",
        color: streak > 0 ? "#ffcc44" : "var(--border-color)",
        marginLeft: 10,
        gap: 2,
        letterSpacing: ".01em",
        verticalAlign: "middle"
      }}
    >
      <span style={{ fontSize: "1.15em" }} role="img" aria-label="streak">{streak > 0 ? "🔥" : "🧊"}</span>
      <span>{streak}</span>
    </span>
  );
}

/**
 * Smart Checklist Component
 */
// PUBLIC_INTERFACE
function PrivacyActionPlan(props) {
  // Use local state to allow action completion
  const [actions, setActions] = useState(mockActions);
  const { colors } = useTheme();

  const completed = useMemo(() => actions.filter(a => a.isCompleted).length, [actions]);
  const total = actions.length;
  const percent = total > 0 ? (completed / total) * 100 : 0;
  const topStreak = actions.length > 0 ? Math.max(...actions.map(a => a.streakCount)) : 0;

  // Handlers -- only mock for now
  const handleActionClick = (id) => {
    setActions(prev =>
      prev.map(a =>
        a.id === id ? { ...a, isCompleted: true, streakCount: a.streakCount + 1 } : a
      )
    );
  };

  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 235,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        background: "rgba(255,255,255,0.036)",
        boxShadow: "0 0 0 0 transparent",
        border: "1.8px solid var(--border-color)",
        // remove default widget-placeholder
      }}
      tabIndex={0}
      aria-label="Privacy action plan widget"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          gap: 13,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 3px 6px 3px"
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.11rem",
            color: "var(--primary)",
            textShadow: "0px 1px 9px #0ff3",
            letterSpacing: ".012em"
          }}
        >
          Smart Privacy Checklist
        </span>
        {/* Completed/Progress */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            color: "var(--text-secondary)",
            fontSize: "1.01em",
            marginRight: 8,
            gap: 8,
            letterSpacing: ".01em"
          }}
        >
          {completed} / {total} done
          <span style={{ marginLeft: 6, fontSize: "0.92em", color: "var(--secondary)" }} aria-label="streak highlight">
            <StreakTracker streak={topStreak} />
          </span>
        </div>
      </div>
      {/* Progress bar */}
      <AnimatedProgressBar percent={percent} />
      {/* Checklist content */}
      <ul
        style={{
          listStyle: "none",
          margin: "23px 0 0 0",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {actions.map((a) => (
          <li
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              background: a.isCompleted
                ? "linear-gradient(90deg, #00657009 65%, #0ff031 100%)"
                : "rgba(0,0,0,0.10)",
              border: a.isCompleted
                ? "1.2px solid var(--primary)"
                : "1.2px solid var(--border-color)",
              borderRadius: 13,
              boxShadow: a.isCompleted
                ? "0 0 7px #0ff2"
                : "0 0.5px 3.5px 0 #0001",
              padding: "11px 12px",
              gap: 10,
              filter: a.isCompleted ? "brightness(1.08)" : "",
              opacity: a.isCompleted ? 0.74 : 1,
              transition: "background 0.32s, box-shadow 0.27s, border 0.23s"
            }}
          >
            <PriorityBadge priority={a.priority} />
            <span
              style={{
                flex: 1,
                textDecoration: a.isCompleted ? "line-through" : "none",
                color: a.isCompleted ? "var(--text-secondary)" : "var(--text-color)",
                fontWeight: a.isCompleted ? 400 : 600,
                fontSize: "1.09em",
                letterSpacing: ".01em",
                filter: a.isCompleted ? "blur(0.3px)" : "none",
                opacity: a.isCompleted ? 0.97 : 1,
                transition: "color 0.23s, text-decoration 0.18s"
              }}
            >
              {a.label}
              <StreakTracker streak={a.streakCount} />
            </span>
            <ActionButton
              actionType={a.actionType}
              completed={a.isCompleted}
              onClick={() => handleActionClick(a.id)}
            />
          </li>
        ))}
      </ul>
      {/* Helper tip/footnote */}
      <div
        style={{
          marginTop: 23,
          color: "var(--text-secondary)",
          fontSize: "0.96em",
          textAlign: "right",
          paddingRight: 3,
          letterSpacing: ".007em"
        }}
      >
        {percent === 100
          ? <>🎉 All actions done! Great privacy hygiene.</>
          : <>Tip: Complete actions to build your privacy streak <span aria-label="fire">🔥</span></>
        }
      </div>
    </div>
  );
}

export default PrivacyActionPlan;
