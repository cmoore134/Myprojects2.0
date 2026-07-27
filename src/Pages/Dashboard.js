import InventorySummary from '../Components/InventorySummary';
import ServicesSummary from '../Components/ServicesSummary';
import LowStockCard from '../Components/LowStockCard';
import ExpirationCard from '../Components/ExpirationCard';
import './Dashboard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-grid">
      <InventorySummary />
      <ServicesSummary />
      <div className="dashboard-cards-row">
        <LowStockCard />
        <ExpirationCard />
      </div>
    </div>
  );
}
