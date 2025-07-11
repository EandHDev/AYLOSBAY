// Clean, Tabular UserDashboard.js - Matching Admin Style

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

function UserDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const fetchUserBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/paystack/user/bookings/${user._id}`
      );

      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      setError("Error loading your bookings");
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserBookings();
  }, []);

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
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2>🔄 Loading your bookings...</h2>
        <p>Please wait while we fetch your booking history.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1
            style={{ margin: "0 0 5px 0", color: "#2c5aa0", fontSize: "28px" }}
          >
            🏨 My Bookings
          </h1>
          <p style={{ margin: "0", color: "#666", fontSize: "16px" }}>
            Welcome back, <strong>{user.name}</strong>! Here are your
            reservations.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📅 Book Another Room
        </button>
      </div>

      {/* Quick Stats */}
      {bookings.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#007bff",
                marginBottom: "8px",
              }}
            >
              📊
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#2c5aa0" }}
            >
              {bookings.length}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>
              Total Bookings
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#28a745",
                marginBottom: "8px",
              }}
            >
              📅
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#2c5aa0" }}
            >
              {
                bookings.filter(
                  (b) => isUpcoming(b.fromDate) && b.status === "booked"
                ).length
              }
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>Upcoming</div>
          </div>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#6f42c1",
                marginBottom: "8px",
              }}
            >
              🏁
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#2c5aa0" }}
            >
              {bookings.filter((b) => isPast(b.toDate)).length}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>Completed</div>
          </div>

          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                color: "#ffc107",
                marginBottom: "8px",
              }}
            >
              💰
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#2c5aa0" }}
            >
              GHS{" "}
              {bookings.reduce(
                (total, booking) => total + booking.totalAmount,
                0
              )}
            </div>
            <div style={{ color: "#666", fontSize: "14px" }}>Total Spent</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #f5c6cb",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Main Content */}
      {bookings.length === 0 ? (
        /* No Bookings State */
        <div
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            padding: "60px 30px",
            textAlign: "center",
            border: "1px solid #dee2e6",
          }}
        >
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>🏨</div>
          <h3 style={{ color: "#2c5aa0", marginBottom: "15px" }}>
            No bookings yet
          </h3>
          <p style={{ color: "#666", marginBottom: "25px", fontSize: "16px" }}>
            You haven't made any reservations with us yet.
            <br />
            Start planning your perfect lakeside getaway!
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Browse Available Rooms
          </button>
        </div>
      ) : (
        /* Clean Tabular Bookings List */
        <div>
          <h3 style={{ marginBottom: "20px", color: "#2c5aa0" }}>
            📋 Your Reservations ({bookings.length})
          </h3>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                      fontWeight: "bold",
                      color: "#495057",
                    }}
                  >
                    Room
                  </th>
                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "left",
                      borderBottom: "2px solid #dee2e6",
                      fontWeight: "bold",
                      color: "#495057",
                    }}
                  >
                    Dates
                  </th>
                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "center",
                      borderBottom: "2px solid #dee2e6",
                      fontWeight: "bold",
                      color: "#495057",
                    }}
                  >
                    Duration
                  </th>
                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "right",
                      borderBottom: "2px solid #dee2e6",
                      fontWeight: "bold",
                      color: "#495057",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "center",
                      borderBottom: "2px solid #dee2e6",
                      fontWeight: "bold",
                      color: "#495057",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "15px 12px",
                      textAlign: "center",
                      borderBottom: "2px solid #dee2e6",
                      fontWeight: "bold",
                      color: "#495057",
                    }}
                  >
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    style={{
                      borderBottom:
                        index < bookings.length - 1 ? "1px solid #eee" : "none",
                      "&:hover": { backgroundColor: "#f8f9fa" },
                    }}
                  >
                    {/* Room Name */}
                    <td style={{ padding: "15px 12px", verticalAlign: "top" }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#2c5aa0",
                          marginBottom: "4px",
                        }}
                      >
                        🏨 {booking.roomName}
                      </div>
                      {isUpcoming(booking.fromDate) &&
                        booking.status === "booked" && (
                          <span
                            style={{
                              backgroundColor: "#fff3cd",
                              color: "#856404",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "bold",
                            }}
                          >
                            📍 UPCOMING
                          </span>
                        )}
                      {isPast(booking.toDate) && (
                        <span
                          style={{
                            backgroundColor: "#e2e3e5",
                            color: "#6c757d",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          🏁 COMPLETED
                        </span>
                      )}
                    </td>

                    {/* Dates */}
                    <td style={{ padding: "15px 12px", verticalAlign: "top" }}>
                      <div style={{ marginBottom: "4px" }}>
                        <strong>📅 In:</strong> {formatDate(booking.fromDate)}
                      </div>
                      <div>
                        <strong>📅 Out:</strong> {formatDate(booking.toDate)}
                      </div>
                    </td>

                    {/* Duration */}
                    <td
                      style={{
                        padding: "15px 12px",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                        {booking.totalDays}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {booking.totalDays === 1 ? "night" : "nights"}
                      </div>
                    </td>

                    {/* Amount */}
                    <td
                      style={{
                        padding: "15px 12px",
                        textAlign: "right",
                        verticalAlign: "top",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#28a745",
                        }}
                      >
                        GHS {booking.totalAmount}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        (GHS {booking.rentPerDay}/night)
                      </div>
                    </td>

                    {/* Status */}
                    <td
                      style={{
                        padding: "15px 12px",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor:
                            getStatusColor(booking.status) === "success"
                              ? "#28a745"
                              : getStatusColor(booking.status) === "danger"
                              ? "#dc3545"
                              : getStatusColor(booking.status) === "secondary"
                              ? "#6c757d"
                              : "#17a2b8",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "15px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          display: "inline-block",
                        }}
                      >
                        {getStatusIcon(booking.status)}{" "}
                        {booking.status?.toUpperCase()}
                      </span>
                    </td>

                    {/* Reference */}
                    <td
                      style={{
                        padding: "15px 12px",
                        textAlign: "center",
                        verticalAlign: "top",
                      }}
                    >
                      {booking.reference ? (
                        <code
                          style={{
                            backgroundColor: "#f8f9fa",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            color: "#007bff",
                            border: "1px solid #e9ecef",
                          }}
                        >
                          {booking.reference}
                        </code>
                      ) : (
                        <span style={{ color: "#6c757d", fontSize: "12px" }}>
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Info */}
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
              fontSize: "14px",
              color: "#666",
              border: "1px solid #dee2e6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <span>
                📊 Showing {bookings.length} booking
                {bookings.length !== 1 ? "s" : ""}
              </span>
              <span>
                💰 Total spent:{" "}
                <strong>
                  GHS{" "}
                  {bookings.reduce(
                    (total, booking) => total + booking.totalAmount,
                    0
                  )}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
