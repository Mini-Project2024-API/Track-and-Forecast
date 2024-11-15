import React, { useState, useEffect } from "react";
import { getDestinationStations } from "../../services/trainApi";
import "../styles/DestinationSelector.css";

function DestinationSelector({
  selectedCity,
  closeModal,
  handleDestinationSelect,
}) {
  const [destinationStations, setDestinationStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinationStations = () => {
      setLoading(true);
      const destinations = getDestinationStations(selectedCity);
      setDestinationStations(destinations);
      setLoading(false);
    };

    if (selectedCity) {
      fetchDestinationStations();
    }
  }, [selectedCity]);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="destination-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Select Your Destination Station</h3>
        {loading ? (
          <p>Loading destinations...</p>
        ) : destinationStations.length > 0 ? (
          <div className="destination-options">
            {destinationStations.map((station) => (
              <button
                key={station}
                className="destination-button"
                onClick={() => {
                  handleDestinationSelect(station);
                  closeModal();
                }}
              >
                {station}
              </button>
            ))}
          </div>
        ) : (
          <p>No destinations found for this source.</p>
        )}
      </div>
    </div>
  );
}

export default DestinationSelector;
