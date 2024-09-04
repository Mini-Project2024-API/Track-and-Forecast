import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Announcement from "../components/HomePage/Announcement";
import CitySelector from "../components/HomePage/CitySelector";
import "../components/styles/alert.css";
import "../components/styles/Homepage.css";

function Homepage() {
  const location = useLocation();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (location.state?.alert) {
      setAlert(location.state.alert);
    }
  }, [location]);

  return (
    <div className="homepage">
      {alert && (
        <div
          className={`alert offset-3 col-6 alert-${alert.type}`}
          role="alert"
        >
          <i
            className={`alert-icon fas fa-${
              alert.type === "success"
                ? "check-circle"
                : alert.type === "danger"
                ? "exclamation-circle"
                : "info-circle"
            }`}
          ></i>
          <div className="alert-message">{alert.message}</div>
          <button onClick={() => setAlert(null)} className="close-alert">
            &times;
          </button>
        </div>
      )}
      <Announcement />
      <main className="content">
        <section className="intro">
          <h1>Welcome to Track & Forecast</h1>
          <p>
            Your one-stop solution for tracking and forecasting local train
            schedules.
          </p>
        </section>
        <section className="city-selection">
          <CitySelector />
        </section>
      </main>
    </div>
  );
}

export default Homepage;
