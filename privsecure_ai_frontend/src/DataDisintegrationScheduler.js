import React, { useState } from "react";

/**
 * DataDisintegrationScheduler
 * Complete reimplementation: smart scheduler panel, timeline of content for deletion,
 * clear redaction suggestions, and visually accessible rule controls.
 * Responsive, consistent layout using mock/static data, themed via App.css.
 */

// MOCK DATA: items subject to auto-deletion/redaction
const MOCK_DATA = [
  {
    id: "e1",
    type: "Email",
    label: "Confidential: Investor Update",
    date: "2022-05-14",
    source: "Outlook",
    size: "1.2MB",
    status: "Scheduled Deletion",
    sensitive: true,
    preview: "Investor update: attached financial data for Q2.",
    redactions: ["financial data for Q2"],
  },
  {
    id: "p1",
    type: "Post",
    label: "LinkedIn: Job Change Announcement",
    date: "2022-12-11",
    source: "LinkedIn",
    size: "312KB",
    status: "Flagged Sensitive",
    sensitive: true,
    preview: "Excited to join Quantum Corp—new office at 900 Lakeside Dr.",
    redactions: ["900 Lakeside Dr."],
  },
  {
    id: "f1",
    type: "File",
    label: "2019 Taxes.pdf",
    date: "2020-04-18",
    source: "Dropbox",
    size: "0.5MB",
    status: "To Be Deleted",
    sensitive: false,
    preview: "Tax year: 2019; Contains: SSN, address, wages.",
    redactions: ["SSN", "address"],
  },
  {
    id: "e2",
    type: "Email",
    label: "Delivery Confirmation",
    date: "2023-06-27",
    source: "Gmail",
    size: "0.8MB",
    status: "Past Retention",
    sensitive: false,
    preview: "Your package to 443 Park Ave will arrive soon.",
    redactions: ["443 Park Ave"],
  },
  {
    id: "p2",
    type: "Post",
    label: "Forum: Photography Tips",
    date: "2021-07-22",
    source: "Reddit",
    size: "2KB",
    status: "Eligible",
    sensitive: false,
    preview: "Best cameras in 2021 for travel: try the X-Pro3.",
    redactions: [],
  },
];

// Default rules (local state, mock values)
const DEFAULT_RULES = [
  { id: "autoDeleteDays", label: "Auto-delete items older than", value: 365, unit: "days" },
  { id: "flagSensitive", label: "Flag content with sensitive info", value: true },
  { id: "manualReview", label: "Require manual review before delete", value: false }
];

// UTILS
function getCssVar(name, fallback = "#0ff") {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name) || fallback;
}
function iconForType(type) {
  switch (type) {
    case "Email": return <span role="img" aria-label="email" style={{ fontSize: "1.35em" }}>✉️</span>;
    case "Post": return <span role="img" aria-label="post" style={{ fontSize: "1.35em" }}>💬</span>;
    case "File": return <span role="img" aria-label="file" style={{ fontSize: "1.35em" }}>📄</span>;
    default: return <span role="img" aria-label="data" style={{ fontSize: "1.35em" }}>📦</span>;
  }
}
function badge(status) {
  let color, bg;
  if (/Delete/i.test(status))      { color = "var(--primary)"; bg = "rgba(0,255,255,0.09)"; }
  else if (/Flag/i.test(status))  { color = "var(--secondary)"; bg = "#1b141f"; }
  else if (/Past/i.test(status))  { color = "#ffc65f"; bg = "rgba(255,198,95,0.10)"; }
  else if (/Eligible/i.test(status)) { color = "#53fda8"; bg = "#093a4385"; }
  else                           { color = getCssVar('--text-secondary'); bg = "#4447"; }
  return (
    <span
      style={{
        background: bg,
        color,
        border: `1.1px solid ${color}`,
        borderRadius: 13,
        fontWeight: 700,
        fontSize: ".98em",
        padding: "2.5px 9.5px",
        marginLeft: 8,
        marginRight: 2
      }}
    >
      {status}
    </span>
  );
}
function highlightRedactions(text, redacts = []) {
  if (!redacts?.length) return text;
  let nodes = [text];
  redacts.forEach(phrase => {
    nodes = nodes.flatMap(node =>
      typeof node === "string"
        ? node.split(phrase).flatMap((part, i, arr) =>
            i < arr.length - 1
              ? [part, <mark key={phrase + i} style={{
                  background: "#ff9edb",
                  color: "#1A1A1A",
                  borderRadius: "4px",
                  padding: "0 3px"
                }}>{phrase}</mark>]
              : part)
        : node
    );
  });
  return <>{nodes}</>;
}

