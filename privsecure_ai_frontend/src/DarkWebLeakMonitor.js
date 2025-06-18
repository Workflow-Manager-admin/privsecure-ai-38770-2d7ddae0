import React, { useState } from "react";

/**
 * Mock data: Breach/exposure records
 */
const MOCK_BREACHES = [
  {
    id: "b1",
    title: "Major Data Breach: MegaMail",
    exposed: ["Email", "Phone", "Address"],
    impact: "Your email and phone were exposed in a large-scale MegaMail database breach by hackers, putting you at risk for phishing and scam attempts.",
    mitigation: [
      "Change credentials on all linked accounts.",
      "Be cautious of suspicious emails and unsolicited calls.",
      "Consider enabling multi-factor authentication.",
    ],
    severity: "Critical",
    date: "2024-03-22",
    resolved: false,
    icon: "🔥",
    breachSource: "public_leak",
  },
  {
    id: "b2",
    title: "Dark Web Posting: Data Aggregator Sale",
    exposed: ["Email"],
    impact:
      "Your personal email address appeared in a dark web sale post including thousands of user credentials from a known aggregator.",
    mitigation: [
      "Monitor for unusual account activity.",
      "Reset password to a strong unique one.",
    ],
    severity: "Critical",
    date: "2024-02-10",
    resolved: false,
    icon: "💀",
    breachSource: "dark_web",
  },
  {
    id: "b3",
    title: "Third-Party Leak: ShoppingPlus",
    exposed: ["Email", "Shipping Address"],
    impact:
      "A breach at ShoppingPlus exposed shopper email addresses and delivery addresses to cybercriminal forums.",
    mitigation: [
      "Watch for delivery scam notifications.",
      "Limit sharing addresses to trusted vendors.",
    ],
    severity: "Moderate",
    date: "2023-12-14",
    resolved: false,
    icon: "🛒",
    breachSource: "public_leak",
  },
  {
    id: "b4",
    title: "Address Data Paste: Pastebin Copied Entry",
    exposed: ["Address"],
    impact:
      "Automated scraper posted a partial database of home addresses (including yours) to Pastebin — now removed after takedown.",
    mitigation: [
      "No immediate action — breach is considered resolved.",
    ],
    severity: "Resolved",
    date: "2023-08-01",
    resolved: true,
    icon: "✅",
    breachSource: "pastebin",
  },
];

/**
 * Exposed data overall alert (collate what's currently exposed)
 * Returns sets for email, phone, address, etc.
 */
function aggregateExposures(breaches) {
  const result = {};
  breaches.forEach(b => {
    if (!b.resolved) {
      b.exposed.forEach(item =>
        result[item] ? (result[item] += 1) : (result[item] = 1)
      );
    }
  });
  return result; // { Email: 3, Phone: 1, ... }
}

// Color mapping for data types and severities
const DATA_COLORS = {
  Email: "var(--accent)",
  Phone: "#ffb774",
  Address: "#ff6373",
  "Shipping Address": "#ffc65f",
};
const SEVERITY_STYLES = {
  Critical: {
    color: "#ff6373",
    bg: "rgba(255,99,115,0.12)",
    badge: "Critical",
    glow: "0 0 7px #ff637399"
  },
  Moderate: {
    color: "var(--secondary)",
    bg: "rgba(255,158,219,0.09)",
    badge: "Moderate",
    glow: "0 0 7px #ff9edbaa"
  },
  Resolved: {
    color: "#8bffa6",
    bg: "rgba(19,255,116,0.06)",
    badge: "Resolved",
    glow: "0 0 6px #16ff9294"
  },
};

// Badge chip for severity
function SeverityBadge({ severity }) {
  const st = SEVERITY_STYLES[severity] || {};
  return (
    <span
      style={{
        background: st.bg,
        color: st.color,
        border: `1.2px solid ${st.color}`,
        fontWeight: 700,
        fontSize: "0.97em",
        borderRadius: 13,
        padding: "3.3px 13px",
        letterSpacing: ".01em",
        textTransform: "uppercase",
        marginLeft: 11,
        boxShadow: st.glow,
      }}
    >
      {st.badge || severity}
    </span>
  );
}

