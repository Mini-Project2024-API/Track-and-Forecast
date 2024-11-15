import React, { useState, useEffect } from "react";
import { getTrains } from "../../services/trainApi";
import DestinationSelector from "./DestinationSelector";
import "../styles/CitySelector.css";

function CitySelector() {
  const [selectedCity, setSelectedCity] = useState("");
  const [sourceStations, setSourceStations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [filters, setFilters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainList, setTrainList] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSourceStations = async () => {
      setLoading(true);
      const trains = getTrains(); // Fetch all trains first
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

  useEffect(() => {
    if (selectedCity && selectedDestination) {
      const fetchTrainsForSelection = () => {
        setLoading(true);
        const trainsForSelection = getTrains().filter(
          (train) =>
            train.source === selectedCity &&
            train.destination === selectedDestination
        );
        setTrainList(trainsForSelection);
        setLoading(false);
      };
      fetchTrainsForSelection();
    }
  }, [selectedCity, selectedDestination]);

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    setSelectedCity("");
    setIsModalOpen(false);
    setTrainList([]);
    setSelectedDestination("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrainList([]);
    setSelectedDestination("");
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  const handleDestinationSelect = (destination) => {
    setSelectedDestination(destination);
    setIsModalOpen(false);
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

      {isModalOpen && (
        <DestinationSelector
          selectedCity={selectedCity}
          closeModal={closeModal}
          handleDestinationSelect={handleDestinationSelect}
        />
      )}

      {trainList.length > 0 && (
        <div className="train-list">
          <h3>Available Trains:</h3>
          <ul>
            {trainList.map((train) => (
              <li key={train.id}>
                <strong>
                  {train.source} → {train.destination}
                </strong>{" "}
                ({train.type}) - {train.timing}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CitySelector;
