// client/src/screens/BookingSuccessScreen.js
import React from "react";
import { useLocation } from "react-router-dom";

function BookingSuccessScreen() {
  const location = useLocation();
  const reference = new URLSearchParams(location.search).get("reference");

  return (
    <div className="container mt-5 text-center">
      <h1 className="text-success">Booking Confirmed!</h1>
      <p>Your payment was successful and your booking has been confirmed.</p>
      {reference && (
        <p>
          Transaction Reference: <strong>{reference}</strong>
        </p>
      )}
      <p>Thank you for choosing Aylos Bay!</p>
    </div>
  );
}
export default BookingSuccessScreen;
