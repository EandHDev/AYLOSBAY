// Create this file: client/src/components/AdminPanel.js

import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPanel() {
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
        "http://localhost:5001/api/paystack/admin/bookings"
      );
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      alert("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId, roomName) => {
    if (!window.confirm(`Cancel booking for ${roomName}?`)) return;

    try {
      const response = await axios.put(
        `http://localhost:5001/api/paystack/admin/bookings/${bookingId}/cancel`,
        { reason: "Cancelled by admin" }
      );

      if (response.data.success) {
        alert("Booking cancelled successfully!");
        fetchBookings(); // Refresh list
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
        `http://localhost:5001/api/paystack/admin/bookings/${bookingId}`
      );

      if (response.data.success) {
        alert("Booking deleted successfully!");
        fetchBookings(); // Refresh list
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
        "http://localhost:5001/api/paystack/admin/bookings/conflicts",
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

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>🛠️ Admin Panel - Booking Management</h2>

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

      {/* Bookings List */}
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

export default AdminPanel;
