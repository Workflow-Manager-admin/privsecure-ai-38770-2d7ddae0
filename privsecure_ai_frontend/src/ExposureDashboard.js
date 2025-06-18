import React, { useRef, useEffect } from "react";
import { useTheme } from "./ThemeContext";

// Mock data for visuals
const exposureScore = 74;
const trendData = [62, 64, 61, 67, 70, 72, 76, 74, 74, 73, 71, 74];
const categories = [
  { key: "Social", value: 36, colorVar: "--primary" },
  { key: "Email", value: 21, colorVar: "--secondary" },
  { key: "Apps", value: 15, colorVar: "--accent" },
  { key: "Devices", value: 11, colorVar: "--text-secondary" },
  { key: "Search", value: 17, colorVar: "--border-color" },
];
const alerts = [
  { type: "Breach", msg: "Unusual login detected from new device (Chrome, Chicago).", time: "Now" },
  { type: "Tracking", msg: "4 trackers linked to Social Accounts in past 24h.", time: "2m ago" },
  { type: "Leak", msg: "Dark web data match for your main email.", time: "6m ago" },
];

// UTIL
function getCssVar(varName, fallback = "#0ff") {
  return getComputedStyle(document.documentElement).getPropertyValue(varName) || fallback;
}

// SVG: Radial exposure score chart (0-100, animated)
function RadialScoreChart({ score, size = 108, stroke = 13 }) {
  // Animation hook
  const [animatedScore, setAnimatedScore] = React.useState(0);
  const reqRef = useRef(null);
  useEffect(() => {
    let start;
    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 900, 1); // ~0.9s animation
      setAnimatedScore(Math.floor(progress * score));
      if (progress < 1) {
        reqRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatedScore(score);
      }
    }
    reqRef.current = requestAnimationFrame(animate);
    return () => reqRef.current && cancelAnimationFrame(reqRef.current);
  }, [score]);

  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(animatedScore, 100)) / 100;
  const themeColor = getCssVar("--primary");
  const bgColor = getCssVar("--border-color", "#222a");
  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        stroke={bgColor}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        stroke={themeColor}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        style={{
          filter: "drop-shadow(0 0 8px var(--primary))",
          transition: "stroke-dashoffset 0.25s"
        }}
      />
      <text
        x="50%"
        y="53%"
        fill="var(--primary)"
        fontSize={size * 0.26}
        fontWeight="bold"
        textAnchor="middle"
        style={{ dominantBaseline: "middle" }}
      >
        {animatedScore}
      </text>
      <text
        x="50%"
        y="82%"
        fill="var(--text-secondary)"
        fontSize={size * 0.13}
        textAnchor="middle"
      >
        Exposure
      </text>
    </svg>
  );
}

// SVG: Risk trend mini-line-area chart
function TrendLine({ data = [], width = 132, height = 44 }) {
  const max = Math.max(...data, 100), min = Math.min(...data, 0);
  const points = data
    .map(
      (v, i) =>
        `${(i * width) / (data.length - 1)},${height - ((v - min) / (max - min)) * (height - 8) - 2}`
    )
    .join(" ");
  // For area under curve (y=height baseline), close shape
  const areaPoints =
    points +
    ` ${width},${height} 0,${height}`;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Area under */}
      <polyline
        points={areaPoints}
        fill="url(#trend-fill)"
        stroke="none"
        opacity="0.26"
      />
      <defs>
        <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.65" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0.07" />
        </linearGradient>
      </defs>
      {/* Trend line */}
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.9"
        style={{ filter: "drop-shadow(0 0 1.5px var(--primary))" }}
      />
      <circle
        cx={width}
        cy={
          height -
          ((data[data.length - 1] - min) / (max - min)) * (height - 8) -
          2
        }
        r="4.9"
        fill="var(--primary)"
        opacity="0.84"
      />
    </svg>
  );
}

