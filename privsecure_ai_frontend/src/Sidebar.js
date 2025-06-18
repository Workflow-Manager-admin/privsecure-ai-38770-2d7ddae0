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
    { id: "settings", label: "Settings" }
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
          <span className="sidebar-logo-symbol">*</span>
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
