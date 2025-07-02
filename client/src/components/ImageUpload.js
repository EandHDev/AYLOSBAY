import React, { useState } from "react";
import axios from "axios";

function ImageUpload({ onUploadSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload/uploadimage`,
          {
            image: reader.result,
          }
        );
        onUploadSuccess(response.data.url);
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed");
      }
      setLoading(false);
    };
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        disabled={loading}
      />
      {loading && <p>Uploading...</p>}
    </div>
  );
}

export default ImageUpload;
