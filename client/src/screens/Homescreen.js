import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Homescreen.css";

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [roomType, setRoomType] = useState("All");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "${process.env.REACT_APP_API_URL}/api/rooms/getallrooms"
      );

      if (!Array.isArray(response.data)) {
        throw new Error("API response is not an array");
      }

      const validRooms = response.data.map((room) => ({
        _id: room._id || "",
        name: room.name || "Unnamed Room",
        description: room.description || "No description available",
        type: room.type || "Not specified",
        maxcount: room.maxcount || 0,
        rentperday: room.rentperday || 0,
        imageurls: Array.isArray(room.imageurls) ? room.imageurls : [],
        isAvailable: true, // Default to true when no dates selected
      }));

      setRooms(validRooms);
      setFilteredRooms(validRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check availability when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      checkRoomAvailability();
    } else {
      // If no dates selected, show all rooms as potentially bookable
      const roomsWithoutAvailability = rooms.map((room) => ({
        ...room,
        isAvailable: true,
      }));
      applyFilters(roomsWithoutAvailability);
    }
  }, [fromDate, toDate, rooms]);

  const checkRoomAvailability = async () => {
    if (!fromDate || !toDate) return;

    setCheckingAvailability(true);
    try {
      console.log("Checking availability for:", fromDate, "to", toDate);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/rooms/check-availability`,
        {
          fromDate,
          toDate,
        }
      );

      if (response.data.success) {
        const roomsWithAvailability = response.data.data.rooms;
        console.log("Availability check result:", {
          available: response.data.data.availableCount,
          total: response.data.data.totalCount,
        });

        applyFilters(roomsWithAvailability);
      }
    } catch (error) {
      console.error("Error checking room availability:", error);
      // If availability check fails, show all rooms but log the error
      applyFilters(rooms.map((room) => ({ ...room, isAvailable: true })));
    } finally {
      setCheckingAvailability(false);
    }
  };

  const applyFilters = (roomsToFilter) => {
    let tempRooms = [...roomsToFilter];

    if (roomType !== "All") {
      tempRooms = tempRooms.filter((room) => room.type === roomType);
    }

    setFilteredRooms(tempRooms);
  };

  useEffect(() => {
    if (!Array.isArray(rooms)) return;

    // Apply room type filter to current rooms (with availability already checked)
    applyFilters(filteredRooms.length > 0 ? filteredRooms : rooms);
  }, [roomType]);

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    if (toDate && newFromDate > toDate) {
      setToDate("");
    }
  };

  const availableRoomsCount = filteredRooms.filter(
    (room) => room.isAvailable
  ).length;
  const hasSelectedDates = fromDate && toDate;

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return <div className="text-center text-danger">Error: {error}</div>;
  if (!Array.isArray(filteredRooms) || filteredRooms.length === 0) {
    return <div className="text-center">No rooms available</div>;
  }

  return (
    <div className="container mt-5">
      <div className="filters-container">
        <div className="filters-row">
          <div className="filter-item">
            <div className="date-input-wrapper">
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={handleFromDateChange}
                min={new Date().toISOString().split("T")[0]}
              />
              {!fromDate && <label>Check In Date</label>}
            </div>
          </div>

          <div className="filter-item">
            <div className="date-input-wrapper">
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate || new Date().toISOString().split("T")[0]}
                disabled={!fromDate}
              />
              {!toDate && <label>Check Out Date</label>}
            </div>
          </div>

          <div className="filter-item">
            <select
              className="form-control"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="All">All Rooms</option>
              <option value="Waterfront">Waterfront</option>
              <option value="Garden">Garden</option>
            </select>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className="text-center mb-3">
        {checkingAvailability ? (
          <div className="alert alert-info">
            🔄 Checking room availability for {fromDate} to {toDate}...
          </div>
        ) : hasSelectedDates ? (
          <div
            className={`alert ${
              availableRoomsCount > 0 ? "alert-success" : "alert-warning"
            }`}
          >
            📅 For {fromDate} to {toDate}: {availableRoomsCount} of{" "}
            {filteredRooms.length} rooms available
          </div>
        ) : (
          <div className="alert alert-light">
            📅 Select dates to check room availability
          </div>
        )}
      </div>

      <h1 className="text-center mb-4">
        {hasSelectedDates
          ? `Available Rooms (${availableRoomsCount}/${filteredRooms.length})`
          : `All Rooms (${filteredRooms.length})`}
      </h1>

      <div className="row">
        {filteredRooms.map((room) => (
          <div className="col-md-4 mb-4" key={room._id || Math.random()}>
            <Room
              room={room}
              fromDate={fromDate}
              toDate={toDate}
              isBookingAllowed={hasSelectedDates && room.isAvailable}
            />
            {/* Show availability status */}
            {hasSelectedDates && (
              <div className="text-center mt-2">
                {room.isAvailable ? (
                  <small className="text-success">
                    ✅ Available for selected dates
                  </small>
                ) : (
                  <small className="text-danger">
                    ❌ Not available for selected dates
                  </small>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No available rooms message */}
      {hasSelectedDates && availableRoomsCount === 0 && (
        <div className="text-center mt-4">
          <div className="alert alert-warning">
            <h4>No rooms available for selected dates</h4>
            <p>Please try different dates or contact us for assistance.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homescreen;
