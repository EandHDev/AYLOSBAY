import React, { useState } from "react";
import axios from "axios";

function AddRoom() {
  const [room, setRoom] = useState({
    name: "",
    rentperday: "",
    maxcount: "",
    description: "",
    phonenumber: "",
    type: "",
    imageurls: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/rooms/addroom`,
        room
      );
      console.log(result.data);
      alert("Room Added Successfully");
      // Clear form
      setRoom({
        name: "",
        rentperday: "",
        maxcount: "",
        description: "",
        phonenumber: "",
        type: "",
        imageurls: [],
      });
    } catch (error) {
      console.log(error);
      alert("Error adding room");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Add Room</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Room Name</label>
          <input
            type="text"
            className="form-control"
            value={room.name}
            onChange={(e) => setRoom({ ...room, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Rent Per Day</label>
          <input
            type="number"
            className="form-control"
            value={room.rentperday}
            onChange={(e) => setRoom({ ...room, rentperday: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Max Count</label>
          <input
            type="number"
            className="form-control"
            value={room.maxcount}
            onChange={(e) => setRoom({ ...room, maxcount: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={room.description}
            onChange={(e) => setRoom({ ...room, description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={room.phonenumber}
            onChange={(e) => setRoom({ ...room, phonenumber: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            className="form-control"
            value={room.type}
            onChange={(e) => setRoom({ ...room, type: e.target.value })}
          >
            <option value="">Select Type</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            className="form-control"
            value={room.imageurls[0] || ""}
            onChange={(e) => setRoom({ ...room, imageurls: [e.target.value] })}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Room
        </button>
      </form>
    </div>
  );
}

export default AddRoom;
