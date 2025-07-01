import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookingSuccessScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const reference = new URLSearchParams(location.search).get("reference");
  const bookingRef = new URLSearchParams(location.search).get("bookingRef");

  useEffect(() => {
    // Auto redirect to user dashboard after 6 seconds
    const timer = setTimeout(() => {
      navigate("/profile");
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleViewBookings = () => {
    navigate("/profile");
  };

  const handleBookAnother = () => {
    navigate("/");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <div
        className="card shadow-lg border-0"
        style={{ borderRadius: "15px", overflow: "hidden" }}
      >
        <div className="card-body text-center p-5">
          {/* Success Icon */}
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>

          {/* Main Success Message */}
          <h1
            className="text-success mb-3"
            style={{ fontSize: "2.5rem", fontWeight: "bold" }}
          >
            Booking Confirmed!
          </h1>

          <p className="lead text-muted mb-4">
            🎉 Your payment was successful and your booking has been confirmed.
          </p>

          {/* Booking Reference Section */}
          {(reference || bookingRef) && (
            <div
              className="alert alert-info border-0 mb-4"
              style={{ backgroundColor: "#e3f2fd" }}
            >
              <h5 className="alert-heading mb-3" style={{ color: "#1976d2" }}>
                📋 Booking Information
              </h5>

              {bookingRef && (
                <p className="mb-2">
                  <strong>Booking Reference:</strong>
                  <br />
                  <span
                    className="badge bg-primary p-2 mt-1"
                    style={{ fontSize: "16px", fontFamily: "monospace" }}
                  >
                    {bookingRef}
                  </span>
                </p>
              )}

              {reference && (
                <p className="mb-0">
                  <strong>Transaction Reference:</strong>
                  <br />
                  <small style={{ fontFamily: "monospace", color: "#666" }}>
                    {reference}
                  </small>
                </p>
              )}
            </div>
          )}

          {/* Email Confirmation Notice */}
          <div
            className="alert alert-success border-0 mb-4"
            style={{ backgroundColor: "#d4edda" }}
          >
            <p className="mb-0" style={{ color: "#155724" }}>
              📧 <strong>Confirmation email sent!</strong>
              <br />
              <small>
                Check your inbox for detailed booking information and check-in
                instructions.
              </small>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <button
              onClick={handleViewBookings}
              className="btn btn-primary btn-lg px-4"
              style={{ borderRadius: "25px" }}
            >
              📋 View My Bookings
            </button>

            <button
              onClick={handleBookAnother}
              className="btn btn-success btn-lg px-4"
              style={{ borderRadius: "25px" }}
            >
              🏨 Book Another Room
            </button>
          </div>

          {/* Auto Redirect Notice */}
          <p className="text-muted small mb-4" style={{ fontStyle: "italic" }}>
            You'll be automatically redirected to your booking dashboard in a
            few seconds...
          </p>

          {/* Thank You Message */}
          <div
            className="border-top pt-4 mt-4"
            style={{ borderColor: "#e9ecef !important" }}
          >
            <h5 className="text-primary mb-2">
              Thank you for choosing Aylos Bay! 🌊
            </h5>
            <p className="text-muted small mb-0">
              We look forward to providing you with an exceptional lakeside
              experience.
              <br />
              Questions? Contact us at info@aylosbay.com or +233 XXX XXX XXX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccessScreen;
