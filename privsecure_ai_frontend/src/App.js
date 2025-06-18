import React from 'react';
import './App.css';

import ExposureDashboard from './ExposureDashboard';
import PrivacyActionPlan from './PrivacyActionPlan';
import DigitalTwinScanner from './DigitalTwinScanner';
import AppRiskScanner from './AppRiskScanner';
import DarkWebLeakMonitor from './DarkWebLeakMonitor';
import SocialGraphRiskMap from './SocialGraphRiskMap';
import DataDisintegrationScheduler from './DataDisintegrationScheduler';
import PrivacyBadgeSystem from './PrivacyBadgeSystem';
import PrivacyManifestoGenerator from './PrivacyManifestoGenerator';
import SettingsReportsSection from './SettingsReportsSection';
import Sidebar from './Sidebar';
import { ThemeProvider } from './ThemeContext';

// PUBLIC_INTERFACE
function App() {
  // This state determines which module/page is shown in the main area.
  const [activePage, setActivePage] = React.useState('dashboard');

  // Map page IDs to their feature components.
  const pageComponents = {
    dashboard: <ExposureDashboard />,
    "privacy-plan": <PrivacyActionPlan />,
    "digital-twin": <DigitalTwinScanner />,
    "app-risk": <AppRiskScanner />,
    "dark-web": <DarkWebLeakMonitor />,
    "graph-map": <SocialGraphRiskMap />,
    scheduler: <DataDisintegrationScheduler />,
    badges: <PrivacyBadgeSystem />,
    manifesto: <PrivacyManifestoGenerator />,
    settings: <SettingsReportsSection />
  };

  // Handler for sidebar navigation.
  const handleNavigate = (page) => {
    setActivePage(page);
  };

  return (
    <ThemeProvider>
      <div className="app-shell">
        <Sidebar onNavigate={handleNavigate} activePage={activePage} />
        <div className="main-layout">
          <header className="header">
            <div className="header-title">Welcome to PrivSecure AI</div>
          </header>
          <main className="main-content">
            <div className="widgets-grid">
              {pageComponents[activePage] ? (
                <section
                  id={activePage}
                  tabIndex={-1}
                  style={{ scrollMarginTop: 72, width: "100%" }}
                >
                  {pageComponents[activePage]}
                </section>
              ) : (
                <section>
                  <div className="widget widget-placeholder">Feature not found.</div>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;