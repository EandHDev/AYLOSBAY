import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

function AdminRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/rooms/getallrooms`);
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, roomId) => {
    const file = e.target.files[0];
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          await axios.post(`${BACKEND_URL}/api/upload/uploadimage/${roomId}`, {
            image: reader.result,
          });

          alert("Image uploaded successfully!");
          fetchRooms(); // Refresh rooms list
        } catch (error) {
          console.error("Upload error:", error);
          alert("Upload failed");
        }
        setUploading(false);
      };
    } catch (error) {
      console.error("File reading error:", error);
      setUploading(false);
      alert("Error reading file");
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Manage Room Images</h1>
      {rooms.map((room) => (
        <div key={room._id} className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{room.name}</h5>
            <div className="row">
              <div className="col-md-6">
                <input
                  type="file"
                  className="form-control mb-3"
                  onChange={(e) => handleImageUpload(e, room._id)}
                  disabled={uploading}
                  accept="image/*"
                />
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-wrap gap-2">
                  {room.imageurls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Room ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      className="rounded"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminRoom;
