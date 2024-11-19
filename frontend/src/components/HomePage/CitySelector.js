import React, { useState, useEffect } from "react";
import { getTrains } from "../../services/trainApi";
import DestinationSelector from "./DestinationSelector";
import "../styles/CitySelector.css";

function CitySelector() {
  const [selectedCity, setSelectedCity] = useState("");
  const [sourceStations, setSourceStations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filters, setFilters] = useState([]);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);
  const [trainList, setTrainList] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSourceStations = async () => {
      setLoading(true);
      const trains = getTrains();
      const stations = trains
        .filter((train) => filter === "All" || train.line === filter)
        .map((train) => train.source);
      setSourceStations([...new Set(stations)]); // Remove duplicates
      setLoading(false);
    };
    fetchSourceStations();
  }, [filter]);

  useEffect(() => {
    const availableFilters = [
      "All",
      ...new Set(getTrains().map((train) => train.line)),
    ];
    setFilters(availableFilters);
  }, []);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setSelectedCity("");
    setSelectedDestination("");
    setTrainList([]);
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setIsDestinationModalOpen(true);
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
    const trainsForSelection = getTrains().filter(
      (train) =>
        train.source === selectedCity && train.destination === destination
    );
    setTrainList(trainsForSelection);
    setIsDestinationModalOpen(false);
    setIsTrainModalOpen(true);
  };

  const closeTrainModal = () => {
    setIsTrainModalOpen(false);
    setTrainList([]);
    setSelectedDestination("");
  };

  return (
    <div className="city-selector">
      <h2>Select Your Source Station</h2>
      <div className="filter-options">
        {filters.map((option) => (
          <button
            key={option}
            className={`filter-button ${filter === option ? "active" : ""}`}
            onClick={() => handleFilterChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="city-options">
        {loading ? (
          <p>Loading...</p>
        ) : sourceStations.length > 0 ? (
          sourceStations.map((station) => (
            <button
              key={station}
              className={`city-button ${
                selectedCity === station ? "active" : ""
              }`}
              onClick={() => handleCityClick(station)}
            >
              {station}
            </button>
          ))
        ) : (
          <p>No stations found for this filter.</p>
        )}
      </div>

      {isDestinationModalOpen && (
        <DestinationSelector
          selectedCity={selectedCity}
          closeModal={() => setIsDestinationModalOpen(false)}
          handleDestinationSelect={handleDestinationSelect}
        />
      )}

      {isTrainModalOpen && (
        <div className="modal-overlay" onClick={closeTrainModal}>
          <div className="train-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Available Trains</h3>
            {trainList.length > 0 ? (
              <ul>
                {trainList.map((train) => (
                  <li key={train.id}>
                    <strong>Train ID:</strong> {train.id},{" "}
                    <strong>Type:</strong> {train.type},{" "}
                    <strong>Timing:</strong> {train.timing}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No trains available for this route.</p>
            )}
            <button onClick={closeTrainModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CitySelector;
