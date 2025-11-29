import { useState, useEffect } from 'react';
import type { GreenCoffeeBatch, RoastedCoffeeBatch } from '../../entities';
import { getAllGreenBatches, getAllRoastedBatches } from '../../repositories/localStore';
import QuickStats from './QuickStats';
import NeedsAttention from './NeedsAttention';
import ForecastSummary from './ForecastSummary';
import './HomePage.css';

export default function HomePage() {
  const [greenBatches, setGreenBatches] = useState<GreenCoffeeBatch[]>([]);
  const [roastedBatches, setRoastedBatches] = useState<RoastedCoffeeBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [green, roasted] = await Promise.all([
      getAllGreenBatches(),
      getAllRoastedBatches(),
    ]);
    setGreenBatches(green);
    setRoastedBatches(roasted);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="home-page">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h2>Welcome to La Tazza Bean Vault</h2>
        <p>Your specialty coffee inventory management system</p>
      </div>

      <QuickStats greenBatches={greenBatches} roastedBatches={roastedBatches} />

      <NeedsAttention />

      <ForecastSummary />
    </div>
  );
}