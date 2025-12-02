import { useState, useEffect } from 'react';
import type { GreenCoffeeBatch, InventorySafetyThreshold } from '../../entities';
import { getAllGreenBatches, getAllThresholds } from '../../repositories/localStore';
import './NeedsAttention.css';

interface AlertItem {
  variety: string;
  warehouse: string;
  current: number;
  threshold: number;
  severity: 'critical' | 'low';
}

interface NeedsAttentionProps {
  onNavigate?: (section: 'settings') => void;
}

export default function NeedsAttention({ onNavigate }: NeedsAttentionProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    const [batches, thresholds] = await Promise.all([
      getAllGreenBatches(),
      getAllThresholds(),
    ]);

    const defaultThreshold = thresholds.find(t => t.variety === '*' && t.warehouse === '*') || {
      criticalThreshold: 3,
      lowThreshold: 5,
    };

    const alertList: AlertItem[] = [];

    const grouped = batches.reduce((acc, batch) => {
      const key = `${batch.variety}|${batch.warehouse}`;
      if (!acc[key]) {
        acc[key] = { variety: batch.variety, warehouse: batch.warehouse, total: 0 };
      }
      acc[key].total += batch.quantityBags;
      return acc;
    }, {} as Record<string, { variety: string; warehouse: string; total: number }>);

    Object.values(grouped).forEach(({ variety, warehouse, total }) => {
      const specificThreshold = thresholds.find(
        t => t.variety === variety && t.warehouse === warehouse
      );

      const threshold = specificThreshold || defaultThreshold;

      if (total <= threshold.criticalThreshold) {
        alertList.push({
          variety,
          warehouse,
          current: total,
          threshold: threshold.criticalThreshold,
          severity: 'critical',
        });
      } else if (total <= threshold.lowThreshold) {
        alertList.push({
          variety,
          warehouse,
          current: total,
          threshold: threshold.lowThreshold,
          severity: 'low',
        });
      }
    });

    alertList.sort((a, b) => {
      if (a.severity !== b.severity) {
        return a.severity === 'critical' ? -1 : 1;
      }
      return a.current - b.current;
    });

    setAlerts(alertList);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="needs-attention">
        <h3>⚠️ Needs Attention</h3>
        <div style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
          Loading alerts...
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="needs-attention">
        <h3>✅ All Good!</h3>
        <p className="no-alerts">No inventory alerts at this time.</p>
      </div>
    );
  }

  return (
    <div className="needs-attention">
      <h3>⚠️ Needs Attention</h3>
      <p className="alert-description">
        The following items are running low and need to be reordered soon.
      </p>

      <div className="alerts-list">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`alert-item ${alert.severity}`}>
            <div className="alert-header">
              <span className="alert-variety">{alert.variety}</span>
              <span className={`alert-badge ${alert.severity}`}>
                {alert.severity === 'critical' ? 'CRITICAL' : 'LOW'}
              </span>
            </div>
            <div className="alert-details">
              <span className="alert-warehouse">{alert.warehouse}</span>
              <span className="alert-quantity">
                {alert.current} / {alert.threshold} bags
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="alert-footer">
        <button
          onClick={() => {
  // Directly click the Settings button in the nav
  const settingsButton = Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent?.trim() === 'Settings');
  if (settingsButton) {
    (settingsButton as HTMLButtonElement).click();
  }
}}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#3b82f6', 
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
            font: 'inherit'
          }}
        >
          Configure thresholds in Settings →
        </button>
      </div>
    </div>
  );
}