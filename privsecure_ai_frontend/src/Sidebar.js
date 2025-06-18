import React, { useState, useEffect } from "react";
import "./App.css";

// PUBLIC_INTERFACE
function Sidebar({ onNavigate }) {
  /**
   * Sidebar navigation component for PrivSecure AI.
   * Lists all modules, highlights the active section, enables smooth scroll,
   * and supports collapsed/overlay style on small screens.
   * Styled using primary/secondary theme colors.
   */
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

  // Handle navigation, smooth scroll and highlight
  useEffect(() => {
    const sections = navLinks.map(link => document.getElementById(link.id));
    const handleLinkClick = (e) => {
      if (e.target.hash && e.target.hash.startsWith("#")) {
        const el = document.getElementById(e.target.hash.slice(1));
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(null, '', e.target.hash);
          setSidebarOpen(false);
        }
        if (onNavigate) onNavigate(e.target.hash.slice(1));
      }
    };
    const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
    sidebarLinks.forEach(link =>
      link.addEventListener("click", handleLinkClick)
    );

    const handleScroll = () => {
      let current = navLinks[0].id;
      const scrollPos = window.scrollY + 100;
      for (const section of sections) {
        if (section && section.offsetTop <= scrollPos) {
          current = section.id;
        }
      }
      sidebarLinks.forEach(link => {
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      sidebarLinks.forEach(link =>
        link.removeEventListener("click", handleLinkClick)
      );
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            color: "var(--primary)",
            fontSize: "2rem",
            cursor: "pointer",
            display: sidebarOpen ? "none" : "block"
          }}
        >
          {/* Hamburger icon */}
          <span style={{
            display: "inline-block",
            width: 26,
            height: 3,
            background: "var(--primary)",
            borderRadius: 2,
            position: "relative",
            boxShadow: "0 8px var(--primary), 0 16px var(--primary)"
          }}></span>
        </button>
      )}

      {/* Overlay (when sidebar open on mobile) */}
      {collapsed && sidebarOpen &&
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={overlayStyle}
        />}

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
                <a href={`#${link.id}`} aria-label={link.label}>
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
