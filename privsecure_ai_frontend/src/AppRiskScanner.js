import React, { useState } from "react";

/**
 * Mock data for connected third-party apps/platforms
 */
const MOCK_APPS_INIT = [
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
function ActionButton({ label, color, onClick, disabled }) {
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
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s, color 0.2s",
      }}
      tabIndex={0}
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

// Small dialog modal for confirm (not using an external library)
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  app,
  loading,
}) {
  if (!open || !app) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: 0, top: 0, width: "100vw", height: "100vh",
        zIndex: 50,
        background: "rgba(0,16,48,0.28)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        style={{
          minWidth: 340,
          background: "rgba(0,10,36,0.94)",
          borderRadius: 14,
          border: "1.8px solid var(--accent)",
          boxShadow: "0 8px 43px #000b",
          padding: "30px 23px 19px 23px",
          maxWidth: "94vw",
          color: "#fff",
          outline: "none"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "2.4em" }}>{app.icon || "⚠️"}</span>
          <span style={{ fontSize: "1.19em", fontWeight: 700, color: "var(--accent)" }}>Revoke App: <span style={{ color: "var(--primary)" }}>{app.name}</span></span>
        </div>
        <div style={{ margin: "18px 0 13px 0", fontWeight: 500, color: "var(--text-secondary)" }}>
          Are you sure you want to revoke access for <b>{app.name}</b>?<br/>
          The following permissions will be lost:
          <ul style={{ margin: "7px 0 0 18px", padding: 0 }}>
            <li>
              <span>{permissionChip(app.permission)}</span>
              <span style={{ marginLeft: 7, color: "var(--secondary)", fontWeight: 600 }}>
                ({app.permission === "Full Access"
                  ? "Can read, modify, and delete your data"
                  : app.permission === "Read/Write"
                  ? "Can read and change most account data"
                  : "Limited: Only profile details"})</span>
            </li>
          </ul>
        </div>
        <div style={{ fontSize: ".97em", color: "#ffb2e5", marginBottom: 16 }}>
          This action can't be undone unless you actively reconnect the app.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <ActionButton
            label="Cancel"
            color="var(--secondary)"
            onClick={onClose}
            disabled={loading}
          />
          <ActionButton
            label={loading ? "Revoking..." : "Confirm Revoke"}
            color="var(--accent)"
            onClick={onConfirm}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Toast/notification for revoke/undo flow,
 * supports rich msg content (React node), UNDO button, and auto-dismiss after timeout.
 */
