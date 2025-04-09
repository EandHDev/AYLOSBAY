import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Room.css";

function Room({ room, fromDate, toDate, isBookingAllowed }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!room || typeof room !== "object") {
    return null;
  }

  const {
    _id = "",
    name = "Unnamed Room",
    description = "No description available",
    type = "Not specified",
    maxcount = 0,
    rentperday = 0,
    imageurls = [],
  } = room;

  const firstImage =
    Array.isArray(imageurls) && imageurls.length > 0
      ? imageurls[0]
      : "https://via.placeholder.com/400x300?text=No+Image";

  const handleNextImage = () => {
    if (imageurls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === imageurls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (imageurls.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? imageurls.length - 1 : prev - 1
      );
    }
  };

  const handleBooking = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Calculate total days and amount
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalAmount = totalDays * room.rentperday;

    // Pass booking details through navigation
    navigate(`/book/${room._id}`, {
      state: {
        roomId: room._id,
        roomName: room.name,
        fromDate,
        toDate,
        totalDays,
        totalAmount,
        rentPerDay: room.rentperday,
      },
    });
  };

  return (
    <div className="room-card">
      <div className="card">
        <img
          src={firstImage}
          alt={name}
          className="card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />

        <div className="card-content">
          <h3>{name}</h3>
          <p>{description}</p>

          <div className="room-details">
            <p>
              <strong>Type:</strong> {type}
            </p>
            <p>
              <strong>Max Guests:</strong> {maxcount}
            </p>
            <p>
              <strong>Price:</strong> ${rentperday}/night
            </p>
          </div>

          <div className="button-group">
            <button className="btn-view" onClick={() => setShowModal(true)}>
              View Details
            </button>

            {isBookingAllowed && (
              <button
                className="btn-book"
                onClick={handleBooking}
                disabled={!isBookingAllowed}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>

            <div className="image-carousel">
              {imageurls.length > 1 && (
                <button className="carousel-btn prev" onClick={handlePrevImage}>
                  ‹
                </button>
              )}

              <img
                src={imageurls[currentImageIndex]}
                alt={`${name} - View ${currentImageIndex + 1}`}
                className="carousel-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />

              {imageurls.length > 1 && (
                <button className="carousel-btn next" onClick={handleNextImage}>
                  ›
                </button>
              )}
            </div>

            <div className="modal-details">
              <h2>{name}</h2>
              <div className="details-grid">
                <p>
                  <strong>Type:</strong> {type}
                </p>
                <p>
                  <strong>Max Guests:</strong> {maxcount}
                </p>
                <p>
                  <strong>Price:</strong> ${rentperday}/night
                </p>
                <p>
                  <strong>Description:</strong> {description}
                </p>
              </div>

              {isBookingAllowed && (
                <button
                  className="btn-book"
                  onClick={() => {
                    setShowModal(false);
                    handleBooking();
                  }}
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Room;