// UI: Visual segmented bars for categories
function CategorySegmentation({ cats }) {
  const total = cats.reduce((sum, c) => sum + c.value, 0);
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {/* Bar Segmentation */}
        <div
          style={{
            height: "23px",
            borderRadius: 15,
            display: "flex",
            overflow: "hidden",
            boxShadow: "0 1.8px 7px 0 #0002"
          }}
        >
          {cats.map((cat, idx) => (
            <div
              key={cat.key}
              style={{
                width: `${(cat.value / total) * 100}%`,
                background: getCssVar(cat.colorVar),
                opacity: 0.92,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: idx === 0 ? "#222" : "var(--text-color)",
                fontWeight: 600,
                fontSize: "0.97rem"
              }}
              title={cat.key}
            />
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
        {cats.map((cat) => (
          <span
            key={cat.key}
            style={{
              background: "rgba(255,255,255, 0.03)",
              border: `1.1px solid ${getCssVar(cat.colorVar)}`,
              color: getCssVar(cat.colorVar),
              borderRadius: 16,
              fontSize: "0.97rem",
              padding: "3.5px 13px",
              fontWeight: "500",
              letterSpacing: "0.01em",
              opacity: 0.8,
              boxShadow: "0 0.5px 2.5px 0 #0002"
            }}
          >
            {cat.key}
            <span
              style={{
                marginLeft: 6,
                fontWeight: 600,
                color: "var(--text-secondary)",
                fontSize: "0.98em"
              }}
            >
              {cat.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// UI: Real-time alerts list/panel (mock/static)
function AlertsPanel({ items }) {
  const getTypeStyle = (type) => {
    switch (type) {
      case "Breach":
        return { color: "#ffb574", icon: "⚠️" };
      case "Tracking":
        return { color: "#0ff", icon: "👁️" };
      case "Leak":
        return { color: "#ff647f", icon: "💧" };
      default:
        return { color: "#eee", icon: "•" };
    }
  };
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          marginBottom: 3,
          fontWeight: 600,
          color: "var(--secondary)",
          fontSize: "1.05rem",
          letterSpacing: ".02em"
        }}
      >
        Real-Time Alerts
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((a, idx) => {
          const t = getTypeStyle(a.type);
          return (
            <div
              key={idx}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderLeft: `3.3px solid ${t.color}`,
                borderRadius: 6,
                margin: "3px 0",
                padding: "8px 11px 8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 11,
                fontSize: "0.97rem",
                boxShadow: idx === 0 ? "0 2px 8px 0 #0002" : "none"
              }}
            >
              <span style={{ fontSize: "1.2em" }}>{t.icon}</span>
              <span style={{ flex: 1 }}>
                <span style={{ color: t.color, fontWeight: 600 }}>
                  {a.type}
                </span>
                &nbsp;&middot;&nbsp;
                <span style={{ color: "var(--text-color)" }}>{a.msg}</span>
              </span>
              <span style={{ fontSize: "0.93em", color: "var(--text-secondary)" }}>
                {a.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ExposureDashboard() {
  // Integration with current widget styling & theme
  const { colors } = useTheme();

  // Responsive layout: grid if horizontal, stack on mobile
  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 224,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        padding: "0",
        background: "rgba(255,255,255,0.035)",
        boxShadow: "0 0 0 0 transparent",
        border: "1.8px solid var(--border-color)"
      }}
      tabIndex={0}
      aria-label="Exposure dashboard widget"
    >
      <div
        style={{
          display: "flex",
          gap: 0,
          alignItems: "stretch",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: "25px 8px 14px 12px"
        }}
      >
        {/* Left: Radial Score */}
        <div
          style={{
            minWidth: 128,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 18
          }}
        >
          <RadialScoreChart score={exposureScore} />
        </div>
        {/* Middle: Trend and Category */}
        <div
          style={{
            flex: "2 1 230px",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "center",
            padding: "0 8px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 8
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.06rem",
                color: "var(--primary)",
                letterSpacing: ".01em",
                textShadow: "0px 2px 8px #0ff2"
              }}
            >
              Risk Trend
            </span>
            <span
              style={{
                fontSize: ".98em",
                color: "var(--text-secondary)",
                fontWeight: 500
              }}
            >
              Past 12h
            </span>
          </div>
          <TrendLine data={trendData} />
          <div style={{ margin: "13px 0 0 0" }}>
            <CategorySegmentation cats={categories} />
          </div>
        </div>
        {/* Right: Alerts */}
        <div
          style={{
            flex: "1 1 185px",
            maxWidth: 220,
            minWidth: 150,
            marginLeft: 15,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            padding: "5px 4px"
          }}
        >
          <AlertsPanel items={alerts} />
        </div>
      </div>
    </div>
  );
}

export default ExposureDashboard;
