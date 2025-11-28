import { useMemo } from 'react';
import {
  getAllGreenBatches,
  getAllRoastedBatches,
  getAllCuppingRecords,
  getAllCustomers,
} from '../../repositories/localStore';
import './QuickStats.css';

export default function QuickStats() {
  const greenBatches = getAllGreenBatches();
  const roastedBatches = getAllRoastedBatches();
  const cuppingRecords = getAllCuppingRecords();
  const customers = getAllCustomers();

  const stats = useMemo(() => {
    const totalGreenBags = greenBatches.reduce((sum, b) => sum + b.quantityBags, 0);
    const totalRoastedBags = roastedBatches.reduce((sum, b) => sum + b.quantityBags, 0);
    
    const uniqueVarieties = new Set([
      ...greenBatches.map((b) => b.variety),
      ...roastedBatches.map((b) => b.variety),
    ]).size;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCuppings = cuppingRecords.filter(
      (r) => new Date(r.date) >= thirtyDaysAgo
    );
    const avgRecentScore =
      recentCuppings.length > 0
        ? recentCuppings.reduce((sum, r) => sum + r.score, 0) / recentCuppings.length
        : 0;

    return {
      totalGreenBags,
      totalRoastedBags,
      uniqueVarieties,
      avgRecentScore,
      totalCustomers: customers.length,
    };
  }, [greenBatches, roastedBatches, cuppingRecords, customers]);

  return (
    <div className="quick-stats">
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalGreenBags}</div>
          <div className="stat-label">Green Bags</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">☕</div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalRoastedBags}</div>
          <div className="stat-label">Roasted Bags</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🌱</div>
        <div className="stat-content">
          <div className="stat-value">{stats.uniqueVarieties}</div>
          <div className="stat-label">Varieties</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">⭐</div>
        <div className="stat-content">
          <div className="stat-value">
            {stats.avgRecentScore > 0 ? stats.avgRecentScore.toFixed(1) : '–'}
          </div>
          <div className="stat-label">Avg Quality (30d)</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalCustomers}</div>
          <div className="stat-label">Customers</div>
        </div>
      </div>
    </div>
  );
}