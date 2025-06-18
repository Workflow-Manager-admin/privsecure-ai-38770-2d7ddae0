import React, { useState } from "react";
import { useTheme } from "./ThemeContext";

// Mock contact graph data: list of contacts (nodes), and sharing links (edges)
const mockContacts = [
  {
    id: "u1",
    name: "Alex Carter",
    risk: "High",
    info: ["Shares bank details", "Active on social media"],
    privacyTip: "Limit shared sensitive info and review privacy settings.",
  },
  {
    id: "u2",
    name: "Maya Lin",
    risk: "Medium",
    info: ["Syncs contacts", "Cloud photo backup"],
    privacyTip: "Review data sharing with third-party apps.",
  },
  {
    id: "u3",
    name: "Rohit Anand",
    risk: "Low",
    info: ["Encrypted messages", "Minimal social footprint"],
    privacyTip: "Great privacy posture! Remain alert for phishing.",
  },
  {
    id: "u4",
    name: "Ella James",
    risk: "Critical",
    info: ["Frequent quizzes", "Public posts"],
    privacyTip: "Do not post private info and restrict profile visibility.",
  },
  {
    id: "u5",
    name: "Samir Hassan",
    risk: "Moderate",
    info: ["Group admin", "Multiple device links"],
    privacyTip: "Audit linked devices and review app permissions.",
  },
];

// Edges define data-sharing (for mock visually: circular but cross-link some nodes)
const mockEdges = [
  { from: "u1", to: "u2", share: "Bank Info" },
  { from: "u2", to: "u3", share: "Photo, Email" },
  { from: "u2", to: "u4", share: "Social Tag" },
  { from: "u1", to: "u5", share: "Contact Number" },
  { from: "u4", to: "u5", share: "Profile Link" },
  { from: "u5", to: "u3", share: "Messaging" },
];

// Theme-based color for each risk
const riskColors = {
  Critical: "#ff6373", // bright red
  High: "var(--secondary)", // magenta
  Medium: "#ffc65f", // yellow
  Moderate: "#88fbef", // light-teal
  Low: "#0ff", // cyan
};

const riskOrder = ["Critical", "High", "Medium", "Moderate", "Low"];

// Helper: Get risk color from string, falling back to theme accent
function getRiskColor(risk, theme) {
  if (riskColors[risk]) return riskColors[risk];
  return theme?.colors?.accent || "#0ff";
}

// Helper (accessible): Alt text/aria label for risk level
function getRiskLabel(risk) {
  switch (risk) {
    case "Critical":
      return "Critical risk";
    case "High":
      return "High risk";
    case "Medium":
      return "Medium risk";
    case "Moderate":
      return "Moderate risk";
    case "Low":
    default:
      return "Low risk";
  }
}

// Layout: arrange graph nodes in a responsive circle for now (n nodes, angle step etc)
function getNodePoints(n, cx, cy, r) {
  const theta = (2 * Math.PI) / n;
  return Array.from({ length: n }, (_, i) => {
    const angle = i * theta - Math.PI/2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    };
  });
}

// Node shadow/glow for risk/hover
function glow(risk, hovered) {
  if (hovered)
    return `0 0 19px 6px ${riskColors[risk] || "#0ff"}`;
  if (risk === "Critical")
    return "0 0 12px 4px #ff637388";
  if (risk === "High")
    return "0 0 10px 3px var(--secondary)";
  if (risk === "Medium")
    return "0 0 7px 2px #ffc65f77";
  return "0 0 7px 2px #2cf7fb55";
}

// Mini legend component
function RiskLegend({ riskOrder, theme }) {
  return (
    <div style={{
      display: "flex", gap: 11, alignItems: "center", margin: "9px 0 0 0", flexWrap: "wrap",
    }}>
      {riskOrder.map(r => (
        <span key={r} style={{
          display: "flex", alignItems: "center", fontWeight: 600, fontSize: ".97em",
          color: getRiskColor(r, theme), marginRight: 13, marginBottom: 4,
        }}>
          <span style={{
            display: "inline-block", width: 18, height: 18, borderRadius: "50%",
            background: getRiskColor(r, theme), opacity: 0.73, marginRight: 7,
            boxShadow: `0 0 7px 0 ${getRiskColor(r, theme)}99`
          }}/>
          {getRiskLabel(r)}
        </span>
      ))}
    </div>
  );
}

