import { useState } from 'react';
import InventorySafetyPage from './InventorySafetyPage';
import './SettingsPage.css';

type SettingsTab = 'inventory-safety';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('inventory-safety');

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <div className="settings-tabs">
        <button
          className={activeTab === 'inventory-safety' ? 'active' : ''}
          onClick={() => setActiveTab('inventory-safety')}
        >
          Inventory Safety
        </button>
        {/* Additional tabs can be added here in the future */}
      </div>

      <div className="settings-content">
        {activeTab === 'inventory-safety' && <InventorySafetyPage />}
      </div>
    </div>
  );
}