import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";

function BookingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  useEffect(() => {
    message.success("Booking confirmed successfully!");
    // Redirect to bookings page after 3 seconds
    setTimeout(() => navigate("/profile"), 3000);
  }, [navigate]);

  return (
    <div className="success-container">
      <h2>Booking Successful!</h2>
      <p>Your payment has been processed successfully.</p>
      <p>Reference: {reference}</p>
      <p>Redirecting to your profile...</p>
    </div>
  );
}

export default BookingSuccess;