// RULES PANEL
function RuleControls({ rules, onEdit }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "1.3px solid var(--border-color)",
      borderRadius: 13,
      maxWidth: 430,
      width: "100%",
      marginBottom: 26,
      boxShadow: "0 0.7px 7px #0018",
      padding: "18px 21px"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: "1.09em",
        color: "var(--primary)",
        marginBottom: 9,
        letterSpacing: ".011em"
      }}>Rule Controls</div>
      <form style={{ display: "flex", flexDirection: "column", gap: 13 }}
        onSubmit={e => e.preventDefault()}
      >
        {rules.map((r, idx) => (
          <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <label htmlFor={r.id} style={{ flex: 4, fontWeight: 600 }}>{r.label}</label>
            {typeof r.value === "number" ?
              (<>
                <input
                  id={r.id}
                  type="number"
                  min={30}
                  max={1500}
                  value={r.value}
                  style={{
                    width: 65, padding: "2.5px 9px", borderRadius: 8,
                    border: "1.1px solid var(--primary)",
                    fontWeight: 600, color: "var(--primary)", background: "#082a38"
                  }}
                  onChange={e => onEdit(idx, Number(e.target.value))}
                />
                <span style={{
                  color: "var(--secondary)", fontWeight: 600, fontSize: ".96em", marginRight: 3
                }}>
                  {r.unit}
                </span>
              </>)
              : (
                <input
                  id={r.id}
                  type="checkbox"
                  checked={!!r.value}
                  style={{ width: 22, height: 22, accentColor: "var(--secondary)", borderRadius: 7 }}
                  onChange={e => onEdit(idx, e.target.checked)}
                />
              )}
          </div>
        ))}
      </form>
    </div>
  );
}

