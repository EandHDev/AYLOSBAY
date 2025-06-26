// client/src/screens/BookingFailureScreen.js
import React from "react";
import { useLocation } from "react-router-dom";

function BookingFailureScreen() {
  const location = useLocation();
  const reference = new URLSearchParams(location.search).get("reference");
  const status = new URLSearchParams(location.search).get("status");

  return (
    <div className="container mt-5 text-center">
      <h1 className="text-danger">Booking Failed!</h1>
      <p>
        There was an issue processing your payment or confirming your booking.
      </p>
      {reference && (
        <p>
          Transaction Reference: <strong>{reference}</strong>
        </p>
      )}
      {status && (
        <p>
          Status: <strong>{status}</strong>
        </p>
      )}
      <p>Please try again or contact support.</p>
    </div>
  );
}
export default BookingFailureScreen;
