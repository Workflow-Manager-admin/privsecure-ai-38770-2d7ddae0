import React, { useState } from "react";

/**
 * DataDisintegrationScheduler
 * - Smart scheduler: lists mock emails, posts, files suggested for scheduled deletion/redaction.
 * - Timeline view: visualizes what is slated for deletion, timing, and highlights suggested redactions.
 * - Rule controls: UI for rules like 'auto-delete after 1 year', 'flag sensitive', demoed with state but no backend.
 * - All UI styled to match the app using theme colors (see App.css).
 */

// --- MOCK CONTENT DATA --- //
const MOCK_ITEMS = [
  {
    id: "em1",
    type: "Email",
    label: "Project X confidential update",
    date: "2022-12-17",
    source: "Gmail",
    preview: "Please find the project X specs attached. DO NOT share...",
    status: "Scheduled Deletion",
    redaction: ["specs attached", "DO NOT share"],
    sensitive: true,
    size: "1.8MB"
  },
  {
    id: "em2",
    type: "Email",
    label: "Your Amazon order details",
    date: "2023-05-03",
    source: "Amazon",
    preview: "Order #2123379: Apple iPhone Express delivery address: ...",
    status: "Flagged Sensitive",
    redaction: ["Apple iPhone", "Express delivery address"],
    sensitive: true,
    size: "0.7MB"
  },
  {
    id: "post1",
    type: "Post",
    label: "Forum: HackerNews - OAuth Example",
    date: "2021-08-09",
    source: "HackerNews",
    preview: "I once implemented OAuth on XYZ. Trick: use OAuth2 /clients...",
    status: "Past Retention",
    redaction: ["OAuth2 /clients"],
    sensitive: false,
    size: "2KB"
  },
  {
    id: "file1",
    type: "File",
    label: "BankStatement-2021.pdf",
    date: "2021-04-20",
    source: "Google Drive",
    preview: "PDF: Bank statement April 2021. Account: XXXX-2351...",
    status: "To Be Deleted",
    redaction: ["Account: XXXX-2351"],
    sensitive: true,
    size: "0.6MB"
  },
  {
    id: "post2",
    type: "Post",
    label: "Twitter: Birthday bash 🎉",
    date: "2023-09-14",
    source: "Twitter",
    preview: "Best party ever! Everyone came to 14 Candlenut Lane...",
    status: "Scheduled Deletion",
    redaction: ["14 Candlenut Lane"],
    sensitive: true,
    size: "1KB"
  },
  {
    id: "file2",
    type: "File",
    label: "Old Resume.docx",
    date: "2020-06-02",
    source: "Dropbox",
    preview: "Jonas Kaplan, Data Engineer. Skills: ...",
    status: "Past Retention",
    redaction: [],
    sensitive: false,
    size: "0.3MB"
  }
];

// --- RULES DEMO STATE --- //
const DEFAULT_RULES = [
  { id: "r1", label: "Auto-delete items older than", value: 365, unit: "days" },
  { id: "r2", label: "Flag content with personal info", value: true },
  { id: "r3", label: "Require manual review of redactions", value: false }
];

// --- UTILS --- //
function getCssVar(v, fallback = "#0ff") {
  return typeof window !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue(v) || fallback
    : fallback;
}

function itemTypeIcon(type) {
  // Simple emoji for illustration
  switch (type) {
    case "Email":
      return <span role="img" aria-label="email" style={{ fontSize: "1.4em" }}>✉️</span>;
    case "Post":
      return <span role="img" aria-label="post" style={{ fontSize: "1.4em" }}>💬</span>;
    case "File":
      return <span role="img" aria-label="file" style={{ fontSize: "1.4em" }}>📄</span>;
    default:
      return <span role="img" aria-label={type} style={{ fontSize: "1.4em" }}>📦</span>;
  }
}

function highlightRedactions(preview, redacts) {
  // Renders preview with matched phrases highlighted
  let nodes = [preview];
  redacts.forEach(txt => {
    nodes = nodes.flatMap(n => typeof n === "string"
      ? n.split(txt).flatMap((part, i, arr) =>
        i < arr.length - 1 ? [part, <mark style={{
          background: "#ff9edb",
          color: "#1A1A1A",
          borderRadius: 6,
          padding: "0 4px"
        }} key={txt + i}>{txt}</mark>] : part
      )
      : n
    );
  });
  return <>{nodes}</>;
}

