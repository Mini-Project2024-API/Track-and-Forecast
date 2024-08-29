import React, { useState } from "react";
import "../styles/CitySelector.css";

const cities = [
  "Andheri",
  "Bandra",
  "Borivali",
  "Dadar",
  "Downtown",
  "Juhu",
  "Kandivali",
  "Kurla",
  "Malad",
  "Mumbai Central",
];

function CitySelector() {
  const [selectedCity, setSelectedCity] = useState("");

  const handleCityClick = (city) => {
    setSelectedCity(city);
  };

  return (
    <div className="city-selector">
      <h2>Select Your City</h2>
      <div className="city-options">
        {cities.map((city) => (
          <button
            key={city}
            className={`city-button ${selectedCity === city ? "active" : ""}`}
            onClick={() => handleCityClick(city)}
          >
            {city}
          </button>
        ))}
      </div>
      {selectedCity && (
        <p className="selected-city">You have selected: {selectedCity}</p>
      )}
    </div>
  );
}

export default CitySelector;
