import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ErrorBoundary from './ErrorBoundary';
import Login from './components/auth/Login';
import HomePage from './components/dashboard/HomePage';
import GreenInventoryPage from './components/green/GreenInventoryPage';
import RoastedInventoryPage from './components/roasted/RoastedInventoryPage';
import ImportReportsPage from './components/imports/ImportReportsPage';
import NeedsAttention from './components/dashboard/NeedsAttention';
import SettingsPage from './components/settings/SettingsPage';
import CustomersPage from './components/customers/CustomersPage';
import ReportsPage from './components/reports/ReportsPage';
import QualityPage from './components/quality/QualityPage';
import './App.css';

type MainSection = 'home' | 'inventory' | 'import-reports' | 'customers' | 'reports' | 'quality' | 'settings';
type InventoryTab = 'green' | 'roasted';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<MainSection>('home');
  const [inventoryTab, setInventoryTab] = useState<InventoryTab>('green');

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#999'
      }}>
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>La Tazza Bean Vault</h1>
        <nav className="main-nav">
          <button
            className={activeSection === 'home' ? 'active' : ''}
            onClick={() => setActiveSection('home')}
          >
            Home
          </button>
          <button
            className={activeSection === 'inventory' ? 'active' : ''}
            onClick={() => setActiveSection('inventory')}
          >
            Inventory
          </button>
          <button
            className={activeSection === 'import-reports' ? 'active' : ''}
            onClick={() => setActiveSection('import-reports')}
          >
            Import Reports
          </button>
          <button
            className={activeSection === 'customers' ? 'active' : ''}
            onClick={() => setActiveSection('customers')}
          >
            Customers
          </button>
          <button
            className={activeSection === 'quality' ? 'active' : ''}
            onClick={() => setActiveSection('quality')}
          >
            Quality
          </button>
          <button
            className={activeSection === 'reports' ? 'active' : ''}
            onClick={() => setActiveSection('reports')}
          >
            Reports
          </button>
          <button
            className={activeSection === 'settings' ? 'active' : ''}
            onClick={() => setActiveSection('settings')}
          >
            Settings
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </nav>
      </header>

      <main className="app-main">
        <ErrorBoundary>
          {activeSection === 'home' && <HomePage />}

          {activeSection === 'inventory' && (
            <div className="inventory-section">
              <NeedsAttention />

              <div className="inventory-tabs">
                <button
                  className={inventoryTab === 'green' ? 'active' : ''}
                  onClick={() => setInventoryTab('green')}
                >
                  Green Coffee
                </button>
                <button
                  className={inventoryTab === 'roasted' ? 'active' : ''}
                  onClick={() => setInventoryTab('roasted')}
                >
                  Roasted Coffee
                </button>
              </div>

              <div className="inventory-content">
                {inventoryTab === 'green' && <GreenInventoryPage />}
                {inventoryTab === 'roasted' && <RoastedInventoryPage />}
              </div>
            </div>
          )}

          {activeSection === 'import-reports' && <ImportReportsPage />}

          {activeSection === 'customers' && <CustomersPage />}

          {activeSection === 'quality' && <QualityPage />}

          {activeSection === 'reports' && <ReportsPage />}

          {activeSection === 'settings' && <SettingsPage />}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;