function statusBadge(status) {
  let color, bg;
  if (status.includes("Delete")) {
    color = "var(--primary)"; bg = "rgba(0,255,255,0.09)";
  } else if (status.includes("Flag")) {
    color = "var(--secondary)"; bg = "#181834";
  } else if (status.includes("Past")) {
    color = "#ffc65f"; bg = "rgba(255,198,95,0.10)";
  } else {
    color = getCssVar("--text-secondary");
    bg = "rgba(255,255,255,0.07)";
  }
  return (
    <span style={{
      background: bg,
      color,
      fontWeight: 700,
      border: `1.2px solid ${color}`,
      fontSize: ".98em",
      borderRadius: 13,
      padding: "2.7px 12px",
      marginLeft: 9
    }}>{status}</span>
  );
}

// --- MOCK SCHEDULER: TABLE LIST --- //
function SchedulerTable({ items }) {
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          background: "rgba(0,255,255,0.01)",
          borderRadius: 16,
          borderCollapse: "separate",
          borderSpacing: 0,
          color: "var(--text-color)",
          minWidth: 390
        }}
        aria-label="Content Scheduler Table"
      >
        <thead>
          <tr style={{ color: "var(--secondary)", fontWeight: 700, fontSize: "1.03em" }}>
            <th style={{ padding: "9px 10px" }}>Type</th>
            <th style={{ padding: "9px 10px" }}>Label</th>
            <th style={{ padding: "9px 10px" }}>Preview</th>
            <th style={{ padding: "9px 10px" }}>Date</th>
            <th style={{ padding: "9px 10px" }}>Source</th>
            <th style={{ padding: "9px 10px" }}>Size</th>
            <th style={{ padding: "9px 6px", minWidth: 118 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it.id}
              style={{
                background: i % 2 === 0 ? "rgba(0,255,255,0.036)" : "rgba(255,158,219, .013)",
                borderBottom: "1px solid var(--border-color)"
              }}>
              <td style={{ padding: "10px 8px", fontWeight: 700, color: "var(--primary)", textAlign: "center" }}>
                {itemTypeIcon(it.type)}
              </td>
              <td style={{ padding: "10px 8px", fontWeight: 600 }}>{it.label}</td>
              <td style={{ padding: "10px 8px", color: "var(--text-secondary)", fontWeight: 500, maxWidth: 220 }}>
                {highlightRedactions(it.preview, it.redaction)}
              </td>
              <td style={{ padding: "10px 8px" }}>{it.date}</td>
              <td style={{ padding: "10px 8px" }}>{it.source}</td>
              <td style={{ padding: "10px 8px", color: "#ffc65f", fontWeight: 600 }}>{it.size}</td>
              <td style={{ padding: "10px 8px" }}>
                {statusBadge(it.status)}
                {it.sensitive &&
                  <span style={{
                    marginLeft: 8, background: "#ff63732b", color: "#ff6373", fontWeight: 700,
                    fontSize: ".97em", borderRadius: 8, padding: "1px 8px"
                  }}>Sensitive</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- TIMELINE VIEW --- //
function TimelineView({ items }) {
  // Timeline axis: ordered left to right (by date ascending)
  const sorted = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
  // Find min/max for proportional dots on axis
  const minDate = new Date(sorted[0].date).getTime(),
    maxDate = new Date(sorted[sorted.length - 1].date).getTime();
  const range = maxDate - minDate || 1;
  const axisColor = "var(--border-color)";
  return (
    <div style={{ width: "100%", margin: "27px 0 8px 0" }}>
      <div style={{ fontWeight: 700, color: "var(--secondary)", fontSize: "1.06em", marginBottom: 7, letterSpacing: ".018em" }}>
        Timeline: Scheduled Deletion & Redactions
      </div>
      <div style={{
        position: "relative", width: "100%", minHeight: 70, padding: "13px 8px 7px 24px"
      }}>
        {/* Axis */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 3,
          top: 42, background: axisColor, borderRadius: 3
        }} />
        {/* Timeline events */}
        {sorted.map((item, idx) => {
          const xPct = ((new Date(item.date).getTime() - minDate) / range) * 100;
          // Redaction highlight if present
          const hasRedact = item.redaction.length > 0;
          return (
            <div
              key={item.id}
              style={{
                position: "absolute",
                left: `calc(${xPct}% - 16px)`,
                top: 21,
                width: 38,
                textAlign: "center",
                zIndex: 2
              }}
            >
              <div style={{
                width: 28, height: 28,
                borderRadius: "50%",
                background: hasRedact
                  ? "linear-gradient(100deg, var(--secondary) 78%, var(--accent) 100%)"
                  : item.sensitive ? "#ff637340" : "var(--primary)",
                border: hasRedact
                  ? "2px solid var(--secondary)" :
                  item.sensitive ? "2px solid #ff6373" : "2px solid var(--primary)",
                boxShadow: hasRedact
                  ? "0 0 11px 0 #ff9edbb3"
                  : item.sensitive ? "0 0 7px #ff637399"
                  : "0 0 8px #0ff6",
                color: item.sensitive ? "#ff6373" : "#021837",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "1.1em", margin: "0 auto",
                position: "relative", opacity: 1
              }}>
                {itemTypeIcon(item.type)}
              </div>
              <div style={{
                position: "absolute",
                top: 32, width: 80, left: "50%", transform: "translateX(-50%)",
                fontSize: ".95em", fontWeight: 600,
                color: hasRedact ? "var(--secondary)" :
                  item.sensitive ? "#ff6373" : "#ffc65f"
              }}>{item.type}</div>
              {hasRedact &&
                <div style={{
                  position: "absolute", top: 55, width: 130, left: "50%", transform: "translateX(-50%)",
                  fontSize: ".97em", fontWeight: 600, color: "#ff9edb",
                  whiteSpace: "nowrap", opacity: 0.78
                }}>
                  Redact: {item.redaction.slice(0, 2).join(", ")}
                </div>
              }
            </div>
          );
        })}
      </div>
      <div style={{ clear: "both", height: 82 }} />
    </div>
  );
}

// --- RULES PANEL --- //
function RulesPanel({ rules, onUpdate }) {
  // Demo: allows editing auto-delete days and toggles for booleans
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1.2px solid var(--border-color)",
      borderRadius: 13,
      boxShadow: "0 0.6px 6px 0 #0002",
      padding: "16px 17px 9px 17px",
      marginTop: 9,
      marginBottom: 19,
      width: "100%",
      maxWidth: 420
    }}>
      <div style={{ color: "var(--primary)", fontWeight: 700, marginBottom: 8, fontSize: "1.08em", letterSpacing: ".012em" }}>
        Scheduler Rules & Controls
      </div>
      <div style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.98em", marginBottom: 12 }}>
        Set rules for how your data is deleted or flagged.<br /> (Changes are local/static for demo)
      </div>
      <form
        style={{
          display: "flex", flexDirection: "column", gap: 11
        }}
        onSubmit={e => { e.preventDefault(); return false; }}
      >
        {rules.map((rule, idx) => (
          <div key={rule.id} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <label htmlFor={rule.id} style={{ flex: 3, fontWeight: 600 }}>
              {rule.label}
            </label>
            {typeof rule.value === "number" ? (
              <>
                <input
                  id={rule.id}
                  type="number"
                  min={30}
                  max={3000}
                  step={1}
                  value={rule.value}
                  style={{
                    width: 76, padding: "3.5px 9px", borderRadius: 8,
                    border: "1.1px solid var(--primary)", fontWeight: 500,
                    color: "var(--primary)", background: "#032e49"
                  }}
                  onChange={e =>
                    onUpdate(idx, Number(e.target.value))
                  }
                />
                <span style={{
                  color: "var(--text-secondary)", fontWeight: 600,
                  fontSize: ".98em", marginRight: 3
                }}>{rule.unit}</span>
              </>
            ) : (
              <input
                id={rule.id}
                type="checkbox"
                checked={!!rule.value}
                style={{
                  width: 22, height: 22, accentColor: "var(--secondary)", borderRadius: 7
                }}
                onChange={e =>
                  onUpdate(idx, e.target.checked)
                }
              />
            )}
          </div>
        ))}
      </form>
    </div>
  );
}

