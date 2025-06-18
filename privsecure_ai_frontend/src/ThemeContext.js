import React, { createContext, useContext, useMemo, useEffect, useState } from "react";

/**
 * Theme context for PrivSecure AI
 * Provides theme mode (light/dark), color palette, and a hook to update the theme variables.
 * This is minimal, ready for theme toggling or dynamic customization.
 */

// PUBLIC_INTERFACE
export const ThemeContext = createContext({
  mode: "light",
  colors: {
    primary: "#0ff",
    secondary: "#ff9edb",
    accent: "#0ff",
    baseDark: "#00008b",
    baseSidebar: "#184e77",
    text: "#fff",
    textSecondary: "rgba(255,255,255,0.7)",
    border: "rgba(255,255,255,0.1)"
  },
  setTheme: () => {}
});

// PUBLIC_INTERFACE
export function ThemeProvider({ children }) {
  // Hook: support theme switch in the future
  const [mode, setMode] = useState("light");
  // Palette can be extended for customizable themes
  const colors = useMemo(() => ({
    primary: "#0ff",
    secondary: "#ff9edb",
    accent: "#0ff",
    baseDark: "#00008b",
    baseSidebar: "#184e77",
    text: "#fff",
    textSecondary: "rgba(255,255,255,0.7)",
    border: "rgba(255,255,255,0.1)"
  }), []);
  // Sync CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--base-dark', colors.baseDark);
    root.style.setProperty('--base-sidebar', colors.baseSidebar);
    root.style.setProperty('--text-color', colors.text);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--border-color', colors.border);
  }, [colors, mode]);
  // Future: setTheme could support mode/color changes
  const setTheme = (opts = {}) => {
    // Extend to actually switch light/dark or custom colors
    if (opts.mode) setMode(opts.mode);
    // In a real implementation, also update palette, etc.
  };
  // Provide context value
  const value = useMemo(() => ({
    mode,
    colors,
    setTheme
  }), [mode, colors]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useTheme() {
  /** Hook to access theme context. */
  return useContext(ThemeContext);
}
