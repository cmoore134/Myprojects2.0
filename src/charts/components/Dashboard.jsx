import { Link } from "react-router-dom";

const links = [
  { label: "Inventory", path: "/inventory" },
  { label: "Purchases", path: "/purchases" },
  { label: "Expiration Tracking", path: "/expiration-tracking" },
  { label: "Sales", path: "/sales" },
  { label: "Alerts", path: "/alerts" },
  { label: "Services", path: "/services" },
];

function Dashboard() {
  return (
    <div className="dashboard-grid">
      {links.map((link) => (
        <Link key={link.path} to={link.path} className="dashboard-card">
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export default Dashboard;