// --- MAIN PUBLIC COMPONENT --- //
// PUBLIC_INTERFACE
function DataDisintegrationScheduler() {
  // Stateful rules for the form demo
  const [rules, setRules] = useState(DEFAULT_RULES);

  // Handler for rule updates
  function handleRuleUpdate(idx, value) {
    setRules(rules =>
      rules.map((r, i) => i === idx ? { ...r, value } : r)
    );
  }

  // Filtered demo: show all, but could filter by status etc as needed.

  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 365,
        width: "100%",
        background: "rgba(255,255,255,0.039)",
        border: "1.8px solid var(--border-color)",
        boxShadow: "0 0 0 0 transparent",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
      tabIndex={0}
      aria-label="Data disintegration scheduler"
    >
      {/* Title */}
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.18rem",
          color: "var(--primary)",
          textShadow: "0px 2px 10px #0ff2",
          letterSpacing: ".018em",
          padding: "23px 24px 4px 24px"
        }}
      >
        Smart Scheduler: Data Disintegration & Redaction Timeline
      </div>
      {/* Description */}
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.01em",
          fontWeight: 500,
          marginBottom: 6,
          padding: "0 24px 8px 24px"
        }}
      >
        Review upcoming deletions for emails, posts, and files—see timeline, redaction suggestions, and set automated rules to reclaim your privacy.
      </div>
      {/* MAIN RESPONSIVE LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 350px) 1fr",
          gap: "36px",
          width: "100%",
          alignItems: "flex-start",
          padding: "0 16px 0 16px",
          margin: 0
        }}
      >
        {/* Controls panel (left) */}
        <div style={{
          minWidth: 230,
          width: "100%",
          maxWidth: 420,
          flex: "1 1 330px",
          alignSelf: "stretch"
        }}>
          <RulesPanel rules={rules} onUpdate={handleRuleUpdate} />
        </div>
        {/* Scheduler + Timeline + Redaction Suggestions (right) */}
        <div
          style={{
            width: "100%",
            minWidth: 250,
            flex: "2 1 390px",
            display: "flex",
            flexDirection: "column",
            gap: "26px",
            alignItems: "stretch"
          }}
        >
          {/* Timeline (top) */}
          <TimelineView items={MOCK_ITEMS} />
          {/* Scheduler Table (middle) */}
          <SchedulerTable items={MOCK_ITEMS} />
          {/* Redaction Suggestions (bottom section, below table) */}
          <div
            style={{
              marginTop: 14,
              width: "100%",
              background: "rgba(255,255,255,0.013)",
              border: "1px solid var(--border-color)",
              borderRadius: 13,
              boxShadow: "0 1.2px 9px #0ff1",
              padding: "16px 17px 7px 19px"
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "1.047em",
                color: "var(--secondary)",
                marginBottom: 9,
                letterSpacing: ".01em"
              }}
            >
              Redaction Suggestions
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexWrap: "wrap",
                gap: "13px 18px"
              }}
            >
              {MOCK_ITEMS
                .filter(i => i.redaction && i.redaction.length > 0)
                .map(i =>
                  i.redaction.map((phrase, idx) => (
                    <li
                      key={i.id + "-r" + idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#ff9edb09",
                        border: "1.2px solid #ff9edb",
                        color: "#ff9edb",
                        borderRadius: 11,
                        padding: "3px 11px",
                        fontWeight: 600,
                        fontSize: "0.98em",
                        letterSpacing: ".007em",
                        marginRight: 8
                      }}
                    >
                      <span style={{
                        fontWeight: 700,
                        fontSize: "1.1em",
                        color: "#fff",
                        marginRight: 8
                      }}>
                        {itemTypeIcon(i.type)}
                      </span>
                      {phrase}
                      <span style={{marginLeft: 7, color: "#ffc65f", fontSize: ".93em"}}>({i.label})</span>
                    </li>
                  ))
                )
              }
              {MOCK_ITEMS.filter(i => i.redaction && i.redaction.length > 0).length === 0 && (
                <li style={{
                  color: "var(--text-secondary)", fontWeight: 500, opacity: 0.7
                }}>
                  No redactions suggested in current data.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* Demo Footnote */}
      <div
        style={{
          marginTop: 18,
          color: "var(--text-secondary)",
          fontSize: "0.94em",
          textAlign: "right",
          paddingRight: 19,
          letterSpacing: ".007em"
        }}
      >
        Demo: All data and calculations are static/mocked.
      </div>
      {/* Responsive adjustment for mobile: Stack the grid & adjust paddings */}
      <style>{`
        @media (max-width: 970px) {
          .widget[aria-label="Data disintegration scheduler"] > div[style*="grid"] {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 4vw;
          }
        }
        @media (max-width: 650px) {
          .widget[aria-label="Data disintegration scheduler"] {
            padding: 0;
          }
          .widget[aria-label="Data disintegration scheduler"] > div[style*="grid"] > div {
            min-width: 0 !important;
            max-width: 100% !important;
          }
          .widget[aria-label="Data disintegration scheduler"] > div[style*="grid"] {
            padding: 0 2vw !important;
          }
          .widget[aria-label="Data disintegration scheduler"] > div:last-child {
            padding-right: 2vw;
            font-size: 0.91em;
          }
        }
      `}
      </style>
    </div>
  );
}

export default DataDisintegrationScheduler;
