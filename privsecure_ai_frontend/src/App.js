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
  // The Sidebar component now handles its own navigation/scroll logic.
  return (
    <ThemeProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="main-layout">
          <header className="header">
            <div className="header-title">Welcome to PrivSecure AI</div>
          </header>
          <main className="main-content">
            <div className="widgets-grid">
              <section id="dashboard" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <ExposureDashboard />
              </section>
              <section id="privacy-plan" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <PrivacyActionPlan />
              </section>
              <section id="digital-twin" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <DigitalTwinScanner />
              </section>
              <section id="app-risk" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <AppRiskScanner />
              </section>
              <section id="dark-web" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <DarkWebLeakMonitor />
              </section>
              <section id="graph-map" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <SocialGraphRiskMap />
              </section>
              <section id="scheduler" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <DataDisintegrationScheduler />
              </section>
              <section id="badges" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <PrivacyBadgeSystem />
              </section>
              <section id="manifesto" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <PrivacyManifestoGenerator />
              </section>
              <section id="settings" tabIndex={-1} style={{ scrollMarginTop: 72 }}>
                <SettingsReportsSection />
              </section>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;