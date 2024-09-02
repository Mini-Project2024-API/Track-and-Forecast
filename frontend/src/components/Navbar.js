import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./styles/navbar.css";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setAlert({ type: "success", message: "Logout successful!" });
    setTimeout(() => {
      setAlert(null);
      navigate("/");
    }, 2000);
  };

  return (
    <>
      <nav>
        <div className="container">
          {/* Logo */}
          <div className="logo">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img src={logo} alt="Logo" className="navbar-logo" />
            </Link>
          </div>

          <ul className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-home"></i> &nbsp;Home
              </Link>
            </li>
            <li>
              <Link to="/announcement" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-bullhorn"></i> &nbsp;Announcements
              </Link>
            </li>
            <li>
              <Link
                to="/alternate-path"
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-route"></i> &nbsp;Alternate Paths
              </Link>
            </li>
            <li
              className={`dropdown ${dropdownOpen ? "open" : ""}`}
              onClick={toggleDropdown}
            >
              <a href="#">
                <i className="fas fa-user"></i> &nbsp;Profile
              </a>
              <ul className="dropdown-menu">
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="logout-button">
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Signup
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>

          <div className="search-bar">
            <input type="text" placeholder="Search cities..." />
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </nav>

      {alert && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}
    </>
  );
}

export default Navbar;
