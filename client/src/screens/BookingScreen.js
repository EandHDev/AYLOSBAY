import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingScreen.css";
import { BACKEND_URL } from "../config";

// Assuming you have Ant Design installed for messages, otherwise replace with your toast/alert system
import { message } from "antd"; // npm install antd

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
    // Redirect if user not logged in or no booking details
    if (!user) {
      console.log(
        "BookingScreen useEffect: Redirecting to /login - user is null"
      );
      navigate("/login");
      return;
    } else if (!location.state) {
      console.log(
        "BookingScreen useEffect: Redirecting to / - location.state is null"
      );
      navigate("/");
      return;
    }
  }, [user, location.state, navigate]);

  const handlePaystackPayment = async () => {
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      console.log("Frontend: Initializing payment for amount:", totalAmount);

      // First, initialize payment on your backend
      const response = await axios.post(
        `${BACKEND_URL}/api/paystack/initialize-payment`,
        {
          amount: totalAmount * 100, // Convert to pesewas (GHS to pesewas)
          email: user.email,
          bookingDetails: {
            roomId: roomId,
            roomName: roomName,
            fromDate: fromDate,
            toDate: toDate,
            totalDays: totalDays,
            totalAmount: totalAmount,
            rentPerDay: rentPerDay,
            userId: user._id,
            userName: user.name,
          },
        }
      );

      console.log("Frontend: Backend response:", response.data);

      if (response.data.status) {
        // Backend successfully initialized payment, redirect to Paystack
        message.success("Redirecting to payment gateway...");

        // Redirect to Paystack checkout page
        window.location.href = response.data.data.authorization_url;
      } else {
        // Backend returned an error
        setError(response.data.message || "Failed to initialize payment");
        message.error("Failed to initialize payment");
        setLoading(false);
      }
    } catch (error) {
      console.error("Frontend: Payment initialization error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message || "Payment initialization failed";
        setError(errorMessage);
        message.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        setError("Unable to connect to payment server");
        message.error("Unable to connect to payment server");
      } else {
        // Something else happened
        setError("An unexpected error occurred");
        message.error("An unexpected error occurred");
      }

      setLoading(false);
    }
  };

  // Render nothing if essential data is missing (redirect handled by useEffect)
  if (!location.state || !user) {
    console.log("BookingScreen: Returning null due to missing state or user.");
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
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
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
            <span className="detail-value">GHS {rentPerDay}</span>
          </div>

          <div className="detail-row total">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value">GHS {totalAmount}</span>
          </div>
        </div>
        <hr /> {/* Separator for payment section */}
        <div className="payment-section">
          <h3 className="mb-3">Payment Information</h3>
          <p className="payment-info">
            You will be redirected to Paystack to complete your payment
            securely.
          </p>

          <button
            className="payment-button"
            onClick={handlePaystackPayment}
            disabled={loading} // Disable button while processing
          >
            {loading ? "Processing..." : `Pay GHS ${totalAmount} with Paystack`}
          </button>

          {loading && (
            <div className="loading-message">
              <p>Initializing secure payment...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingScreen;