// Filter/tabs control for severity
function SeverityFilterTabs({ selected, onChange }) {
  const severities = ["Critical", "Moderate", "Resolved"];
  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      margin: "0 0 16px 0",
      gap: 8,
    }}>
      {severities.map(sev => (
        <button
          key={sev}
          style={{
            background: selected === sev ? SEVERITY_STYLES[sev].color : "rgba(255,255,255,0.03)",
            color: selected === sev ? "#0e0932" : SEVERITY_STYLES[sev].color,
            fontWeight: 700,
            border: `1.2px solid ${SEVERITY_STYLES[sev].color}`,
            borderRadius: 14,
            fontSize: ".99em",
            padding: "7px 19px",
            boxShadow: selected === sev ? SEVERITY_STYLES[sev].glow : "none",
            cursor: "pointer",
            outline: selected === sev ? "2.3px solid var(--primary)" : "none",
            opacity: selected === sev ? 1 : 0.86,
            transition: "background .18s, color .18s, box-shadow .18s",
          }}
          aria-pressed={selected === sev}
          tabIndex={0}
          onClick={() => onChange(sev)}
        >
          {SEVERITY_STYLES[sev].badge} {selected === sev ? "✓" : ""}
        </button>
      ))}
    </div>
  );
}

// Icon chip for exposed data type
function ExposedDataChip({ type, count }) {
  return (
    <span
      style={{
        background: "rgba(255,255,255,0.048)",
        border: `1.2px solid ${DATA_COLORS[type] || "#fff"}`,
        color: DATA_COLORS[type] || "#eef",
        borderRadius: 15,
        fontWeight: 600,
        fontSize: ".97em",
        padding: "3.1px 12px",
        marginRight: 9,
        marginBottom: 4,
        display: "inline-block",
        letterSpacing: ".007em",
        boxShadow: "0 0.9px 7px 0 #0002",
      }}
      title={`${count > 1 ? count + " breaches: " : ""}${type} exposed`}
    >
      {type}{" "}
      <span
        style={{
          color: "#ffe5b5",
          background: "rgba(0,0,0,0.12)",
          fontWeight: 700,
          padding: "0 7px",
          borderRadius: 8,
          fontSize: ".95em",
          marginLeft: 6,
        }}
      >
        {count}
      </span>
    </span>
  );
}

// Single breach info card
function BreachCard({ breach }) {
  // Date format
  const dateStr = new Date(breach.date).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric"
  });

  const style = SEVERITY_STYLES[breach.severity] || {};
  return (
    <div
      style={{
        background: "rgba(0,255,255,0.025)",
        border: `1.7px solid ${style.color}`,
        borderRadius: 18,
        boxShadow: style.glow,
        padding: "24px 20px 17px 20px",
        marginBottom: 16,
        display: "flex",
        flexDirection: "column",
        gap: 7,
        opacity: breach.resolved ? 0.69 : 1,
        filter: breach.resolved ? "grayscale(0.35) blur(0.1px)" : "none",
        position: "relative",
        willChange: "box-shadow, filter",
        transition: "box-shadow .18s, filter .17s, opacity .19s",
      }}
      tabIndex={0}
      aria-label={`Breach: ${breach.title}`}
    >
      {/* Card header: Icon, Title, Severity, Date */}
      <div style={{display: 'flex', alignItems: "center", gap: 11, marginBottom: 3}}>
        <span style={{
          fontSize: "1.7em",
          display: "inline-block",
          marginRight: 5,
          filter: "drop-shadow(0 1.7px 7px #0ffb)",
        }}>{breach.icon}</span>
        <span style={{
          fontWeight: 700,
          fontSize: "1.09em",
          color: "var(--primary)",
          textShadow: "0 2px 10px #0ffd",
          flex: 1,
        }}>{breach.title}</span>
        <SeverityBadge severity={breach.severity} />
      </div>
      <div style={{marginBottom: 5}}>
        <span style={{
          fontWeight: 600,
          color: "#7ffdfe",
          fontSize: ".97em",
        }}>Date: </span>
        <span style={{
          color: "#ecc",
          fontWeight: 500
        }}>{dateStr}</span>
      </div>
      {/* Exposed data types (chips) */}
      <div style={{marginBottom: 6, marginTop: 1}}>
        {breach.exposed.map(e =>
          <ExposedDataChip key={e} type={e} count={1} />
        )}
      </div>
      {/* Impact */}
      <div style={{
        color: "#fcd",
        fontWeight: 600,
        fontSize: "1.01em",
        margin: "3px 0"
      }}>
        <span style={{color: "#ffb774"}}>Impact:</span>&nbsp;{breach.impact}
      </div>
      {/* Mitigation steps */}
      <div style={{marginTop: 7}}>
        <span style={{color: "#aef", fontWeight: 700}}>Recommended Actions:</span>
        <ul style={{margin: "5px 0 0 17px", color: "#cafff2", fontWeight: 500, fontSize: ".97em", paddingLeft: 0}}>
          {breach.mitigation.map((step, idx) =>
            <li key={idx} style={{
              marginBottom: 4,
              listStyle: "disc",
            }}>{step}</li>
          )}
        </ul>
      </div>
      {/* Resolved tag */}
      {breach.resolved && (
        <div style={{
          position: "absolute",
          top: 9, right: 22,
          background: "#0ff2",
          color: "#377",
          fontWeight: 800,
          padding: "2px 12px",
          borderRadius: 8,
          fontSize: ".91em",
          opacity: 0.92,
          boxShadow: "0 0.7px 2.9px #16ff9296",
        }}>
          RESOLVED
        </div>
      )}
    </div>
  );
}

