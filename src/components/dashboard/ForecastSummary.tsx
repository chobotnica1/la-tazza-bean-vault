import { useMemo } from 'react';
import {
  getAllGreenBatches,
  getAllRoastedBatches,
  getAllSalesEntries,
  getSafetySettings,
  getThreshold,
} from '../../repositories/localStore';
import { estimateUsageRate, estimateDepletionDate } from '../../utils/usageEstimator';
import './ForecastSummary.css';

interface VarietyForecast {
  variety: string;
  currentBags: number;
  usageRatePerWeek: number;
  depletionDate: Date | null;
  threshold?: number;
  daysUntilDepletion: number;
}

export default function ForecastSummary() {
  const greenBatches = getAllGreenBatches();
  const roastedBatches = getAllRoastedBatches();
  const salesEntries = getAllSalesEntries();
  const safetySettings = getSafetySettings();

  const forecasts = useMemo(() => {
    const varietyStockMap = new Map<string, number>();
    const varietyWarehouses = new Map<string, Set<string>>();

    greenBatches.forEach((batch) => {
      const current = varietyStockMap.get(batch.variety) || 0;
      varietyStockMap.set(batch.variety, current + batch.quantityBags);

      if (!varietyWarehouses.has(batch.variety)) {
        varietyWarehouses.set(batch.variety, new Set());
      }
      varietyWarehouses.get(batch.variety)!.add(batch.warehouse);
    });

    const forecasts: VarietyForecast[] = [];

    varietyStockMap.forEach((currentBags, variety) => {
      const usageRatePerWeek = estimateUsageRate(variety, roastedBatches, salesEntries);
      const depletionDate = estimateDepletionDate(currentBags, usageRatePerWeek);

      const warehouses = Array.from(varietyWarehouses.get(variety) || []);
      const threshold =
        warehouses.length > 0
          ? getThreshold(variety, warehouses[0]) ??
            safetySettings.defaultThresholdPerVariety
          : safetySettings.defaultThresholdPerVariety;

      let daysUntilDepletion = Infinity;
      if (depletionDate) {
        daysUntilDepletion = Math.floor(
          (depletionDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)
        );
      }

      forecasts.push({
        variety,
        currentBags,
        usageRatePerWeek,
        depletionDate,
        threshold,
        daysUntilDepletion,
      });
    });

    const depletingSoon = forecasts
      .filter((f) => f.depletionDate !== null)
      .sort((a, b) => a.daysUntilDepletion - b.daysUntilDepletion)
      .slice(0, 5);

    return depletingSoon;
  }, [greenBatches, roastedBatches, salesEntries, safetySettings]);

  const formatDepletionDate = (date: Date | null): string => {
    if (!date) return 'Stable';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimeUntil = (days: number): string => {
    if (days === Infinity) return 'Stable';
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days <= 7) return `${days} day${days !== 1 ? 's' : ''}`;
    if (days <= 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    }
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  };

  const getUrgencyClass = (days: number): string => {
    if (days < 0) return 'urgency-critical';
    if (days <= 14) return 'urgency-critical';
    if (days <= 30) return 'urgency-warning';
    return 'urgency-normal';
  };

  return (
    <div className="forecast-summary-widget">
      <div className="widget-header">
        <h3>📊 Depletion Forecast</h3>
        {forecasts.length > 0 && (
          <span className="forecast-count">Top {forecasts.length}</span>
        )}
      </div>

      {forecasts.length === 0 ? (
        <div className="no-forecasts">
          <span className="info-icon">ℹ️</span>
          <p>No active depletion forecasts.</p>
          <small>Varieties with usage data will appear here.</small>
        </div>
      ) : (
        <div className="forecasts-list">
          {forecasts.map((forecast, idx) => (
            <div key={forecast.variety} className="forecast-item">
              <div className="forecast-rank">{idx + 1}</div>
              <div className="forecast-main">
                <div className="forecast-header">
                  <span className="forecast-variety">{forecast.variety}</span>
                  <span className={`time-until ${getUrgencyClass(forecast.daysUntilDepletion)}`}>
                    {formatTimeUntil(forecast.daysUntilDepletion)}
                  </span>
                </div>
                <div className="forecast-details">
                  <div className="detail-row">
                    <span className="detail-label">Est. depletion:</span>
                    <span className="detail-value">
                      {formatDepletionDate(forecast.depletionDate)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Current stock:</span>
                    <span className="detail-value">{forecast.currentBags} bags</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Weekly usage:</span>
                    <span className="detail-value">
                      {forecast.usageRatePerWeek.toFixed(1)} bags/week
                    </span>
                  </div>
                  {forecast.threshold !== undefined && (
                    <div className="detail-row">
                      <span className="detail-label">Threshold:</span>
                      <span className="detail-value">{forecast.threshold} bags</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {forecasts.length > 0 && (
        <div className="widget-footer">
          <a href="#" onClick={(e) => { e.preventDefault(); }}>
            View full reorder recommendations →
          </a>
        </div>
      )}
    </div>
  );
}