import React from "react";
import Navbar from "../components/Navbar";
import Announcement from "../components/HomePage/Announcement";
import Footer from "../components/Footer";
import CitySelector from "../components/HomePage/CitySelector";
import "../components/styles/Homepage.css";

function Homepage() {
  return (
    <div className="homepage">
      <Navbar />
      <Announcement />
      <main className="content">
        <section className="intro">
          <h1>Welcome to Track & Forecast</h1>
          <p>
            Your one-stop solution for tracking and forecasting local train and
            bus schedules.
          </p>
        </section>
        <section className="city-selection">
          <CitySelector />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Homepage;
