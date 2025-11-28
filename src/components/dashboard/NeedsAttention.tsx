import { useMemo } from 'react';
import { getAllGreenBatches, getSafetySettings } from '../../repositories/localStore';
import { getLowStockAlerts, getAlertUrgency } from '../../utils/alertEngine';
import './NeedsAttention.css';

export default function NeedsAttention() {
  const greenBatches = getAllGreenBatches();
  const safetySettings = getSafetySettings();

  const alerts = useMemo(() => {
    return getLowStockAlerts(greenBatches, safetySettings);
  }, [greenBatches, safetySettings]);

  return (
    <div className="needs-attention-widget">
      <div className="widget-header">
        <h3>⚠️ Low Stock Alerts</h3>
        {alerts.length > 0 && (
          <span className="alert-count">{alerts.length} item{alerts.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="no-alerts">
          <span className="check-icon">✓</span>
          <p>All inventory is above threshold.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, idx) => {
            const urgency = getAlertUrgency(alert);
            return (
              <div key={idx} className={`alert-item alert-${urgency}`}>
                <div className="alert-main">
                  <div className="alert-details">
                    <span className="alert-variety">{alert.variety}</span>
                    <span className="alert-separator">—</span>
                    <span className="alert-warehouse">{alert.warehouse}</span>
                  </div>
                  <div className="alert-stock">
                    <span className="current-bags">{alert.currentBags}</span>
                    <span className="stock-separator">/</span>
                    <span className="threshold-bags">{alert.threshold}</span>
                    <span className="bags-label">bags</span>
                  </div>
                </div>
                <div className="alert-indicator">
                  {urgency === 'critical' ? (
                    <span className="urgency-badge critical">Critical</span>
                  ) : (
                    <span className="urgency-badge warning">Low</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="widget-footer">
          <a href="#" onClick={(e) => { e.preventDefault(); }}>
            Configure thresholds in Settings →
          </a>
        </div>
      )}
    </div>
  );
}