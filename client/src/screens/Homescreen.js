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

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5001/api/rooms/getallrooms"
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

  useEffect(() => {
    if (!Array.isArray(rooms)) return;

    let tempRooms = [...rooms];

    if (roomType !== "All") {
      tempRooms = tempRooms.filter((room) => room.type === roomType);
    }

    setFilteredRooms(tempRooms);
  }, [rooms, roomType]);

  const handleFromDateChange = (e) => {
    const newFromDate = e.target.value;
    setFromDate(newFromDate);
    if (toDate && newFromDate > toDate) {
      setToDate("");
    }
  };

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

      <h1 className="text-center mb-4">
        Available Rooms ({filteredRooms.length})
      </h1>

      <div className="row">
        {filteredRooms.map((room) => (
          <div className="col-md-4 mb-4" key={room._id || Math.random()}>
            <Room
              room={room}
              fromDate={fromDate}
              toDate={toDate}
              isBookingAllowed={Boolean(fromDate && toDate)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Homescreen;
