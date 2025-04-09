import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingScreen.css";

function BookingScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const {
    roomId,
    roomName,
    fromDate,
    toDate,
    totalDays,
    totalAmount,
    rentPerDay,
  } = location.state || {};

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (!location.state) {
      navigate("/");
    }
  }, [user, location.state, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const bookingDetails = {
        room: roomId,
        roomName,
        userId: user._id,
        userName: user.name,
        fromDate,
        toDate,
        totalDays,
        totalAmount,
        rentPerDay,
      };

      const response = await axios.post(
        "http://localhost:5001/api/bookings/bookroom",
        bookingDetails
      );

      setLoading(false);
      // Navigate to success page or show success message
      navigate("/booking-success", { state: { bookingId: response.data._id } });
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message || "Something went wrong with the booking"
      );
    }
  };

  if (!location.state || !user) {
    return null;
  }

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>Booking Details</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{user.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Room:</span>
            <span className="detail-value">{roomName}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Check In:</span>
            <span className="detail-value">{fromDate}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Check Out:</span>
            <span className="detail-value">{toDate}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Total Days:</span>
            <span className="detail-value">{totalDays}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Rate Per Day:</span>
            <span className="detail-value">${rentPerDay}</span>
          </div>

          <div className="detail-row total">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value">${totalAmount}</span>
          </div>
        </div>

        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default BookingScreen;
