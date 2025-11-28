import NeedsAttention from './NeedsAttention';
import ForecastSummary from './ForecastSummary';
import QuickStats from './QuickStats';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <h2>Dashboard</h2>
      <p className="dashboard-subtitle">Your coffee inventory at a glance</p>

      <QuickStats />

      <div className="dashboard-widgets">
        <div className="widget-column">
          <NeedsAttention />
        </div>

        <div className="widget-column">
          <ForecastSummary />
        </div>
      </div>
    </div>
  );
}