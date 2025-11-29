import { useState, useEffect } from 'react';
import { getAllGreenBatches } from '../../repositories/localStore';
import { estimateUsageRate } from '../../utils/usageEstimator';
import './ForecastSummary.css';

interface ForecastItem {
  variety: string;
  currentBags: number;
  usageRate: number;
  daysRemaining: number;
}

export default function ForecastSummary() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForecasts();
  }, []);

  const loadForecasts = async () => {
    setLoading(true);
    const batches = await getAllGreenBatches();

    const grouped = batches.reduce((acc, batch) => {
      if (!acc[batch.variety]) {
        acc[batch.variety] = 0;
      }
      acc[batch.variety] += batch.quantityBags;
      return acc;
    }, {} as Record<string, number>);

    const forecastList: ForecastItem[] = Object.entries(grouped).map(([variety, bags]) => {
      const usageRate = estimateUsageRate(variety);
      const daysRemaining = usageRate > 0 ? Math.floor(bags / usageRate) : 999;

      return {
        variety,
        currentBags: bags,
        usageRate,
        daysRemaining,
      };
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
              <div className="forecast-variety">{forecast.variety}</div>
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