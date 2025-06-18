import React, { useEffect } from 'react';
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

// PUBLIC_INTERFACE
function App() {
  // Smooth scrolling for sidebar links, highlight active
  useEffect(() => {
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = [
      'dashboard',
      'privacy-plan',
      'digital-twin',
      'app-risk',
      'dark-web',
      'graph-map',
      'scheduler',
      'badges',
      'manifesto',
      'settings'
    ].map(id => document.getElementById(id));

    const handleClick = (e) => {
      // Only smooth scroll for in-page hashes
      if (e.target.hash && e.target.hash.startsWith('#')) {
        const el = document.getElementById(e.target.hash.slice(1));
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Optional: set hash in URL without jumping
          window.history.replaceState(null, '', e.target.hash);
        }
      }
    };

    sidebarLinks.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    const handleScroll = () => {
      let current = sections[0]?.id;
      const scrollPos = window.scrollY + 100;
      for (const section of sections) {
        if (section && section.offsetTop <= scrollPos) {
          current = section.id;
        }
      }
      sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      sidebarLinks.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-symbol">*</span>
          <span className="sidebar-title">PrivSecure AI</span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li><a href="#dashboard" className="active">Dashboard</a></li>
            <li><a href="#privacy-plan">Privacy Plan</a></li>
            <li><a href="#digital-twin">Digital Twin</a></li>
            <li><a href="#app-risk">App Risks</a></li>
            <li><a href="#dark-web">Dark Web</a></li>
            <li><a href="#graph-map">Social Graph</a></li>
            <li><a href="#scheduler">Scheduler</a></li>
            <li><a href="#badges">Badges</a></li>
            <li><a href="#manifesto">Manifesto</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
      </aside>
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
  );
}

export default App;