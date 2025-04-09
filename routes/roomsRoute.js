const express = require("express");
const router = express.Router();
const Room = require("../models/rooms");

router.get("/getallrooms", async (req, res) => {
  try {
    console.log("API: Fetching rooms...");
    const rooms = await Room.find({});
    console.log("API: Found rooms:", rooms);
    return res.json(rooms);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Error fetching rooms",
      error: error.message,
    });
  }
});

module.exports = router;
