const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const Room = require("../models/rooms");

// Upload image and add to room
router.post("/uploadimage/:roomid", async (req, res) => {
  try {
    const { image } = req.body;
    const roomId = req.params.roomid;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "aylosbay_rooms",
    });

    // Add image URL to room
    const room = await Room.findById(roomId);
    room.imageurls.push(result.secure_url);
    await room.save();

    res.json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
