import { useState, useEffect } from 'react';
import { getAllGreenBatches, getAllRoastedBatches } from '../../repositories/localStore';
import { estimateUsageRate } from '../../utils/usageEstimator';
import './ForecastSummary.css';

interface ForecastItem {
  variety: string;
  currentBags: number;
  usageRate: number;
  daysRemaining: number;
  type: 'green' | 'roasted';
}

export default function ForecastSummary() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecasts();
  }, []);

  const loadForecasts = async () => {
    setLoading(true);
    const [greenBatches, roastedBatches] = await Promise.all([
      getAllGreenBatches(),
      getAllRoastedBatches(),
    ]);

    // Group green coffee
    const greenGrouped = greenBatches.reduce((acc, batch) => {
      if (!acc[batch.variety]) {
        acc[batch.variety] = 0;
      }
      acc[batch.variety] += batch.quantityBags;
      return acc;
    }, {} as Record<string, number>);

    // Group roasted coffee
    const roastedGrouped = roastedBatches.reduce((acc, batch) => {
      if (!acc[batch.variety]) {
        acc[batch.variety] = 0;
      }
      acc[batch.variety] += batch.quantityBags;
      return acc;
    }, {} as Record<string, number>);

    const forecastList: ForecastItem[] = [];

    // Add green coffee forecasts
    Object.entries(greenGrouped).forEach(([variety, bags]) => {
      const usageRate = estimateUsageRate(variety, 'green');
      const daysRemaining = usageRate > 0 ? Math.floor(bags / usageRate) : 999;

      forecastList.push({
        variety,
        currentBags: bags,
        usageRate,
        daysRemaining,
        type: 'green',
      });
    });

    // Add roasted coffee forecasts
    Object.entries(roastedGrouped).forEach(([variety, bags]) => {
      const usageRate = estimateUsageRate(variety, 'roasted');
      const daysRemaining = usageRate > 0 ? Math.floor(bags / usageRate) : 999;

      forecastList.push({
        variety,
        currentBags: bags,
        usageRate,
        daysRemaining,
        type: 'roasted',
      });
    });

    forecastList.sort((a, b) => a.daysRemaining - b.daysRemaining);

    setForecasts(forecastList.slice(0, 5));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="forecast-summary">
        <h3>📊 Depletion Forecast</h3>
        <div style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
          Loading forecasts...
        </div>
      </div>
    );
  }

  if (forecasts.length === 0) {
    return (
      <div className="forecast-summary">
        <h3>📊 Depletion Forecast</h3>
        <p className="no-data">No inventory data available for forecasting.</p>
      </div>
    );
  }

  return (
    <div className="forecast-summary">
      <h3>📊 Depletion Forecast</h3>
      <p className="forecast-description">
        Top 5 fastest-depleting varieties based on estimated usage rates
      </p>

      <div className="forecast-list">
        {forecasts.map((forecast, idx) => (
          <div key={idx} className="forecast-item">
            <div className="forecast-rank">{idx + 1}</div>
            <div className="forecast-details">
              <div className="forecast-variety">
                {forecast.variety}
                <span style={{ 
                  marginLeft: '8px', 
                  fontSize: '0.75rem', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  background: forecast.type === 'green' ? '#10b981' : '#f59e0b',
                  color: 'white'
                }}>
                  {forecast.type === 'green' ? 'Green' : 'Roasted'}
                </span>
              </div>
              <div className="forecast-stats">
                <span className="stat">
                  {forecast.currentBags} bags • {forecast.usageRate.toFixed(1)} bags/day
                </span>
                <span className={`days-remaining ${getDaysColor(forecast.daysRemaining)}`}>
                  {forecast.daysRemaining} days remaining
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getDaysColor(days: number): string {
  if (days <= 30) return 'critical';
  if (days <= 60) return 'warning';
  return 'good';
}