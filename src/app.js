import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Inventory from "./Pages/Inventory";
import Purchases from "./Pages/Purchases";
import ExpirationTracking from "./Pages/ExpirationTracking";
import Sales from "./Pages/Sales";
import Alerts from "./Pages/Alerts";
import Services from "./Pages/Services";
import Login from "./Pages/Login";
import "./App.css";

const LOGIN_FLAG_KEY = "isLoggedIn";

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem(LOGIN_FLAG_KEY) === "true"
  );
  const location = useLocation();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(LOGIN_FLAG_KEY);
    setIsLoggedIn(false);
  };

  if (location.pathname === "/login") {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <div className="header">
        <h1>Sleepless N' Cafeinated Inventory</h1>
      </div>

      <div className="layout">
        <div className="sidenav">
          <Link to="/">Dashboard</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/purchases">Purchases</Link>
          <Link to="/expiration-tracking">Expiration Tracking</Link>
          <Link to="/sales">Sales</Link>
          <Link to="/alerts">Alerts</Link>
          <Link to="/services">Services</Link>
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              style={{ marginTop: "12px", width: "100%" }}
            >
              Logout
            </button>
          )}
        </div>

        <div className="main-content">
          <Routes>
            <Route
              path="/login"
              element={
                isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Purchases />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expiration-tracking"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ExpirationTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Alerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </div>

    </>
  );
}

export default App;
