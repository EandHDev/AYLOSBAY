import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";

function BookingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const bookingRef = searchParams.get("bookingRef");

  useEffect(() => {
    message.success("Booking confirmed successfully!");
    // Redirect to profile/dashboard after 5 seconds
    setTimeout(() => navigate("/profile"), 5000);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Success Icon */}
        <div style={{ fontSize: "80px", marginBottom: "20px" }}>✅</div>

        {/* Success Message */}
        <h2
          style={{
            color: "#28a745",
            fontSize: "28px",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
        >
          Booking Successful!
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "25px",
            lineHeight: "1.6",
          }}
        >
          🎉 Your payment has been processed successfully and your reservation
          is confirmed!
        </p>

        {/* Booking References */}
        <div
          style={{
            backgroundColor: "#e3f2fd",
            border: "1px solid #90caf9",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <h4
            style={{ color: "#1976d2", marginTop: "0", marginBottom: "10px" }}
          >
            📋 Booking Information
          </h4>

          {bookingRef && (
            <p style={{ margin: "8px 0" }}>
              <strong>Booking Reference:</strong>
              <br />
              <span
                style={{
                  color: "#1976d2",
                  fontWeight: "bold",
                  fontSize: "18px",
                  fontFamily: "monospace",
                }}
              >
                {bookingRef}
              </span>
            </p>
          )}

          {reference && (
            <p style={{ margin: "8px 0" }}>
              <strong>Transaction ID:</strong>
              <br />
              <span
                style={{
                  color: "#666",
                  fontFamily: "monospace",
                  fontSize: "14px",
                }}
              >
                {reference}
              </span>
            </p>
          )}
        </div>

        {/* Email Notice */}
        <div
          style={{
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "25px",
          }}
        >
          <p style={{ margin: "0", color: "#155724", fontSize: "14px" }}>
            📧 <strong>Confirmation email sent!</strong>
            <br />
            Check your inbox for detailed booking information.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate("/profile")}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📋 View My Bookings
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🏠 Book Another Room
          </button>
        </div>

        {/* Auto Redirect Notice */}
        <p
          style={{
            fontSize: "13px",
            color: "#999",
            fontStyle: "italic",
          }}
        >
          Redirecting to your profile in 5 seconds...
        </p>
      </div>
    </div>
  );
}

export default BookingSuccess;
