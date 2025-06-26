import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingScreen.css";

// Paystack Imports
import { usePaystackPayment } from "react-paystack"; // Import Paystack hook

// Assuming you have Ant Design installed for messages, otherwise replace with your toast/alert system
import { message } from "antd"; // npm install antd

// Replace with your actual Paystack Public Key
const PAYSTACK_PUBLIC_KEY = "pk_test_9ec0a80bbac6a7743513f5ca5a99cf472a1f899d"; // <--- ENSURE THIS IS YOUR REAL PAYSTACK PUBLIC KEY

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

  // Paystack configuration
  const config = {
    reference: new Date().getTime().toString(),
    email: user ? user.email : "guest@example.com",
    amount: totalAmount * 100, // Amount in pesewas (1 GHS = 100 pesewas)
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "GHS", // <--- ADD THIS LINE
    metadata: {
      bookingDetails: {
        roomId: roomId,
        roomName: roomName,
        fromDate: fromDate,
        toDate: toDate,
        userId: user ? user._id : null,
        userName: user ? user.name : null,
      },
    },
  };

  // Initialize Paystack hook
  const initializePayment = usePaystackPayment(config);

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
    // No Stripe-specific loading here for Paystack
  }, [user, location.state, navigate]);

  const handlePaystackPayment = () => {
    setLoading(true); // Set loading state when payment process starts
    initializePayment({
      onSuccess: (response) => {
        // Payment successful on Paystack's side.
        // Now, verify on backend and save booking.
        // Paystack redirects to backend /verify-payment/:reference
        // The backend will then redirect back to /booking-success or /booking-failure
        console.log(
          "Frontend: Paystack onSuccess callback - response:",
          response
        );
        message.success("Payment successful! Redirecting for confirmation...");
        // No direct API call from here needed for verification, as Paystack handles redirect
        // The backend's /verify-payment route will handle the final booking confirmation.
      },
      onClose: () => {
        message.info("Payment window closed.");
        setLoading(false); // Reset loading if user closes popup
      },
      onLoad: () => {
        // Optional: show loading spinner or message while Paystack popup loads
        console.log("Paystack popup loaded.");
      },
      onError: (error) => {
        console.error("Paystack payment error:", error);
        message.error("Payment failed. Please try again.");
        setLoading(false); // Reset loading on error
      },
    });
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
            <span className="detail-value">GHS{rentPerDay}</span>
          </div>

          <div className="detail-row total">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value">GHS{totalAmount}</span>
          </div>
        </div>
        <hr /> {/* Separator for payment section */}
        <h3 className="mb-3">Payment Information (Paystack)</h3>
        <button
          className="payment-button"
          onClick={handlePaystackPayment}
          disabled={loading} // Disable button while processing
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default BookingScreen;
