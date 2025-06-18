import React, { useRef, useState } from "react";

// PUBLIC_INTERFACE
/**
 * PrivacyManifestoGenerator:
 * - Displays a personalized privacy manifesto auto-generated from mock user behavior and preferences
 * - Exports the manifesto as a branded, themed PDF (with visual seal/logo)
 * - Fully themed & styled per PrivSecure AI
 */
function PrivacyManifestoGenerator(props) {
  // Themed app colors & logo (using CSS vars, fallback for SSR/test)
  const themeColors = {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    accent: "var(--accent)",
    bg: "rgba(255,255,255,0.037)",
    text: "var(--text-color)",
    textSecondary: "var(--text-secondary)",
    border: "var(--border-color)",
  };

  // Mock: user's privacy-related behavior and stated preferences
  const mockUser = {
    name: "Jordan Taylor",
    handle: "@jtaylor42",
    badge: "Data Minimalist",
    preferredLanguage: "English",
    preferences: [
      "Wants all trackers blocked by default",
      "Prefers minimal data retention (45 days)",
      "Disables ad personalization wherever possible",
      "Reviews app permissions every month",
      "Uses encrypted messaging apps",
      "Opted out of location data sharing",
      "Revokes old third-party app access regularly",
      "Enforces multi-factor authentication",
      "Deletes sensitive emails after 60 days",
    ],
    behaviors: [
      "Revoked 8+ third-party app integrations",
      "Enabled dark web leak alerts",
      "Rarely posts personal info on social media",
      "Earned 'Stealth Navigator' and 'Leak Survivor' badges",
      "High rate of reading privacy notices before sign-up",
      "Has automatic data disintegration scheduling enabled",
    ],
    avatar: null, // Optionally set a profile image
    manifestoIntro: "I believe privacy is a fundamental human right. My digital actions and preferences reflect my core goal: to minimize data risk, retain control, and foster digital wellbeing.",
  };

  // Visual identity logo/seal SVG (inline, to avoid reliance on external files)
  const logoSeal = (
    <svg
      aria-hidden="true"
      viewBox="0 0 52 52"
      width={52}
      height={52}
      style={{
        display: "inline-block",
        marginRight: 16,
        verticalAlign: "middle",
        filter: "drop-shadow(0 0 8px #0ff9)",
      }}
    >
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="3.2"
        opacity="0.84"
        style={{
          filter: "drop-shadow(0 0 7px #0ff5)",
        }}
      />
      <rect
        x="13" y="16" width="27" height="15" rx="6.6"
        fill="var(--accent)"
        opacity="0.26"
      />
      <path
        d="M24 35 q2 4 5 0"
        stroke="var(--secondary)"
        strokeWidth="2"
        fill="none"
      />
      <ellipse
        cx="24"
        cy="24"
        rx="5"
        ry="8"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.75"
        opacity="0.87"
      />
      <ellipse
        cx="28"
        cy="24"
        rx="6"
        ry="6"
        fill="none"
        stroke="var(--secondary)"
        strokeDasharray="4 2"
        strokeWidth="1"
        opacity="0.67"
      />
      <text
        x="25"
        y="32"
        textAnchor="middle"
        fill="var(--primary)"
        fontSize="10"
        fontWeight="700"
        letterSpacing=".06em"
        style={{
          fontFamily: "Arial, Inter, sans-serif",
          textShadow: "0 1px 7px #0ff",
        }}
      >
        PS
      </text>
    </svg>
  );

  // Manifesto main content -- can be multi-section
  function ManifestoContent({ user }) {
    return (
      <div id="manifesto-content" style={{ fontFamily: "'Inter', Arial, sans-serif", color: themeColors.text }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: `2px solid ${themeColors.primary}`,
            marginBottom: 18,
            gap: 7,
            paddingBottom: 13,
          }}
        >
          {logoSeal}
          <span>
            <div
              style={{
                fontWeight: 800,
                fontSize: "1.31em",
                color: themeColors.primary,
                lineHeight: 1,
                letterSpacing: ".026em",
                textShadow: "0 3px 14px #0ff6",
              }}
            >
              {user.name}'s Privacy Manifesto
            </div>
            <div
              style={{
                color: themeColors.textSecondary,
                fontWeight: 600,
                fontSize: "1.01em",
                letterSpacing: ".03em",
                marginTop: 2,
                marginLeft: 2,
              }}
            >
              {user.handle} · {user.badge ? <span style={{ color: themeColors.secondary }}>🏅 {user.badge}</span> : null}
            </div>
          </span>
        </div>
        {/* Intro */}
        <div
          style={{
            fontWeight: 600,
            fontSize: "1.07em",
            color: themeColors.secondary,
            marginBottom: 10,
          }}
        >
          {user.manifestoIntro}
        </div>
        {/* Preferences */}
        <div
          style={{
            margin: "25px 0 0 0",
            fontWeight: 700,
            color: themeColors.primary,
            fontSize: "1.065em",
            letterSpacing: ".012em",
            marginBottom: 5,
          }}
        >
          My Stated Privacy Preferences:
        </div>
        <ul style={{ margin: "0 0 0 18px", color: themeColors.text, fontWeight: 500, fontSize: "1.03em", marginBottom: 8 }}>
          {user.preferences.map((p, i) => (
            <li key={i} style={{ marginBottom: 4, color: themeColors.accent }}>
              <span style={{
                color: themeColors.secondary,
                fontWeight: 600,
                marginRight: 5,
              }}>✦</span>{" "}
              {p}
            </li>
          ))}
        </ul>
        {/* Behavior */}
        <div
          style={{
            marginTop: 18,
            fontWeight: 700,
            color: themeColors.primary,
            fontSize: "1.065em",
            marginBottom: 5,
            letterSpacing: ".012em",
          }}
        >
          My Demonstrated Privacy Behaviors:
        </div>
        <ul style={{ margin: "0 0 0 18px", color: themeColors.text, fontWeight: 500, fontSize: "1.03em" }}>
          {user.behaviors.map((b, i) => (
            <li key={i} style={{ marginBottom: 4 }}>
              <span style={{
                color: themeColors.primary,
                fontWeight: 600,
                marginRight: 5,
              }}>★</span> {b}
            </li>
          ))}
        </ul>
        {/* Closing */}
        <div
          style={{
            marginTop: 26,
            color: themeColors.textSecondary,
            fontWeight: 500,
            fontSize: "1.01em",
            letterSpacing: ".008em",
            borderTop: `1.2px solid ${themeColors.border}`,
            paddingTop: 11,
            marginBottom: 7,
          }}
        >
          Signed and generated with PrivSecure AI — empowering privacy-first digital citizens.
        </div>
        {/* App logo bruised branding */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          marginTop: 3,
        }}>
          {logoSeal}
          <span style={{ color: themeColors.secondary, fontWeight: 700, fontSize: "1.08em", letterSpacing: ".018em" }}>
            PrivSecure AI
          </span>
        </div>
      </div>
    );
  }

  // PDF Export Logic
  const contentRef = useRef();
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");
  // Dynamic import to avoid error if not present in build/tests
  async function handleExportPDF() {
    setExporting(true);
    setExportMsg("");
    try {
      // Use a lightweight html2pdf & dom-to-image bundle (user must add if deploying, here for mock/demo)
      // We'll attempt to load from CDN for html2pdf (demo); fallback: print dialog without branding.
      const html2pdfScript = document.createElement("script");
      html2pdfScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      document.body.appendChild(html2pdfScript);
      html2pdfScript.onload = () => {
        setTimeout(() => {
          const opt = {
            margin: 0.3,
            filename: "privsecure_privacy_manifesto.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              backgroundColor: "#011b32",
            },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all", "css", "legacy"] },
          };
          const el = contentRef.current;
          if (el && window.html2pdf) {
            window.html2pdf().from(el).set(opt).save();
            setExportMsg("Download started!");
          } else {
            setExportMsg("PDF export failed: Try using browser print (Ctrl+P).");
          }
          setExporting(false);
        }, 180); // render after script load
      };
      html2pdfScript.onerror = () => {
        setExportMsg("PDF export unavailable. Try using browser print (Ctrl+P).");
        setExporting(false);
      };
    } catch (e) {
      setExportMsg("PDF export failed (unsupported browser or adblocker?)");
      setExporting(false);
    }
  }
  // Button state handlers
  const disablePDF = exporting;

  // Themed widget container style
  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 320,
        width: "100%",
        background: themeColors.bg,
        border: `1.8px solid ${themeColors.border}`,
        boxShadow: "0 0 0 0 transparent",
        padding: "0",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      tabIndex={0}
      aria-label="Privacy manifesto generator widget"
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.17rem",
          color: themeColors.primary,
          textShadow: "0px 2px 13px #0ff2",
          letterSpacing: ".017em",
          padding: "23px 22px 15px 22px",
        }}
      >
        Privacy Manifesto Generator & Branded Export
      </div>
      <div
        style={{
          color: themeColors.textSecondary,
          fontSize: "1.03em",
          fontWeight: 500,
          marginBottom: 6,
          padding: "0 22px 0px 22px",
        }}
      >
        An auto-generated, personalized privacy policy based on your actual privacy-related behaviors and preferences. Download your manifesto as a PDF with official PrivSecure AI branding and a visual seal. (Demo uses mock data for UI showcase.)
      </div>

      {/* Manifesto Content for UI & export, themed for dark background */}
      <section
        ref={contentRef}
        tabIndex={-1}
        style={{
          background: "radial-gradient(ellipse at 48% 30%, #001b32 92%, #112F3A 100%)",
          borderRadius: 17,
          border: `2px solid ${themeColors.primary}`,
          boxShadow: "0 2.8px 30px 0 #0ff2",
          padding: "32px 26px 29px 26px",
          minWidth: 0,
          margin: "0 19px 0px 19px",
          marginTop: "13px",
          fontSize: "1.071em",
          color: themeColors.text,
          maxWidth: 720,
          width: "100%",
          alignSelf: "center",
        }}
        aria-label="Generated privacy manifesto"
      >
        <ManifestoContent user={mockUser} />
      </section>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 19,
          alignItems: "center",
          marginTop: 18,
          marginRight: 28,
          marginBottom: 5,
        }}
      >
        <button
          className="btn btn-large"
          style={{
            fontWeight: 700,
            background: themeColors.secondary,
            color: "#032",
            border: "none",
            borderRadius: 12,
            fontSize: "1.03em",
            padding: "10px 21px",
            cursor: disablePDF ? "not-allowed" : "pointer",
            boxShadow: "0 0.7px 15px 0 #ff9edb2a",
            transition: "background 0.19s, color 0.18s, transform .14s",
            opacity: disablePDF ? 0.48 : 1,
            textShadow: "0 1px 7px #fff2",
            letterSpacing: ".016em",
            marginRight: 0,
            marginLeft: 0,
            marginTop: 0,
          }}
          tabIndex={0}
          disabled={disablePDF}
          aria-label="Export privacy manifesto PDF"
          onClick={handleExportPDF}
        >
          {exporting ? "Exporting..." : (
            <>
              <span aria-hidden style={{ marginRight: 8, fontWeight: 800 }}>⭳</span>
              Export PDF (with seal)
            </>
          )}
        </button>
        <span
          style={{
            fontSize: ".98em",
            color: "#0ff",
            opacity: exportMsg ? 0.94 : 0,
            fontWeight: 600,
            marginLeft: 9,
          }}
        >
          {exportMsg}
        </span>
      </div>
      {/* Footer / tip for demo */}
      <div
        style={{
          marginTop: 1,
          color: themeColors.textSecondary,
          fontSize: ".95em",
          textAlign: "right",
          paddingRight: 18,
          letterSpacing: ".007em",
        }}
      >
        Demo: Data and manifest are static/mocked for UI showcase. PDF uses html2pdf.js from CDN.
      </div>
    </div>
  );
}

export default PrivacyManifestoGenerator;