function ToastNotification({ open, msg, undoLabel, onUndo, timeout = 10000 }) {
  const [visible, setVisible] = useState(open);

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [open, timeout]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 29, right: 29,
        zIndex: 90,
        background: "rgba(14,40,44,0.96)",
        borderRadius: 14,
        border: "1.6px solid var(--accent)",
        boxShadow: "0 3px 38px #00ffd59c",
        minWidth: 230,
        maxWidth: 389,
        padding: "14px 23px 12px 21px",
        color: "#fff",
        fontWeight: 500,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.23s"
      }}
      aria-live="assertive"
      tabIndex={-1}
    >
      <span style={{ marginRight: 19 }}>
        {typeof msg === "string" ? msg : msg}
      </span>
      {!!onUndo && (
        <button
          onClick={onUndo}
          style={{
            background: "none",
            border: "none",
            fontWeight: 700,
            color: "#55feff",
            marginLeft: 7,
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "1em"
          }}
        >
          {undoLabel || "Undo"}
        </button>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function AppRiskScanner() {
  // Enhanced stateful app list to allow UI updates on revoke/undo
  const [apps, setApps] = useState(
    MOCK_APPS_INIT.map((a) => ({ ...a, revoked: false }))
  );
  // State for confirmation dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingRevokeApp, setPendingRevokeApp] = useState(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    appIdx: null,
    undoable: false,
  });

  // Handler: Enhanced action for "Revoke" with confirmation and permission summary
  function handleRevokeClick(app, idx) {
    setPendingRevokeApp({ ...app, idx });
    setDialogOpen(true);
  }

  // Handler: Confirm user wants to revoke (with simulated OAuth call, notification + UNDO)
  function handleRevokeConfirm() {
    if (!pendingRevokeApp) return;
    setIsRevoking(true);
    // Simulate OAuth/API call to revoke (fake latency, as required)
    setTimeout(() => {
      setApps((apps) =>
        apps.map((app, i) =>
          i === pendingRevokeApp.idx ? { ...app, revoked: true } : app
        )
      );
      setDialogOpen(false);
      setIsRevoking(false);
      setToast({
        open: true,
        msg: (
          <>
            <span>Access revoked for &quot;{pendingRevokeApp.name}&quot;.</span>
            <span style={{ marginLeft: 8, color: "#15ffe7", fontWeight: 600 }}>Privacy risk reduced.</span>
          </>
        ),
        appIdx: pendingRevokeApp.idx,
        undoable: true,
      });
      setPendingRevokeApp(null);
    }, 940);
  }

  // Handler: Undo revoke
  function handleUndoRevoke() {
    if (toast.appIdx == null) return;
    setApps((apps) =>
      apps.map((app, i) =>
        i === toast.appIdx
          ? { ...app, revoked: false }
          : app
      )
    );
    setToast({ open: false, msg: "", appIdx: null, undoable: false });
  }

  // Hide toast after finish
  function handleToastClose() {
    setToast(t => ({ ...t, open: false, undoable: false }));
  }

  // Handler for review and replace (unchanged, stub)
  function handleAction(action, appName) {
    window.alert(`${action} action for "${appName}" – (This is mock UI)`);
  }

  // Privacy score: dynamically calculate from non-revoked apps
  const privacyScore = (() => {
    // Simple model: average trust score, 15% bonus for each revoked, but won't exceed 100.
    const nonRevoked = apps.filter((a) => !a.revoked);
    let score = nonRevoked.length
      ? Math.round(
          nonRevoked.reduce((acc, a) => acc + a.trustScore, 0) /
            nonRevoked.length
        )
      : 100; // all revoked = perfect privacy
    const revokedCount = apps.filter((a) => a.revoked).length;
    score = Math.min(100, Math.round(score + revokedCount * 9.5));
    return score;
  })();

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
        Review permissions, trust scores, last usage of apps connected to your account.
        Take action to revoke unsafe integrations.
        <span style={{ marginLeft: 19, color: "var(--accent)", fontWeight: 700, float: "right", fontSize: ".99em" }}>
          Privacy Score: <span style={{
           color: "#12fff6", textShadow: "0 0 8px #0ff5", fontWeight: 800, fontSize: "1.09em"
          }}>{privacyScore}</span>
        </span>
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
            {apps.map((app, idx) => (
              <tr
                key={app.name}
                style={{
                  background: idx % 2 === 0 ? "rgba(0,255,255,0.015)" : "rgba(255, 158, 219, .015)",
                  borderRadius: 15,
                  boxShadow: idx === 0 ? "0 2px 6px 0 #0002" : "none",
                  transition: "background 0.19s",
                  borderBottom: "1.1px solid var(--border-color)",
                  opacity: app.revoked ? 0.46 : 1,
                  filter: app.revoked ? "grayscale(0.82) blur(0.13px)" : "",
                  pointerEvents: app.revoked ? "none" : "auto"
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
                <td style={{ padding: "11px 8px", fontWeight: 500, color: "#aef" }}>
                  {app.lastUsed}
                </td>
                <td style={{ padding: "11px 5px" }}>
                  <ActionButton
                    label="Review"
                    color="var(--secondary)"
                    onClick={() => handleAction("Review", app.name)}
                    disabled={app.revoked}
                  />
                  <ActionButton
                    label={app.revoked ? "Revoked" : "Revoke"}
                    color="var(--accent)"
                    onClick={() => handleRevokeClick(app, idx)}
                    disabled={app.revoked}
                  />
                  <ActionButton
                    label="Replace with safer app"
                    color="#ffc65f"
                    onClick={() => handleAction("Replace", app.name)}
                    disabled={app.revoked}
                  />
                  {app.revoked && (
                    <span
                      style={{
                        marginLeft: 9,
                        color: "#f7f7f6",
                        background: "#282e47",
                        borderRadius: 9,
                        fontWeight: 700,
                        fontSize: ".97em",
                        padding: "2px 13px",
                        letterSpacing: ".019em",
                        border: "1.15px solid #12fff4",
                        filter: "none",
                        opacity: 0.92,
                      }}
                    >
                      Revoked
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* If no non-revoked apps */}
        {apps.length === 0 && (
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
      <ConfirmDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setPendingRevokeApp(null);
        }}
        onConfirm={handleRevokeConfirm}
        app={pendingRevokeApp}
        loading={isRevoking}
      />
      <ToastNotification
        open={toast.open}
        msg={toast.msg}
        undoLabel={toast.undoable ? "Undo" : undefined}
        onUndo={toast.undoable ? handleUndoRevoke : undefined}
        timeout={10000}
      />
    </div>
  );
}

export default AppRiskScanner;