// SMART SCHEDULER: TABLE
function SchedulerSmartList({ items }) {
  return (
    <div style={{ width: "100%", overflowX: "auto", marginBottom: 22 }}>
      <table
        style={{
          width: "100%",
          background: "rgba(0,255,255,0.013)",
          borderRadius: 16,
          borderCollapse: "separate",
          borderSpacing: 0,
          color: "var(--text-color)",
          minWidth: 420
        }}
        aria-label="Content for deletion"
      >
        <thead>
          <tr style={{ color: "var(--secondary)", fontWeight: 700, fontSize: "1.03em" }}>
            <th style={{ padding: "9px 8px" }}>Type</th>
            <th style={{ padding: "9px 8px" }}>Label</th>
            <th style={{ padding: "9px 8px" }}>Preview</th>
            <th style={{ padding: "9px 6px" }}>Status</th>
            <th style={{ padding: "9px 8px" }}>Date</th>
            <th style={{ padding: "9px 8px" }}>Source</th>
            <th style={{ padding: "9px 7px" }}>Size</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) =>
            <tr key={item.id}
              style={{
                background: i % 2 === 0 ? "rgba(0,255,255,0.03)" : "rgba(255,158,219,.011)",
                borderBottom: "1px solid var(--border-color)"
              }}>
              <td style={{ textAlign: "center", color: "var(--primary)", fontWeight: 700, padding: "9px 8px" }}>
                {iconForType(item.type)}
              </td>
              <td style={{ fontWeight: 600, padding: "9px 8px" }}>{item.label}</td>
              <td style={{ color: "var(--text-secondary)", fontWeight: 500, maxWidth: 190, padding: "9px 8px" }}>
                {highlightRedactions(item.preview, item.redactions)}
              </td>
              <td style={{ padding: "9px 8px", whiteSpace: "nowrap" }}>
                {badge(item.status)}
                {item.sensitive &&
                  <span style={{
                    marginLeft: 7,
                    background: "#ff63731b",
                    color: "#ff6373",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: ".98em",
                    padding: "1px 7px"
                  }}>
                    Sensitive
                  </span>
                }
              </td>
              <td style={{ padding: "9px 8px" }}>{item.date}</td>
              <td style={{ padding: "9px 8px" }}>{item.source}</td>
              <td style={{ color: "#ffc65f", fontWeight: 600, padding: "9px 8px" }}>{item.size}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// TIMELINE: deletion & redaction
function SchedulerTimeline({ items }) {
  const sorted = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
  const minDate = new Date(sorted[0].date).getTime();
  const maxDate = new Date(sorted[sorted.length - 1].date).getTime();
  const range = maxDate - minDate || 1;
  return (
    <div style={{ width: "100%", marginBottom: 18 }}>
      <div style={{
        fontWeight: 700,
        color: "var(--secondary)",
        fontSize: "1.065em",
        marginBottom: 7,
        letterSpacing: ".018em"
      }}>
        Timeline: Deletion & Redaction Suggestions
      </div>
      <div style={{ position: "relative", width: "100%", minHeight: 78, padding: "13px 5px 7px 18px" }}>
        {/* Axis */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 3,
          top: 42, background: "var(--border-color)", borderRadius: 3
        }} />
        {/* Events */}
        {sorted.map((item, idx) => {
          const xPct = ((new Date(item.date).getTime() - minDate) / range) * 100;
          const hasRedact = item.redactions.length > 0;
          return (
            <div
              key={item.id}
              style={{
                position: "absolute",
                left: `calc(${xPct}% - 8px)`,
                top: 15,
                width: 54,
                textAlign: "center",
                zIndex: 2
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: hasRedact
                  ? "linear-gradient(87deg,var(--secondary),var(--accent))"
                  : item.sensitive ? "#ff637340" : "var(--primary)",
                border: hasRedact
                  ? "2px solid var(--secondary)"
                  : item.sensitive ? "2px solid #ff6373" : "2px solid var(--primary)",
                boxShadow: hasRedact
                  ? "0 0 11px 0 #ff9edbb1"
                  : item.sensitive ? "0 0 7px #ff63739d"
                  : "0 0 10px #0ff7",
                color: item.sensitive ? "#ff6373" : "#0b2547",
                fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.08em", margin: "0 auto"
              }}>
                {iconForType(item.type)}
              </div>
              <div style={{
                marginTop: 7, fontWeight: 600, fontSize: ".97em",
                color: hasRedact ? "var(--secondary)" : item.sensitive ? "#ff6373" : "#ffc65f"
              }}>
                {item.type}
              </div>
              {hasRedact &&
                <div style={{
                  fontWeight: 700, fontSize: ".85em",
                  color: "#ff9edb", marginTop: 4,
                  opacity: 0.79, letterSpacing: ".01em",
                  maxWidth: 70, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
                }}>
                  Redact: {item.redactions[0]}{item.redactions.length>1?",…":""}
                </div>
              }
            </div>
          );
        })}
      </div>
      <div style={{ height: 92 }} />
    </div>
  );
}