// Main alerts top panel: summary of all exposures
function ExposureAlertsBanner({ exposures }) {
  // exposures = {Email: 3, ...}
  const types = Object.keys(exposures);
  if (!types.length) return null;
  return (
    <div
      style={{
        background: "linear-gradient(94deg, #0ff2 5%, #184e77cc 80%, #6b122900 100%)",
        border: "1.6px solid var(--primary)",
        borderRadius: 13,
        color: "#0e006f",
        fontWeight: 700,
        fontSize: "1.14em",
        marginBottom: 19,
        boxShadow: "0 4px 18px 0 #0ffd",
        padding: "20px 18px 13px 18px",
      }}
      aria-live="polite"
      tabIndex={0}
    >
      <span style={{fontWeight: 700, fontSize: "1.05em", color: "#001424"}}>
        ⚠️ ALERT: Your data is currently found exposed in breaches:
      </span>
      <div style={{marginTop: 10}}>
        {types.map(t => (<ExposedDataChip key={t} type={t} count={exposures[t]} />))}
      </div>
      <div style={{ color: "#002e33", fontWeight: 600, fontSize: ".98em", marginTop: 4, letterSpacing: ".01em" }}>
        Review breach details and follow the recommendations below to protect your privacy.
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function DarkWebLeakMonitor() {
  // Local state: tab/filter for severity
  const [severityFilter, setSeverityFilter] = useState("Critical");

  // Filtered data
  const breaches = MOCK_BREACHES.filter(b => b.severity === severityFilter);

  const exposures = aggregateExposures(
    severityFilter !== "Resolved"
      ? MOCK_BREACHES.filter(b => !b.resolved)
      : MOCK_BREACHES.filter(b => b.resolved)
  );

  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 250,
        width: "100%",
        background: "rgba(255,255,255,0.038)",
        border: "1.7px solid var(--border-color)",
        boxShadow: "0 0 0 0 transparent",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
      tabIndex={0}
      aria-label="Dark web leak monitor"
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.16rem",
          color: "var(--primary)",
          textShadow: "0px 2px 11px #0ff2",
          letterSpacing: ".018em",
          padding: "24px 23px 5px 23px",
        }}
      >
        Dark Web Leak Monitor
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.03em",
          fontWeight: 500,
          marginBottom: 8,
          padding: "0 23px 4px 23px",
        }}
      >
        Get real-time alerts as soon as your personal data is identified in dark web leaks or breach dumps. Filter incidents by severity and review how each breach impacts you — plus expert recommendations to reduce privacy risk.
      </div>

      <div style={{ width: "100%", padding: "0 12px 19px 12px", flex: 1 }}>
        {/* Alert Banner */}
        <ExposureAlertsBanner exposures={exposures} />
        {/* Severity filter */}
        <SeverityFilterTabs selected={severityFilter} onChange={setSeverityFilter} />
        {/* Breach cards */}
        {breaches.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              margin: "34px 0",
              fontWeight: 500,
              letterSpacing: ".007em",
            }}
            aria-live="polite"
          >
            No breaches found in category "{severityFilter}".
          </div>
        ) : (
          breaches.map(breach => (
            <BreachCard key={breach.id} breach={breach} />
          ))
        )}
      </div>
    </div>
  );
}

export default DarkWebLeakMonitor;
