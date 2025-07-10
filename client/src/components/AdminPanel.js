// AdminPanel.js - Updated to use direct backend connection
import React, { useState, useEffect } from "react";
import axios from "axios";

// Direct backend connection - no proxy needed with SSL frontend
const BACKEND_URL = "https://api.allorigins.win/raw?url=http://booking-app-backend-alb.eba-mnfnnxen.us-east-1.elasticbeanstalk.com";

// Admin whitelist
const ADMIN_EMAILS = ["nigel@ianaitch.com", "elijah@ianaitch.com"];

console.log("BACKEND_URL being used:", BACKEND_URL);
console.log("Full login URL:", `${BACKEND_URL}/api/auth/admin-login`);

// Configure axios to include auth token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!ADMIN_EMAILS.includes(email)) {
      setError("Unauthorized access - Invalid admin email");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting admin login...");
      console.log("Backend URL:", BACKEND_URL);

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 30000) // 30 second timeout
      );

      const loginPromise = axios.post(`${BACKEND_URL}/api/auth/admin-login`, {
        email,
        password,
      });

      const response = await Promise.race([loginPromise, timeoutPromise]);

      if (response.data.success) {
        const { token } = response.data;

        // Store token and email
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminEmail", email);

        // Set token for future requests
        setAuthToken(token);

        onLogin(email);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.message === 'Request timeout') {
        setError("Request timeout. Please try again.");
      } else if (error.response?.status === 401) {
        setError("Invalid credentials");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          🔐 Admin Login
        </h2>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your admin email"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
                color: "#555",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#dc3545",
                fontSize: "14px",
                marginBottom: "20px",
                textAlign: "center",
                backgroundColor: "#f8d7da",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #f5c6cb",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#6c757d",
            textAlign: "center",
          }}
        >
          Only authorized administrators can access this panel
        </div>
      </div>
    </div>
  );
}

function ProtectedAdminPanel({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("adminToken");
    const email = localStorage.getItem("adminEmail");

    if (!token || !email || !ADMIN_EMAILS.includes(email)) {
      setLoading(false);
      return;
    }

    try {
      // Set token for request
      setAuthToken(token);

      // Use verify-admin endpoint with direct backend URL
      const response = await axios.get(`${BACKEND_URL}/api/auth/verify-admin`);

      if (response.data.success) {
        setIsAuthenticated(true);
        setAdminEmail(email);
      } else {
        // Token invalid, clear storage
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        setAuthToken(null);
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      // Token invalid or expired
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminEmail");
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (email) => {
    setIsAuthenticated(true);
    setAdminEmail(email);
  };

  const handleLogout = async () => {
    // Skip the backend logout call that might be causing issues
    // Just clear local storage and state directly
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    setAuthToken(null);
    setIsAuthenticated(false);
    setAdminEmail("");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "#6c757d",
        }}
      >
        <div>
          <div style={{ marginBottom: "10px" }}>
            🔄 Verifying credentials...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Admin Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "2px solid #007bff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px", fontWeight: "500", color: "#333" }}>
            🛠️ Admin Dashboard
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#6c757d",
              backgroundColor: "#e9ecef",
              padding: "4px 8px",
              borderRadius: "12px",
            }}
          >
            {adminEmail}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.3s",
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Protected Content */}
      <div>{children}</div>
    </div>
  );
}

// Updated AdminPanel component with direct backend URLs
function AdminPanelContent() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/paystack/admin/bookings`
      );
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        window.location.reload();
      } else {
        alert("Error fetching bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId, roomName) => {
    if (!window.confirm(`Cancel booking for ${roomName}?`)) return;

    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/paystack/admin/bookings/${bookingId}/cancel`,
        { reason: "Cancelled by admin" }
      );

      if (response.data.success) {
        alert("Booking cancelled successfully!");
        fetchBookings();
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling booking");
    }
  };

  const deleteBooking = async (bookingId, roomName) => {
    if (
      !window.confirm(
        `Permanently delete booking for ${roomName}? This cannot be undone.`
      )
    )
      return;

    try {
      const response = await axios.delete(
        `${BACKEND_URL}/api/paystack/admin/bookings/${bookingId}`
      );

      if (response.data.success) {
        alert("Booking deleted successfully!");
        fetchBookings();
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Error deleting booking");
    }
  };

  const checkConflicts = async () => {
    if (!selectedDates.fromDate || !selectedDates.toDate) {
      alert("Please select both dates");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/paystack/admin/bookings/conflicts`,
        selectedDates
      );

      if (response.data.success) {
        const conflicts = response.data.data;
        if (conflicts.length === 0) {
          alert("No conflicts found for selected dates");
        } else {
          alert(
            `Found ${conflicts.length} conflicting bookings for selected dates`
          );
        }
      }
    } catch (error) {
      console.error("Error checking conflicts:", error);
      alert("Error checking conflicts");
    }
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Loading bookings...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Date Conflict Checker */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <h4>Check Date Conflicts</h4>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="date"
            value={selectedDates.fromDate}
            onChange={(e) =>
              setSelectedDates({ ...selectedDates, fromDate: e.target.value })
            }
            min={new Date().toISOString().split("T")[0]}
          />
          <input
            type="date"
            value={selectedDates.toDate}
            onChange={(e) =>
              setSelectedDates({ ...selectedDates, toDate: e.target.value })
            }
            min={selectedDates.fromDate}
          />
          <button
            onClick={checkConflicts}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Check Conflicts
          </button>
        </div>
      </div>

      <div>
        <h4>Recent Bookings ({bookings.length})</h4>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f1f1f1" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Room
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Guest
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Dates
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Amount
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Status
                </th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {booking.roomName}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {booking.userName}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {booking.fromDate} to {booking.toDate}
                    <br />
                    <small>({booking.totalDays} nights)</small>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    GHS {booking.totalAmount}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    <span
                      style={{
                        color: booking.status === "booked" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>
                    {booking.status === "booked" && (
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          flexDirection: "column",
                        }}
                      >
                        <button
                          onClick={() =>
                            cancelBooking(booking._id, booking.roomName)
                          }
                          style={{
                            backgroundColor: "#ffc107",
                            color: "black",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            deleteBooking(booking._id, booking.roomName)
                          }
                          style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>Cancel:</strong> Marks booking as cancelled (keeps record)
        </p>
        <p>
          <strong>Delete:</strong> Permanently removes booking (cannot be
          undone)
        </p>
        <p>
          <em>Both actions make the room available for new bookings.</em>
        </p>
      </div>
    </div>
  );
}

// Main component to export
function AdminPanel() {
  return (
    <ProtectedAdminPanel>
      <AdminPanelContent />
    </ProtectedAdminPanel>
  );
}

export default AdminPanel;
