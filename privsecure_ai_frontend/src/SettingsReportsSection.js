import React, { useState } from "react";

// Helper: Icon for platform/device sync
function SyncStatusIcon({ online }) {
  return (
    <span
      style={{
        display: "inline-block",
        marginRight: 8,
        borderRadius: "50%",
        width: 15,
        height: 15,
        background: online
          ? "linear-gradient(90deg, var(--primary), #13ffbb)"
          : "linear-gradient(87deg, #7c91a4, #3b4457)",
        boxShadow: online
          ? "0 0 9px 0 #0ff9"
          : "0 0 7px 0 #7c91a455",
        border: online
          ? "1.7px solid var(--primary)"
          : "1.1px solid #aaa",
        position: "relative",
      }}
      aria-label={online ? "Online" : "Offline"}
      title={online ? "Online" : "Offline"}
    />
  );
}

// Helper: Pretty time since last sync
function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}

// PUBLIC_INTERFACE
/**
 * SettingsReportsSection
 * - Mock UI for settings: syn status for platforms/devices, report downloads, AI customization sliders/toggles.
 * - Themed, well-aligned, responsive, mock/static data only.
 */
function SettingsReportsSection() {
  // Mock: Platform/device sync state
  const MOCK_SYNC = [
    {
      type: "Google",
      label: "Google Account",
      icon: "🔗",
      status: "online",
      lastSync: Date.now() - 2 * 60 * 1000,
    },
    {
      type: "iPhone",
      label: "iPhone 15 Pro",
      icon: "📱",
      status: "online",
      lastSync: Date.now() - 46 * 1000,
    },
    {
      type: "Windows",
      label: "Windows PC",
      icon: "💻",
      status: "offline",
      lastSync: Date.now() - 2.5 * 3600 * 1000,
    },
    {
      type: "Meta",
      label: "Meta Portal",
      icon: "🕶️",
      status: "online",
      lastSync: Date.now() - 13 * 60 * 1000,
    },
  ];

  // Settings: AI customization state (mock, local only)
  const [aggressiveness, setAggressiveness] = useState(2); // 0..4
  const [frequency, setFrequency] = useState("normal");
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);

  // Handler: Download mock report
  function handleDownloadReport() {
    // Create mock file as a blob
    const txt = `Mock Weekly Exposure Report\n\n(For demo only)\n\nExposure Level: 74 (Moderate)\nActions This Week: 5\n------------------------------
- Google Account Synced: ✔️
- iPhone Synced: ✔️
- PC Sync: Offline
- Most common risk: Third-party apps\n\nAI Recommendations: Enable stricter privacy for high-risk apps.`;
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "weekly_exposure_report.txt";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 70);
  }

  // Aggressiveness slider marks/descriptions
  const AGG_STEPS = [
    { label: "Low", tip: "Suggest only clear risks" },
    { label: "Medium", tip: "Suggest moderate + clear risks" },
    { label: "Normal", tip: "Balance risk/suggestions" },
    { label: "High", tip: "Suggest nearly all risks" },
    { label: "Max", tip: "Aggressive (warn on almost everything)" },
  ];
  // Frequency options
  const FREQ_OPTS = [
    { value: "rare", label: "Rare (Monthly)" },
    { value: "normal", label: "Normal (Weekly)" },
    { value: "frequent", label: "Frequent (Daily)" },
    { value: "real-time", label: "Real-Time" },
  ];

  // Main UI Layout
  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 340,
        width: "100%",
        background: "rgba(255,255,255,0.038)",
        border: "1.9px solid var(--border-color)",
        boxShadow: "0 0 0 0 transparent",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        padding: 0,
        position: "relative",
      }}
      tabIndex={0}
      aria-label="Settings and reports widget"
    >
      {/* Section Header */}
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.16rem",
          color: "var(--primary)",
          textShadow: "0px 2px 11px #0ff2",
          letterSpacing: ".018em",
          padding: "23px 23px 5px 23px",
        }}
      >
        Settings & Reports
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.01em",
          fontWeight: 500,
          marginBottom: 11,
          padding: "0 23px 4px 23px",
        }}
      >
        Manage sync for your connected platforms and devices, customize AI privacy
        engine behaviors, and download your latest exposure reports.
      </div>
      {/* Main two-column layout (responsive grid for mobile) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 350px) 1fr",
          gap: "29px",
          alignItems: "flex-start",
          width: "100%",
          padding: "0 14px 17px 14px",
        }}
      >
        {/* Column 1: Connected Platforms/Devices & Download */}
        <div style={{ width: "100%", maxWidth: 360, minWidth: 0 }}>
          <div
            style={{
              marginBottom: 17,
              background: "rgba(255,255,255,0.056)",
              border: "1.21px solid var(--border-color)",
              borderRadius: 13,
              padding: "16px 14px 10px 17px",
              boxShadow: "0 0.8px 7px #0011",
            }}
          >
            <div
              style={{
                color: "var(--secondary)",
                fontWeight: 700,
                fontSize: "1.03em",
                marginBottom: 7,
                letterSpacing: ".01em",
              }}
            >
              Platform & Device Sync Status
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {MOCK_SYNC.map((entry, i) => (
                <li
                  key={entry.type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                    color:
                      entry.status === "online"
                        ? "var(--primary)"
                        : "#999fbb",
                    fontSize: "1.01em",
                    letterSpacing: ".01em",
                    marginBottom: 4,
                    gap: 9,
                    opacity: entry.status === "offline" ? 0.67 : 1,
                  }}
                >
                  <span style={{ fontSize: "1.22em", marginRight: 8 }}>
                    {entry.icon}
                  </span>
                  <span>{entry.label}</span>
                  <SyncStatusIcon online={entry.status === "online"} />
                  <span
                    style={{
                      color: entry.status === "online" ? "#42fac3" : "#bbb",
                      fontWeight: 500,
                      fontSize: ".98em",
                      marginLeft: 5,
                      marginRight: 2,
                    }}
                  >
                    {entry.status === "online" ? "Online" : "Offline"}
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      color: "#9ff",
                      fontWeight: 400,
                      fontSize: ".94em",
                      opacity: 0.85,
                    }}
                  >
                    Last sync: {timeAgo(entry.lastSync)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Download Report Button */}
          <div
            style={{
              marginBottom: 9,
              paddingLeft: 3,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              className="btn btn-large"
              style={{
                background: "var(--secondary)",
                color: "#0a263d",
                border: "none",
                fontWeight: 700,
                borderRadius: 13,
                fontSize: "1.06em",
                padding: "10px 23px",
                margin: "0",
                boxShadow: "0 2px 20px 0 #ff9edb2a",
                transition: "background 0.16s, color 0.18s, transform .14s",
                letterSpacing: ".012em",
                outline: "none",
                cursor: "pointer",
                marginTop: 0,
                marginBottom: 0,
                textShadow: "0 1px 7px #fff2",
              }}
              tabIndex={0}
              aria-label="Download Weekly Exposure Report"
              onClick={handleDownloadReport}
            >
              <span
                aria-hidden
                style={{ marginRight: 8, fontWeight: 800, fontSize: "1.21em" }}
              >
                ⭳
              </span>
              Download Weekly Report
            </button>
            <span
              style={{
                color: "var(--text-secondary)",
                fontWeight: 500,
                fontSize: ".98em",
              }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>TXT</span> •
              Mock sample for demo
            </span>
          </div>
        </div>
        {/* Column 2: AI Customization Controls */}
        <div style={{ minWidth: 0, width: "100%" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.048)",
              border: "1.3px solid var(--border-color)",
              borderRadius: 13,
              boxShadow: "0 0.6px 7px #0011",
              padding: "18px 21px 19px 21px",
              width: "100%",
              maxWidth: 510,
              margin: "0",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "1.06em",
                color: "var(--primary)",
                marginBottom: 10,
                letterSpacing: ".013em",
              }}
            >
              AI Privacy Engine Customization
            </div>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 19,
                width: "100%",
                marginBottom: 0,
              }}
              onSubmit={(e) => e.preventDefault()}
            >
              {/* Aggressiveness Slider */}
              <div>
                <label
                  htmlFor="ai-agg-slider"
                  style={{
                    fontWeight: 600,
                    color: "var(--secondary)",
                    letterSpacing: ".01em",
                  }}
                >
                  Suggestion Aggressiveness:
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <input
                    id="ai-agg-slider"
                    type="range"
                    min={0}
                    max={4}
                    value={aggressiveness}
                    onChange={(e) => setAggressiveness(Number(e.target.value))}
                    style={{
                      width: 150,
                      accentColor: "var(--primary)",
                      marginRight: 17,
                      marginLeft: 0,
                      height: 3,
                    }}
                    aria-valuenow={aggressiveness}
                    aria-valuetext={AGG_STEPS[aggressiveness].label}
                  />
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        aggressiveness < 2
                          ? "#aef"
                          : aggressiveness === 2
                          ? "var(--primary)"
                          : "#ff6373",
                      background: "rgba(0,255,255,0.06)",
                      borderRadius: 8,
                      fontSize: ".98em",
                      padding: "2px 12px",
                      border:
                        aggressiveness < 2
                          ? "1.2px solid #11dfee"
                          : aggressiveness === 2
                          ? "1.2px solid var(--primary)"
                          : "1.2px solid #ff6373",
                    }}
                  >
                    {AGG_STEPS[aggressiveness].label}
                  </span>
                </div>
                <div
                  style={{
                    color: "#c5f9ef",
                    fontWeight: 500,
                    fontSize: ".96em",
                    marginTop: 2,
                  }}
                >
                  {AGG_STEPS[aggressiveness].tip}
                </div>
              </div>
              {/* Frequency Selector */}
              <div>
                <label
                  htmlFor="ai-freq-select"
                  style={{
                    fontWeight: 600,
                    color: "var(--secondary)",
                    letterSpacing: ".01em",
                  }}
                >
                  Suggestion Frequency:
                </label>
                <select
                  id="ai-freq-select"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  style={{
                    marginLeft: 12,
                    border: "1.1px solid var(--secondary)",
                    borderRadius: 9,
                    background: "#082a3818",
                    color: "var(--primary)",
                    fontWeight: 600,
                    fontSize: ".97em",
                    padding: "4.5px 13px",
                  }}
                  aria-label="AI Suggestion frequency"
                >
                  {FREQ_OPTS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Enable/Disable AI Suggestions toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <label
                  htmlFor="ai-suggestion-toggle"
                  style={{
                    fontWeight: 600,
                    color: "var(--secondary)",
                    letterSpacing: ".01em",
                  }}
                >
                  Enable Privacy Suggestions:
                </label>
                <input
                  id="ai-suggestion-toggle"
                  type="checkbox"
                  checked={suggestionsEnabled}
                  onChange={() => setSuggestionsEnabled((v) => !v)}
                  style={{
                    width: 26,
                    height: 26,
                    accentColor: "var(--secondary)",
                    borderRadius: 7,
                  }}
                  aria-checked={suggestionsEnabled}
                  aria-label="Enable privacy suggestions"
                />
                <span
                  style={{
                    fontWeight: 700,
                    color: suggestionsEnabled
                      ? "#18ffe2"
                      : "var(--text-secondary)",
                    fontSize: ".97em",
                    marginLeft: 3,
                  }}
                >
                  {suggestionsEnabled ? "ON" : "OFF"}
                </span>
              </div>
            </form>
          </div>
          {/* Info box */}
          <div
            style={{
              color: "var(--text-secondary)",
              fontSize: ".98em",
              marginTop: 10,
              marginLeft: 3,
              borderLeft: "3.1px solid var(--primary)",
              paddingLeft: 13,
              opacity: 0.81,
              fontWeight: 500,
            }}
          >
            All settings are local and affect only your experience.
          </div>
        </div>
      </div>
      {/* Responsive: stack grid at small size */}
      <style>{`
        @media (max-width: 850px) {
          .widget[aria-label="Settings and reports widget"] > div[style*='grid'] {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 0 5vw 17px 5vw;
          }
        }
        @media (max-width: 520px) {
          .widget[aria-label="Settings and reports widget"] > div[style*='grid'] {
            padding: 0 1vw 13px 1vw !important;
          }
        }
      `}</style>
      {/* Footer */}
      <div
        style={{
          marginTop: 7,
          color: "var(--text-secondary)",
          fontSize: "0.94em",
          textAlign: "right",
          paddingRight: 18,
          letterSpacing: ".007em",
        }}
      >
        Demo: All data is mock/static. No real connections or config saved.
      </div>
    </div>
  );
}

export default SettingsReportsSection;