// REDACTION SUGGESTIONS
function RedactionSuggestionList({ items }) {
  const suggestions = items.flatMap(it =>
    it.redactions.map((phrase, idx) => ({
      phrase,
      id: `${it.id}-r${idx}`,
      type: it.type,
      label: it.label
    }))
  );
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1.2px solid #ff9edb",
      borderRadius: 12,
      boxShadow: "0 1.2px 9px #0ff1",
      padding: "16px 15px 7px 19px",
      marginTop: 13,
      marginBottom: 4,
      width: "100%"
    }}>
      <div style={{
        fontWeight: 700,
        fontSize: "1.047em",
        color: "var(--secondary)",
        marginBottom: 9,
        letterSpacing: ".01em"
      }}>
        Redaction Suggestions
      </div>
      {suggestions.length === 0 ? (
        <div style={{ color: "var(--text-secondary)", fontWeight: 500, opacity: 0.7, marginBottom: 6 }}>
          No redactions currently suggested.
        </div>
      ) : (
        <ul style={{
          margin: 0, padding: 0, listStyle: "none",
          display: "flex", flexWrap: "wrap", gap: "12px 13px"
        }}>
          {suggestions.map(s =>
            <li key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#ff9edb09",
                border: "1.2px solid #ff9edb",
                color: "#ff9edb",
                borderRadius: 10,
                padding: "3px 11px",
                fontWeight: 600,
                fontSize: "0.98em",
                letterSpacing: ".01em",
                marginRight: 8
              }}>
              <span style={{
                fontWeight: 700,
                fontSize: "1.1em", color: "#fff", marginRight: 7
              }}>
                {iconForType(s.type)}
              </span>
              {s.phrase}
              <span style={{ marginLeft: 7, color: "#ffc65f", fontSize: ".93em" }}>
                ({s.label})
              </span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

// MAIN PUBLIC INTERFACE
// PUBLIC_INTERFACE
function DataDisintegrationScheduler() {
  const [rules, setRules] = useState(DEFAULT_RULES);

  function handleRuleEdit(idx, val) {
    setRules(list => list.map((r, i) => i === idx ? { ...r, value: val } : r));
  }

  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 390,
        width: "100%",
        background: "rgba(255,255,255,0.041)",
        border: "1.8px solid var(--border-color)",
        boxShadow: "0 0 0 0 transparent",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: 0
      }}
      tabIndex={0}
      aria-label="Data disintegration scheduler"
    >
      {/* Title and intro */}
      <div style={{
        fontWeight: 700,
        fontSize: "1.17rem",
        color: "var(--primary)",
        textShadow: "0px 2px 11px #0ff2",
        letterSpacing: ".017em",
        padding: "22px 22px 6px 22px"
      }}>
        Data Disintegration Scheduler & Redaction Timeline
      </div>
      <div style={{
        color: "var(--text-secondary)",
        fontSize: "1.01em",
        fontWeight: 500,
        marginBottom: 8,
        padding: "0 22px 7px 22px"
      }}>
        Review emails, posts, and files queued for deletion or redaction according to your privacy rules.<br />
        Set custom retention and sensitivity rules, and get timeline-based redaction suggestions.<br />
        (Data is static for demo; no real operations performed.)
      </div>
      {/* Layout: wide grid (rules panel left, rest right) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(250px, 380px) 1fr",
        gap: "36px",
        width: "100%",
        alignItems: "flex-start",
        padding: "0 16px",
        marginBottom: 0
      }}>
        <div style={{
          minWidth: 220,
          width: "100%",
          maxWidth: 440
        }}>
          <RuleControls rules={rules} onEdit={handleRuleEdit} />
        </div>
        <div style={{
          width: "100%",
          minWidth: 240,
          flex: "2 1 390px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          alignItems: "stretch"
        }}>
          <SchedulerTimeline items={MOCK_DATA} />
          <SchedulerSmartList items={MOCK_DATA} />
          <RedactionSuggestionList items={MOCK_DATA} />
        </div>
      </div>
      {/* Footer */}
      <div style={{
        marginTop: 19,
        color: "var(--text-secondary)",
        fontSize: "0.94em",
        textAlign: "right",
        paddingRight: 18,
        letterSpacing: ".007em"
      }}>
        Demo: All data is fake/static and no real actions will occur.
      </div>
      {/* Responsive adjustment for mobile: Stack the grid & adjust paddings */}
      <style>
        {`
        @media (max-width: 950px) {
          .widget[aria-label="Data disintegration scheduler"] > div[style*='grid'] {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 4vw;
          }
        }
        @media (max-width: 640px) {
          .widget[aria-label="Data disintegration scheduler"] {
            padding: 0;
          }
          .widget[aria-label="Data disintegration scheduler"] > div[style*='grid'] > div {
            min-width: 0 !important;
            max-width: 100% !important;
          }
          .widget[aria-label="Data disintegration scheduler"] > div[style*='grid'] {
            padding: 0 2vw !important;
          }
          .widget[aria-label="Data disintegration scheduler"] > div:last-child {
            padding-right: 2vw;
            font-size: 0.90em;
          }
        }
        `}
      </style>
    </div>
  );
}

export default DataDisintegrationScheduler;
