import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserBookings();
  }, []); // ✅ Empty dependency array - run only once

  const fetchUserBookings = useCallback(async () => {
    try {
      console.log("🔍 Starting to fetch user bookings for user:", user._id);
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5001/api/paystack/user/bookings/${user._id}`
      );
      console.log("📡 API Response received:", response.data);

      if (response.data.success) {
        console.log(
          "✅ Setting bookings:",
          response.data.data.length,
          "bookings"
        );
        setBookings(response.data.data);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("❌ Error fetching user bookings:", error);
      setError("Error loading your bookings");
    } finally {
      console.log("🏁 Setting loading to false");
      setLoading(false);
    }
  }, [user._id]); // Only recreate if user._id changes

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
      case "confirmed":
        return "success";
      case "cancelled":
        return "danger";
      case "completed":
        return "secondary";
      default:
        return "info";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
      case "confirmed":
        return "✅";
      case "cancelled":
        return "❌";
      case "completed":
        return "🏁";
      default:
        return "📋";
    }
  };

  const isUpcoming = (fromDate) => {
    return new Date(fromDate) > new Date();
  };

  const isPast = (toDate) => {
    return new Date(toDate) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Loading your bookings...</h3>
        <p className="text-muted">
          Please wait while we fetch your booking history.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="text-primary mb-2">🏨 My Bookings</h1>
          <p className="text-muted lead">
            Welcome back, <strong>{user.name}</strong>! Here are your hotel
            reservations.
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <button
            onClick={() => navigate("/")}
            className="btn btn-success btn-lg"
            style={{ borderRadius: "25px" }}
          >
            📅 Book Another Room
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
      )}

      {/* Bookings Stats */}
      {bookings.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div className="text-primary mb-2" style={{ fontSize: "2rem" }}>
                  📊
                </div>
                <h3 className="text-primary">{bookings.length}</h3>
                <p className="text-muted mb-0">Total Bookings</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div className="text-success mb-2" style={{ fontSize: "2rem" }}>
                  📅
                </div>
                <h3 className="text-success">
                  {
                    bookings.filter(
                      (b) => isUpcoming(b.fromDate) && b.status === "booked"
                    ).length
                  }
                </h3>
                <p className="text-muted mb-0">Upcoming</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm">
              <div className="card-body">
                <div
                  className="text-secondary mb-2"
                  style={{ fontSize: "2rem" }}
                >
                  🏁
                </div>
                <h3 className="text-secondary">
                  {bookings.filter((b) => isPast(b.toDate)).length}
                </h3>
                <p className="text-muted mb-0">Completed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Bookings State */}
      {bookings.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🏨</div>
            <h3 className="text-primary mb-3">No bookings yet</h3>
            <p className="text-muted mb-4 lead">
              You haven't made any reservations with us yet.
              <br />
              Start planning your perfect lakeside getaway!
            </p>
            <button
              onClick={() => navigate("/")}
              className="btn btn-primary btn-lg"
              style={{ borderRadius: "25px" }}
            >
              Browse Available Rooms
            </button>
          </div>
        </div>
      ) : (
        /* Bookings List */
        <div className="row">
          {bookings.map((booking) => (
            <div key={booking._id} className="col-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row align-items-start">
                    {/* Booking Details */}
                    <div className="col-md-8">
                      <div className="d-flex align-items-center mb-3">
                        <h4 className="text-primary mb-0 me-3">
                          🏨 {booking.roomName}
                        </h4>
                        <span
                          className={`badge bg-${getStatusColor(
                            booking.status
                          )} px-3 py-2`}
                        >
                          {getStatusIcon(booking.status)}{" "}
                          {booking.status?.toUpperCase()}
                        </span>
                      </div>

                      <div className="row mb-3">
                        <div className="col-sm-6 col-lg-3 mb-2">
                          <strong className="text-muted">📅 Check-in:</strong>
                          <br />
                          <span>{formatDate(booking.fromDate)}</span>
                        </div>
                        <div className="col-sm-6 col-lg-3 mb-2">
                          <strong className="text-muted">📅 Check-out:</strong>
                          <br />
                          <span>{formatDate(booking.toDate)}</span>
                        </div>
                        <div className="col-sm-6 col-lg-3 mb-2">
                          <strong className="text-muted">🌙 Duration:</strong>
                          <br />
                          <span>{booking.totalDays} nights</span>
                        </div>
                        <div className="col-sm-6 col-lg-3 mb-2">
                          <strong className="text-muted">💰 Total Paid:</strong>
                          <br />
                          <span className="text-success fw-bold fs-5">
                            GHS {booking.totalAmount}
                          </span>
                        </div>
                      </div>

                      {booking.reference && (
                        <div className="alert alert-light border mb-0">
                          <strong>Booking Reference:</strong>
                          <span
                            className="ms-2 text-primary fw-bold"
                            style={{ fontFamily: "monospace" }}
                          >
                            {booking.reference}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="col-md-4 text-md-end">
                      {isUpcoming(booking.fromDate) &&
                        booking.status === "booked" && (
                          <div className="alert alert-warning py-2 mb-2">
                            <small>
                              <strong>📍 Upcoming Trip</strong>
                            </small>
                          </div>
                        )}

                      {isPast(booking.toDate) && (
                        <div className="alert alert-secondary py-2 mb-0">
                          <small>
                            <strong>🏁 Completed</strong>
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
