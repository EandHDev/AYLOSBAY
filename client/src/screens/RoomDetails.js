// src/screens/RoomDetails.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function RoomDetails() {
  const { roomid } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/rooms/${roomid}`
        );
        setRoom(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomid]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!room) return <div>Room not found</div>;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">{room.name}</h2>
          <div className="row">
            <div className="col-md-6">
              <img
                src={room.imageurls[0]}
                alt={room.name}
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-6">
              <h4>Details</h4>
              <p>
                <strong>Type:</strong> {room.type}
              </p>
              <p>
                <strong>Max Guests:</strong> {room.maxcount}
              </p>
              <p>
                <strong>Price:</strong> ${room.rentperday}/night
              </p>
              <p>
                <strong>Description:</strong> {room.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
