import { useEffect, useState } from "react";
import ServicesHistoryChart from "./ServicesHistoryChart";
import "./ServicesSummary.css";
import { fetchJSON } from "../api";

function ServicesSummary() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchJSON("/services/").then((data) => {
      if (mounted) setServices(data || []);
    });
    return () => (mounted = false);
  }, []);

  const totalServices = services.length;
  const uniqueCategories = [...new Set(services.map((service) => service.category).filter(Boolean))];
  const totalPrice = services.reduce((sum, service) => sum + (service.price || 0), 0);
  const averagePrice = totalServices ? totalPrice / totalServices : 0;

  return (
    <div className="dashboard-widget">
      <h3>Services Overview</h3>
      <div className="card-grid">
        <div className="services-summary-card">
          <h4>Total Services</h4>
          <p>{totalServices}</p>
        </div>
        <div className="services-summary-card">
          <h4>Categories</h4>
          <p>{uniqueCategories.length}</p>
        </div>
        <div className="services-summary-card">
          <h4>Average Price</h4>
          <p>${averagePrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="services-history-charts">
        <ServicesHistoryChart />
      </div>
    </div>
  );
}

export default ServicesSummary;
