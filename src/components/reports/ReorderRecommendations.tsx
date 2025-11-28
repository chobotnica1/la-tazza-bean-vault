import { useState, useMemo } from 'react';
import {
  getAllGreenBatches,
  getAllRoastedBatches,
  getAllSalesEntries,
  getAllCuppingRecords,
} from '../../repositories/localStore';
import { estimateUsageRate, estimateDepletionDate } from '../../utils/usageEstimator';
import './ReorderRecommendations.css';

interface ReorderRecommendation {
  variety: string;
  currentBags: number;
  weeklyUsage: number;
  depletionDate: Date | null;
  recommendedReorder: number;
  topCuppingScore?: number;
  avgCostPerPound?: number;
}

function convertToPounds(value: number, unit: string): number {
  switch (unit) {
    case 'lb':
      return value;
    case 'kg':
      return value * 2.20462;
    case 'oz':
      return value / 16;
    case 'g':
      return value / 453.592;
    default:
      return value;
  }
}

export default function ReorderRecommendations() {
  const [targetWeeksOfCover, setTargetWeeksOfCover] = useState(6);

  const greenBatches = getAllGreenBatches();
  const roastedBatches = getAllRoastedBatches();
  const salesEntries = getAllSalesEntries();
  const cuppingRecords = getAllCuppingRecords();

  const recommendations = useMemo(() => {
    const varietyStockMap = new Map<string, number>();
    greenBatches.forEach((batch) => {
      const current = varietyStockMap.get(batch.variety) || 0;
      varietyStockMap.set(batch.variety, current + batch.quantityBags);
    });

    const allVarieties = new Set<string>();
    greenBatches.forEach((b) => allVarieties.add(b.variety));
    roastedBatches.forEach((b) => allVarieties.add(b.variety));
    salesEntries.forEach((e) => {
      if (e.mappedVariety) allVarieties.add(e.mappedVariety);
    });

    const recs: ReorderRecommendation[] = [];

    allVarieties.forEach((variety) => {
      const currentBags = varietyStockMap.get(variety) || 0;
      const weeklyUsage = estimateUsageRate(variety, roastedBatches, salesEntries);
      const depletionDate = estimateDepletionDate(currentBags, weeklyUsage);

      let recommendedReorder = 0;
      if (weeklyUsage > 0) {
        const targetStock = weeklyUsage * targetWeeksOfCover;
        recommendedReorder = Math.max(0, Math.ceil(targetStock - currentBags));
      }

      const varietyCuppings = cuppingRecords.filter((r) => r.variety === variety);
      const topCuppingScore =
        varietyCuppings.length > 0
          ? Math.max(...varietyCuppings.map((r) => r.score))
          : undefined;

      const varietyBatches = greenBatches.filter((b) => b.variety === variety);
      let avgCostPerPound: number | undefined;
      if (varietyBatches.length > 0) {
        const totalCost = varietyBatches.reduce((sum, b) => {
          const pricePerPound = convertToPounds(b.pricePerUnit, b.priceUnit);
          return sum + pricePerPound;
        }, 0);
        avgCostPerPound = totalCost / varietyBatches.length;
      }

      recs.push({
        variety,
        currentBags,
        weeklyUsage,
        depletionDate,
        recommendedReorder,
        topCuppingScore,
        avgCostPerPound,
      });
    });

    recs.sort((a, b) => {
      if (!a.depletionDate && !b.depletionDate) {
        return b.recommendedReorder - a.recommendedReorder;
      }
      if (!a.depletionDate) return 1;
      if (!b.depletionDate) return -1;
      return a.depletionDate.getTime() - b.depletionDate.getTime();
    });

    return recs;
  }, [greenBatches, roastedBatches, salesEntries, cuppingRecords, targetWeeksOfCover]);

  const formatDepletionDate = (date: Date | null): string => {
    if (!date) return '–';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleExportCSV = () => {
    if (recommendations.length === 0) {
      alert('No recommendations to export');
      return;
    }

    const headers = [
      'Variety',
      'Current Bags',
      'Weekly Usage',
      'Est. Depletion Date',
      'Recommended Reorder Qty',
      'Top Cupping Score',
      'Avg Cost Per Pound',
    ];

    const rows = recommendations.map((rec) => [
      rec.variety,
      rec.currentBags,
      rec.weeklyUsage.toFixed(2),
      formatDepletionDate(rec.depletionDate),
      rec.recommendedReorder,
      rec.topCuppingScore?.toFixed(1) || 'N/A',
      rec.avgCostPerPound ? `$${rec.avgCostPerPound.toFixed(2)}` : 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reorder-recommendations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reorder-recommendations">
      <div className="section-header">
        <div>
          <h3>Reorder Recommendations</h3>
          <p className="section-description">
            Intelligent recommendations based on usage patterns and target stock levels
          </p>
        </div>
        <button onClick={handleExportCSV} className="btn-export">
          Export CSV
        </button>
      </div>

      <div className="settings-panel">
        <div className="setting-item">
          <label>Target Weeks of Cover:</label>
          <input
            type="number"
            min="1"
            max="52"
            value={targetWeeksOfCover}
            onChange={(e) => setTargetWeeksOfCover(parseInt(e.target.value) || 6)}
          />
          <small>How many weeks of inventory you want to maintain</small>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="empty-state">
          <p>No variety data available yet.</p>
          <small>Add green coffee batches and sales data to see recommendations.</small>
        </div>
      ) : (
        <div className="recommendations-table-container">
          <table className="recommendations-table">
            <thead>
              <tr>
                <th>Variety</th>
                <th>Current Stock</th>
                <th>Weekly Usage</th>
                <th>Est. Depletion</th>
                <th>Recommended Reorder</th>
                <th>Top Quality</th>
                <th>Avg Cost</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec) => {
                const daysUntil = rec.depletionDate
                  ? Math.floor(
                      (rec.depletionDate.getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)
                    )
                  : null;
                const isUrgent = daysUntil !== null && daysUntil <= 30;

                return (
                  <tr key={rec.variety} className={isUrgent ? 'urgent-row' : ''}>
                    <td className="variety-cell">{rec.variety}</td>
                    <td>{rec.currentBags} bags</td>
                    <td>{rec.weeklyUsage.toFixed(1)} bags/week</td>
                    <td>
                      {rec.depletionDate ? (
                        <div className="depletion-cell">
                          <span>{formatDepletionDate(rec.depletionDate)}</span>
                          {daysUntil !== null && daysUntil <= 30 && (
                            <span className="days-warning">({daysUntil} days)</span>
                          )}
                        </div>
                      ) : (
                        <span className="no-data">No usage data</span>
                      )}
                    </td>
                    <td>
                      {rec.recommendedReorder > 0 ? (
                        <span className="reorder-qty">{rec.recommendedReorder} bags</span>
                      ) : (
                        <span className="no-reorder">–</span>
                      )}
                    </td>
                    <td>
                      {rec.topCuppingScore ? (
                        <span className="quality-score">{rec.topCuppingScore.toFixed(1)}</span>
                      ) : (
                        <span className="no-data">–</span>
                      )}
                    </td>
                    <td>
                      {rec.avgCostPerPound ? (
                        <span>${rec.avgCostPerPound.toFixed(2)}/lb</span>
                      ) : (
                        <span className="no-data">–</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}