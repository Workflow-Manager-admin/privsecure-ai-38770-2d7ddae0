import React, { useState, useEffect } from "react";
import "./App.css";
import { useTheme } from "./ThemeContext";

// PUBLIC_INTERFACE
function Sidebar({ onNavigate, activePage }) {
  /**
   * Sidebar navigation component for PrivSecure AI.
   * Now performs "page" navigation via state, not scroll.
   * Highlights and switches based on parent-held navigation state.
   */
  const { colors } = useTheme();
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { id: "dashboard", label: "Dashboard" },
    { id: "privacy-plan", label: "Privacy Plan" },
    { id: "digital-twin", label: "Digital Twin" },
    { id: "app-risk", label: "App Risks" },
    { id: "dark-web", label: "Dark Web" },
    { id: "graph-map", label: "Social Graph" },
    { id: "scheduler", label: "Scheduler" },
    { id: "badges", label: "Badges" },
    { id: "manifesto", label: "Manifesto" },
    { id: "settings", label: "Settings" },
    { id: "about", label: "About" }
  ];

  // Handle window resize for collapsed state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Navigation: no scroll, only page switch via prop call.
  const handleLinkClick = (e, id) => {
    e.preventDefault();
    if (onNavigate) onNavigate(id);
    setSidebarOpen(false);
  };

  // Overlay for small screens
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(20, 38, 85, 0.64)",
    zIndex: 19,
    cursor: "pointer"
  };

  return (
    <>
      {/* Hamburger for mobile/tablet */}
      {collapsed && (
        <button
          className="sidebar-hamburger"
          aria-label="Open navigation menu"
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "fixed",
            top: 18,
            left: 14,
            zIndex: 30,
            background: "none",
            border: "none",
            color: colors.primary,
            fontSize: "2rem",
            cursor: "pointer",
            display: sidebarOpen ? "none" : "block"
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 26,
              height: 3,
              background: colors.primary,
              borderRadius: 2,
              position: "relative",
              boxShadow: `0 8px ${colors.primary}, 0 16px ${colors.primary}`
            }}
          ></span>
        </button>
      )}

      {/* Overlay */}
      {collapsed && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={overlayStyle}
        />
      )}

      <aside
        className="sidebar"
        style={
          collapsed
            ? {
                position: "fixed",
                height: "100vh",
                left: sidebarOpen ? 0 : `calc(-1 * var(--sidebar-width))`,
                top: 0,
                zIndex: 35,
                width: "var(--sidebar-width)",
                minWidth: "var(--sidebar-width)",
                background: "var(--base-sidebar)",
                boxShadow: sidebarOpen
                  ? "2px 0 18px 0 #0007"
                  : "none",
                transition: "left 0.25s"
              }
            : {}
        }
        aria-label="Sidebar navigation"
      >
        <div className="sidebar-logo">
          {/* Shield/Lock SVG Icon */}
          <span className="sidebar-logo-symbol" aria-label="logo">
            {/* SVG Shield+Lock */}
            <svg
              viewBox="0 0 28 28"
              width="28"
              height="28"
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: 4,
                filter: 'drop-shadow(0 0 2px var(--secondary))',
              }}
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="themeShield" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.87"/>
                  <stop offset="85%" stopColor="var(--accent)" stopOpacity="0.44"/>
                </linearGradient>
              </defs>
              <path
                d="M14 3 L24 7.5 V13.8C24 20.1 14 25 14 25C14 25 4 20.1 4 13.8V7.5L14 3Z"
                fill="url(#themeShield)"
                stroke="var(--primary)"
                strokeWidth="1.8"
                opacity="0.92"
              />
              {/* Lock - body */}
              <rect
                x="9.7"
                y="13.3"
                width="8.6"
                height="6"
                rx="2.1"
                fill="var(--base-sidebar)"
                stroke="var(--secondary)"
                strokeWidth="1"
                opacity="0.89"
              />
              {/* Lock - shackle */}
              <path
                d="M11.9 15.4V14.6C11.9 13.1 13 12 14 12s2.1 1.1 2.1 2.6v0.8"
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="1.04"
                opacity="0.92"
              />
              {/* Lock - keyhole */}
              <circle
                cx="14"
                cy="17"
                r="0.74"
                fill="var(--primary)"
                opacity="0.85"
              />
            </svg>
          </span>
          <span className="sidebar-title">PrivSecure AI</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navLinks.map(link => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-label={link.label}
                  className={activePage === link.id ? "active" : ""}
                  onClick={e => handleLinkClick(e, link.id)}
                  tabIndex={0}
                  style={
                    activePage === link.id
                      ? {
                          color: colors.primary,
                          background: "rgba(9, 229, 243, 0.09)",
                          borderLeft: `3px solid ${colors.primary}`
                        }
                      : {}
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
