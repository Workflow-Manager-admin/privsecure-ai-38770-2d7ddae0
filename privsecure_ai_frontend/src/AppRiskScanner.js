import React from "react";

/**
 * Mock data for connected third-party apps/platforms
 */
const MOCK_APPS = [
  {
    name: "Google Drive",
    platform: "Google",
    permission: "Full Access",
    trustScore: 91,
    lastUsed: "1 hour ago",
    icon: "📁",
  },
  {
    name: "Spotify",
    platform: "Spotify",
    permission: "Basic Profile",
    trustScore: 71,
    lastUsed: "Yesterday",
    icon: "🎵",
  },
  {
    name: "Instagram Analytics",
    platform: "Instagram",
    permission: "Read/Write",
    trustScore: 54,
    lastUsed: "4 days ago",
    icon: "📸",
  },
  {
    name: "Crypto Wallet Connect",
    platform: "MetaMask",
    permission: "Full Access",
    trustScore: 38,
    lastUsed: "2 weeks ago",
    icon: "🦊",
  },
];

// Helper: trust score color/badge style
function trustBadge(score) {
  let color, label;
  if (score >= 80) {
    color = "var(--primary)";
    label = "High";
  } else if (score >= 60) {
    color = "var(--secondary)";
    label = "Moderate";
  } else if (score >= 40) {
    color = "#ffc65f";
    label = "Low";
  } else {
    color = "#ff6373";
    label = "Critical";
  }
  return (
    <span
      style={{
        display: "inline-block",
        fontWeight: 700,
        background: "rgba(0,255,255,0.075)",
        borderRadius: 17,
        padding: "3.5px 14px",
        color,
        border: `1.3px solid ${color}`,
        fontSize: "0.98em",
        letterSpacing: ".013em",
        marginRight: 7,
        minWidth: 75,
        textAlign: "center",
        boxShadow: label === "Critical" ? "0 0 8px #ff637355" : "none",
      }}
      aria-label={`Trust score ${score} (${label})`}
    >
      {label}{" "}
      <span
        style={{
          fontWeight: 600,
          color: "#92f2f6",
          fontSize: ".93em",
          marginLeft: 6,
        }}
      >
        {score}
      </span>
    </span>
  );
}

// Helper: simple chip for permission
function permissionChip(permission) {
  let color =
    permission === "Full Access"
      ? "var(--accent)"
      : permission === "Read/Write"
      ? "var(--secondary)"
      : "#b3fffd";
  return (
    <span
      style={{
        display: "inline-block",
        background: "rgba(255,255,255,0.045)",
        color,
        border: `1.2px solid ${color}`,
        fontWeight: 600,
        borderRadius: 15,
        fontSize: ".97em",
        padding: "2.7px 13px",
        letterSpacing: ".01em",
        minWidth: 84,
        marginRight: 6,
        textAlign: "center",
      }}
    >
      {permission}
    </span>
  );
}

// Helper: Themed action buttons
function ActionButton({ label, color, onClick }) {
  return (
    <button
      className="btn"
      style={{
        fontWeight: 600,
        background: color,
        color: color === "var(--secondary)" ? "#310826" : "#083a40",
        border: "none",
        borderRadius: 9,
        marginLeft: 7,
        marginRight: 0,
        fontSize: "0.98em",
        padding: "7px 14px",
        boxShadow: "0 1.2px 7px 0 #0003",
        opacity: 1,
        cursor: "pointer",
        transition: "background 0.2s, color 0.2s",
      }}
      tabIndex={0}
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// PUBLIC_INTERFACE
function AppRiskScanner() {
  // Handler: For now, mock with alerts only (could expand with modals/flows)
  function handleAction(action, appName) {
    window.alert(`${action} action for "${appName}" – (This is mock UI)`);
  }

  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 220,
        width: "100%",
        background: "rgba(255,255,255,0.039)",
        border: "1.7px solid var(--border-color)",
        boxShadow: "0 0 0 0 transparent",
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
      tabIndex={0}
      aria-label="Connected 3rd-party Apps and Risks"
    >
      {/* Widget heading */}
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.13rem",
          color: "var(--primary)",
          textShadow: "0px 2px 8px #0ff2",
          letterSpacing: ".017em",
          padding: "23px 21px 5px 23px",
        }}
      >
        Connected Apps & Platform Risk Scanner
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: ".99em",
          fontWeight: 500,
          marginBottom: 13,
          padding: "0 23px 9px 23px",
        }}
      >
        Review permissions, trust scores, and last usage of apps/platforms connected to your account. Take action to revoke or replace unsafe integrations.
      </div>
      {/* Table-like List */}
      <div
        style={{
          width: "100%",
          padding: "0 7px 14px 7px",
          flex: 1,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            minWidth: 350,
            fontSize: "1.0em",
            color: "var(--text-color)",
            marginTop: 2,
          }}
          aria-label="Connected Apps Table"
        >
          <thead>
            <tr style={{ textAlign: "left", color: "var(--secondary)", fontWeight: 700, fontSize: "1.03em" }}>
              <th style={{ padding: "8px 11px 6px 17px", letterSpacing: ".01em" }}>App/Platform</th>
              <th style={{ padding: "8px 11px" }}>Permission</th>
              <th style={{ padding: "8px 11px" }}>Trust Score</th>
              <th style={{ padding: "8px 11px" }}>Last Used</th>
              <th style={{ padding: "8px 9px", minWidth: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_APPS.map((app, idx) => (
              <tr
                key={app.name}
                style={{
                  background: idx % 2 === 0 ? "rgba(0,255,255,0.015)" : "rgba(255, 158, 219, .015)",
                  borderRadius: 15,
                  boxShadow: idx === 0 ? "0 2px 6px 0 #0002" : "none",
                  transition: "background 0.19s",
                  borderBottom: "1.1px solid var(--border-color)",
                }}
              >
                <td style={{
                  padding: "12px 9px 12px 17px",
                  fontWeight: 600,
                  color: "var(--primary)",
                  fontSize: "1.04em",
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}>
                  <span style={{
                    fontSize: "1.35em",
                    marginRight: 7,
                    verticalAlign: "middle"
                  }}>{app.icon}</span>
                  <span>
                    <div style={{ fontWeight: 700 }}>{app.name}</div>
                    <div style={{
                      color: "var(--secondary)",
                      fontWeight: 500,
                      fontSize: ".97em",
                      letterSpacing: ".005em"
                    }}>{app.platform}</div>
                  </span>
                </td>
                <td style={{ padding: "11px 8px" }}>
                  {permissionChip(app.permission)}
                </td>
                <td style={{ padding: "11px 8px" }}>
                  {trustBadge(app.trustScore)}
                </td>
                <td style={{ padding: "11px 8px", fontWeight: 500, color: "#aef" }}>{app.lastUsed}</td>
                <td style={{ padding: "11px 5px" }}>
                  <ActionButton
                    label="Review"
                    color="var(--secondary)"
                    onClick={() => handleAction("Review", app.name)}
                  />
                  <ActionButton
                    label="Revoke"
                    color="var(--accent)"
                    onClick={() => handleAction("Revoke", app.name)}
                  />
                  <ActionButton
                    label="Replace with safer app"
                    color="#ffc65f"
                    onClick={() => handleAction("Replace", app.name)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* If no apps */}
        {MOCK_APPS.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              margin: "47px 0",
              fontWeight: 500,
              letterSpacing: ".01em",
            }}
          >
            No connected apps/platforms detected.
          </div>
        )}
      </div>
    </div>
  );
}

export default AppRiskScanner;