// Small hover card/tooltip
function HoverCard({ node, style }) {
  return (
    <div
      role="tooltip"
      style={{
        minWidth: 220,
        maxWidth: 297,
        background: "rgba(11,24,40,0.98)",
        color: "#fff",
        border: `1.3px solid ${getRiskColor(node.risk)}`,
        borderRadius: 15,
        position: "absolute",
        zIndex: 200,
        left: style.left, top: style.top,
        boxShadow: "0 8px 28px #000a, 0 0 11px #0ff3",
        padding: "17px 16px 15px 16px",
        fontWeight: 500,
        pointerEvents: "none",
        opacity: style.visible ? 1 : 0,
        transition: "opacity 0.13s"
      }}
      aria-label={`Privacy/Risk details for ${node.name}`}
      tabIndex={-1}
    >
      <div style={{ fontWeight: 700, color: getRiskColor(node.risk), fontSize: "1.09em", marginBottom: 3 }}>
        {node.name}
      </div>
      <div style={{ color: "#fffccb", fontWeight: 600, marginBottom: 8, fontSize: ".97em" }}>
        Risk: <span style={{ color: getRiskColor(node.risk) }}>{getRiskLabel(node.risk)}</span>
      </div>
      <ul style={{ color: "#b9ecfa", margin: "0 0 9px 0", paddingLeft: 14, fontWeight: 500, fontSize: ".99em" }}>
        {node.info.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
      <div style={{ color: "#ffbfdf", fontWeight: 600, marginTop: 7, fontSize: ".97em" }}>
        <span style={{ color: "#ffa3d8", fontWeight: 700 }}>Privacy Tip: </span>
        {node.privacyTip}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function SocialGraphRiskMap() {
  // Theme for style
  const theme = useTheme();
  const [hovered, setHovered] = useState(null); // node index for hover
  const [hoverPos, setHoverPos] = useState({ left: 0, top: 0, visible: false });

  // Responsive SVG size (fixed min, max for widget, adjust for mobile width)
  // Widget: viewbox 100% width, lock aspect ratio
  const minH = 330, minW = 370, maxW = 690;
  // We'll use window width to scale
  const [svgDims, setSvgDims] = useState({
    w: Math.max(window.innerWidth * 0.70, minW),
    h: Math.max(minH, Math.min(400, window.innerWidth * 0.36)),
  });

  React.useEffect(() => {
    function handleResize() {
      setSvgDims({
        w: Math.max(window.innerWidth * 0.70, minW),
        h: Math.max(minH, Math.min(430, window.innerWidth * 0.37)),
      });
    }
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const N = mockContacts.length;
  // Center and radius for nodes
  const padding = 56;
  const cx = svgDims.w / 2, cy = svgDims.h / 2;
  const r = Math.min(svgDims.w, svgDims.h) / 2 - padding;
  const nodeR = 34;

  // Place nodes in a circle, store info {x, y, angle}
  const points = getNodePoints(N, cx, cy, r);

  // For hit zones: to show tooltips at pointer location
  function handleNodeHover(idx, evt) {
    const rect = evt.target.getBoundingClientRect();
    const offsetX = rect.right - rect.left;
    setHovered(idx);
    setHoverPos({
      left: evt.clientX + 4,
      top: evt.clientY - 36,
      visible: true,
      offsetX,
    });
  }
  function handleNodeLeave() {
    setHovered(null);
    setHoverPos({ left: 0, top: 0, visible: false });
  }

  // For edges, interpolate between from/to nodes
  function findNodeIdx(id) {
    return mockContacts.findIndex((c) => c.id === id);
  }

  // Animate graph entry: animate node growth
  const [animate, setAnimate] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 110);
    return () => clearTimeout(t);
  }, []);

  // WIDGET LAYOUT
  return (
    <div
      className="widget"
      style={{
        minWidth: 0,
        minHeight: 334,
        width: "100%",
        background: "rgba(255,255,255,0.041)",
        border: "1.8px solid var(--border-color)",
        boxShadow: "0 0 0 0 transparent",
        padding: "0",
        position: "relative",
        overflow: "visible",
        display: "flex",
        flexDirection: "column"
      }}
      aria-label="Social contacts risk map widget"
      tabIndex={0}
    >
      <div
        style={{
          fontWeight: 700,
          fontSize: "1.14rem",
          color: "var(--primary)",
          textShadow: "0 4px 21px #0ff7",
          letterSpacing: ".018em",
          padding: "22px 18px 7px 18px"
        }}
      >
        Social Graph Risk Map
      </div>
      <div
        style={{
          color: "var(--text-secondary)",
          fontSize: "1.015em",
          fontWeight: 500,
          letterSpacing: ".005em",
          marginBottom: 4,
          padding: "0 18px 10px 18px"
        }}
      >
        Visualize how your contacts and their privacy risks are interconnected. Hover any node for privacy tips & details.
      </div>
      {/* The graph: purely SVG-based for this demo */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: minH,
          margin: "0 auto",
          maxWidth: maxW,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <svg
          width={svgDims.w}
          height={svgDims.h}
          viewBox={`0 0 ${svgDims.w} ${svgDims.h}`}
          style={{
            background: "none",
            width: "100%",
            boxSizing: "border-box",
            maxWidth: "100%",
            margin: "0 auto",
            borderRadius: 18,
            border: "none",
            position: "relative"
          }}
          tabIndex={-1}
          aria-label="Social graph visualization"
        >
          <defs>
            <linearGradient id="criticalLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6373" />
              <stop offset="100%" stopColor="#ff9edb" />
            </linearGradient>
            <linearGradient id="medLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffc65f" />
              <stop offset="100%" stopColor="#0ff" />
            </linearGradient>
            <linearGradient id="safeLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ff" />
              <stop offset="100%" stopColor="#88fbef" />
            </linearGradient>
          </defs>
          {/* Draw edges (under nodes), highlight on hover */}
          {mockEdges.map(({ from, to, share }, i) => {
            const f = findNodeIdx(from), t = findNodeIdx(to);
            if (f === -1 || t === -1) return null;
            // Edge color: link from higher of the two risks
            const rf = mockContacts[f].risk, rt = mockContacts[t].risk;
            let edgeColor = "url(#safeLine)";
            if ([rf, rt].includes("Critical")) edgeColor = "url(#criticalLine)";
            else if ([rf, rt].includes("High")) edgeColor = "url(#criticalLine)";
            else if ([rf, rt].includes("Medium")) edgeColor = "url(#medLine)";
            // hover highlight if hovered node is endpoint
            const highlight = hovered === f || hovered === t;
            const lw = highlight ? 4.5 : 2.6;
            return (
              <g key={`edge-${from}-${to}`}>
                <line
                  x1={points[f].x}
                  y1={points[f].y}
                  x2={points[t].x}
                  y2={points[t].y}
                  stroke={edgeColor}
                  strokeWidth={lw}
                  opacity={highlight ? 0.95 : 0.55}
                  style={{
                    filter: highlight
                      ? `drop-shadow(0 0 6px #fff8) drop-shadow(0 0 17px #0ff6)`
                      : "none",
                    transition: "stroke-width .16s, opacity .11s"
                  }}
                  markerEnd="url(#arrowHead)"
                />
                {/* Place sharing type text at midpoint */}
                <text
                  x={(points[f].x + points[t].x) / 2}
                  y={(points[f].y + points[t].y) / 2 - 13}
                  fill="#ffc65f"
                  fontSize="1em"
                  opacity={0.74}
                  fontWeight={600}
                  textAnchor="middle"
                  pointerEvents="none"
                  style={{
                    textShadow: "0 0 6px #012, 0 2px 12px #fff7",
                    letterSpacing: ".03em",
                  }}
                >
                  {share}
                </text>
              </g>
            );
          })}
          {/* Draw nodes */}
          {mockContacts.map((node, i) => {
            const isHovered = hovered === i;
            // Animate nodes: grow in
            const scale = animate ? 1 : 0.12;
            return (
              <g key={node.id}>
                <circle
                  cx={points[i].x}
                  cy={points[i].y}
                  r={nodeR * (isHovered ? 1.27 : scale)}
                  fill={getRiskColor(node.risk, theme)}
                  opacity={isHovered ? 1 : 0.87}
                  style={{
                    filter: glow(node.risk, isHovered),
                    cursor: "pointer",
                    transition:
                      "r 0.23s cubic-bezier(.43,1.51,.72,.64), filter 0.2s, opacity 0.17s",
                    stroke: isHovered ? "#fff9d9" : "#fff1",
                    strokeWidth: isHovered ? 3.5 : 2.7,
                  }}
                  tabIndex={0}
                  aria-label={`${node.name}, ${getRiskLabel(node.risk)}`}
                  onMouseEnter={e => handleNodeHover(i, e)}
                  onMouseMove={e => hovered === i && handleNodeHover(i, e)}
                  onMouseLeave={handleNodeLeave}
                  onFocus={e => handleNodeHover(i, e)}
                  onBlur={handleNodeLeave}
                />
                {/* Node text (initials or first name part) */}
                <text
                  x={points[i].x}
                  y={points[i].y + 5}
                  textAnchor="middle"
                  fontWeight={700}
                  fontSize="1.07em"
                  fill="#1a1a2e"
                  opacity={isHovered ? 1 : 0.81}
                  style={{
                    pointerEvents: "none",
                    fontFamily: "'Inter', Arial, sans-serif",
                    letterSpacing: ".01em",
                    filter: isHovered
                      ? "drop-shadow(0 0 4px #fff7)"
                      : "drop-shadow(0 0 1.3px #fff8)",
                  }}
                >
                  {node.name.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>
        {/* Render hover card (absolute over SVG) */}
        {hovered !== null && hovered < mockContacts.length && (
          <HoverCard
            node={mockContacts[hovered]}
            style={hoverPos}
          />
        )}
      </div>
      {/* Risk legend row */}
      <div style={{
        margin: "7px 14px 2px 14px"
      }}>
        <RiskLegend riskOrder={riskOrder} theme={theme} />
      </div>
    </div>
  );
}

export default SocialGraphRiskMap;
