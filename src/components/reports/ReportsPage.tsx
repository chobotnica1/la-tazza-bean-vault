import { useState } from 'react';
import ReorderRecommendations from './ReorderRecommendations';
import './ReportsPage.css';

type ReportTab = 'reorder' | 'inventory' | 'sales';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('reorder');

  return (
    <div className="reports-page">
      <h2>Reports & Analytics</h2>

      <div className="reports-tabs">
        <button
          className={activeTab === 'reorder' ? 'active' : ''}
          onClick={() => setActiveTab('reorder')}
        >
          Reorder Recommendations
        </button>
        <button
          className={activeTab === 'inventory' ? 'active' : ''}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory Report
        </button>
        <button
          className={activeTab === 'sales' ? 'active' : ''}
          onClick={() => setActiveTab('sales')}
        >
          Sales Report
        </button>
      </div>

      <div className="reports-content">
        {activeTab === 'reorder' && <ReorderRecommendations />}
        {activeTab === 'inventory' && (
          <div className="coming-soon">
            <h3>Inventory Report</h3>
            <p>Detailed inventory analytics coming soon...</p>
          </div>
        )}
        {activeTab === 'sales' && (
          <div className="coming-soon">
            <h3>Sales Report</h3>
            <p>Sales analytics and trends coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}