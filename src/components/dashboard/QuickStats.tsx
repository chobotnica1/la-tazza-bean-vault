import type { GreenCoffeeBatch, RoastedCoffeeBatch } from '../../entities';
import './QuickStats.css';

interface QuickStatsProps {
  greenBatches: GreenCoffeeBatch[];
  roastedBatches: RoastedCoffeeBatch[];
}

export default function QuickStats({ greenBatches, roastedBatches }: QuickStatsProps) {
  const totalGreenBags = Array.isArray(greenBatches)
    ? greenBatches.reduce((sum, batch) => sum + batch.quantityBags, 0)
    : 0;

  const totalRoastedBags = Array.isArray(roastedBatches)
    ? roastedBatches.reduce((sum, batch) => sum + batch.quantityBags, 0)
    : 0;

  const uniqueGreenVarieties = Array.isArray(greenBatches)
    ? new Set(greenBatches.map((b) => b.variety)).size
    : 0;

  const uniqueRoastedVarieties = Array.isArray(roastedBatches)
    ? new Set(roastedBatches.map((b) => b.variety)).size
    : 0;

  return (
    <div className="quick-stats">
      <div className="stat-card">
        <div className="stat-value">{totalGreenBags}</div>
        <div className="stat-label">Green Coffee Bags</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{uniqueGreenVarieties}</div>
        <div className="stat-label">Green Varieties</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{totalRoastedBags}</div>
        <div className="stat-label">Roasted Coffee Bags</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{uniqueRoastedVarieties}</div>
        <div className="stat-label">Roasted Varieties</div>
      </div>
    </div>
  );
}