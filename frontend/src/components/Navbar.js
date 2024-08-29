import React from "react";
import "./styles/navbar.css";

function Navbar() {
  return (
    <nav>
      <div className="container">
        <a className="logo" href="#">
          <i className="fas fa-map-signs"></i>
          Track & Forecast
        </a>

        <ul className="nav-links">
          <li>
            <a href="#">
              <i className="fas fa-home"></i> Home
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-bullhorn"></i> Announcements
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-route"></i> Alternate Paths
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fas fa-user"></i> Profile
            </a>
          </li>
        </ul>

        <div className="search-bar">
          <input type="text" placeholder="Search cities..." />
          <button type="submit">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <button className="mobile-menu-button">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
