import React from "react";

/**
 * AboutPage - Clear, accessible overview of PrivSecure AI,
 * styled to match app theme.
 */
// PUBLIC_INTERFACE
function AboutPage() {
  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 230,
        width: "100%",
        background: "rgba(255,255,255,0.040)",
        border: "1.8px solid var(--border-color)",
        borderRadius: "var(--widget-radius, 16px)",
        boxShadow: "0 0 0 0 transparent",
        color: "var(--text-color)",
        padding: "0",
        margin: "0 auto",
        maxWidth: 720,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', 'Roboto', 'Helvetica', Arial, sans-serif",
      }}
      tabIndex={0}
      aria-label="About PrivSecure AI"
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.19rem",
          color: "var(--primary)",
          textShadow: "0px 2px 10px #0ff6",
          letterSpacing: ".018em",
          padding: "28px 28px 4px 28px",
        }}
      >
        About PrivSecure AI
      </div>
      <div
        style={{
          color: "var(--secondary)",
          fontWeight: 700,
          fontSize: "1.045em",
          margin: "0 28px 13px 28px",
        }}
      >
        Privacy-First. AI-Powered. In Control of Your Digital World.
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontWeight: 500,
          fontSize: "1.08em",
          margin: "0 28px 17px 28px",
          lineHeight: 1.6,
        }}
      >
        <b>PrivSecure AI</b> is your personal digital guardian&mdash;an app designed to keep your data safe, your privacy protected, and your digital life secure. Our mission: empower you with easy, AI-powered tools for real-time digital exposure alerts, privacy management, and peace of mind.
      </div>
      <ul
        style={{
          margin: "0 38px 20px 44px",
          color: "var(--text-color)",
          fontSize: "1.01em",
          fontWeight: 500,
          padding: 0,
          lineHeight: 1.6,
          listStyle: "disc",
        }}
      >
        <li>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>
            Real-Time Exposure Dashboard
          </span>: Instantly see your digital exposure and receive up-to-the-minute alerts.
        </li>
        <li>
          <span style={{ color: "var(--secondary)", fontWeight: 600 }}>
            AI Privacy Action Plan
          </span>: Get smart suggestions to reduce risks, with interactive checklists and progress tracking.
        </li>
        <li>
          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
            Third-Party App & Leak Monitoring
          </span>: Review connected apps, detect data breaches, and revoke unsafe permissions in one click.
        </li>
        <li>
          <span style={{ color: "#ffc65f", fontWeight: 600 }}>
            Visual Risk & Social Graph Maps
          </span>: Understand your network risk and privacy at a glance.
        </li>
        <li>
          <span style={{ color: "#13fff7", fontWeight: 600 }}>
            Privacy Badges & Personal Manifesto
          </span>: Earn badges and generate your own privacy manifesto to stay motivated and informed.
        </li>
      </ul>
      <div
        style={{
          color: "var(--text-secondary)",
          fontWeight: 500,
          fontSize: ".99em",
          margin: "0 28px 17px 28px",
        }}
      >
        <b>Your privacy comes first.</b> PrivSecure AI stores all analysis data locally in your browser by default. No personal data is sent to a cloud, unless you request it or link specific secure accounts. We never sell or share your data.
      </div>
      <div
        style={{
          color: "var(--primary)",
          fontWeight: 650,
          fontSize: "1.02em",
          margin: "0 0 24px 0",
          textAlign: "center",
          letterSpacing: ".018em",
        }}
      >
        Stay private. Stay safe. Stay secure&mdash;with PrivSecure AI.
      </div>
    </div>
  );
}

export default AboutPage;
