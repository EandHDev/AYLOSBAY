// Simple rooms route (routes/roomsRoute.js)
const express = require("express");
const router = express.Router();
const Booking = require("../models/booking"); // We'll need this for availability checking

// Static room data - matches your existing rooms
const rooms = [
  {
    _id: "685c35e7eeb51f8883221a48",
    name: "Waterfront Room #101",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9458_ethoiz.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9460_j0cetm.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9380_rcqq2c.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1750686902/35ZpCXt_rd7xyj.jpg",
    ],
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: "9989649278",
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room, or your private balcony or patio. Located near the main lodge amenities, you are never far from dining, entertainment, meeting, and gathering spaces.",
    __v: 0,
  },
  {
    _id: "685c3624eeb51f8883221a49",
    name: "Waterfront Room #102",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9460_j0cetm.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9458_ethoiz.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9380_rcqq2c.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1750686902/35ZpCXt_rd7xyj.jpg",
    ],
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: "9989649278",
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room, or your private balcony or patio. Located near the main lodge amenities, you are never far from dining, entertainment, meeting, and gathering spaces.",
    __v: 0,
  },
  {
    _id: "685c3633eeb51f8883221a4a",
    name: "Waterfront Room #103",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9458_ethoiz.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9460_j0cetm.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956585/IMG_9380_rcqq2c.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1750686902/35ZpCXt_rd7xyj.jpg",
    ],
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: "9989649278",
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room, or your private balcony or patio. Located near the main lodge amenities, you are never far from dining, entertainment, meeting, and gathering spaces.",
    __v: 0,
  },
  {
    _id: "685c364aeeb51f8883221a4b",
    name: "Garden Room #201",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956587/IMG_9440_m6qn5m.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956586/IMG_9441_v4xiwm.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956586/IMG_9442_muo38d.jpg",
    ],
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: "9989649478",
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort. Carefully curated artwork by Ayigbe carpenters adorns the walls to create a calming, residential setting. In addition to two queen beds with crisp cotton bedding, features include a mini-refrigerator and an LCD flat-screen TV.",
    __v: 0,
  },
  {
    _id: "685c3653eeb51f8883221a4c",
    name: "Garden Room #202",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956587/IMG_9440_m6qn5m.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956586/IMG_9441_v4xiwm.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956586/IMG_9442_muo38d.jpg",
    ],
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: "9989649478",
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort. Carefully curated artwork by Ayigbe carpenters adorns the walls to create a calming, residential setting. In addition to two queen beds with crisp cotton bedding, features include a mini-refrigerator and an LCD flat-screen TV.",
    __v: 0,
  },
  {
    _id: "685c365beeb51f8883221a4d",
    name: "Garden Room #203",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956587/IMG_9440_m6qn5m.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956586/IMG_9441_v4xiwm.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956586/IMG_9442_muo38d.jpg",
    ],
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: "9989649478",
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort. Carefully curated artwork by Ayigbe carpenters adorns the walls to create a calming, residential setting. In addition to two queen beds with crisp cotton bedding, features include a mini-refrigerator and an LCD flat-screen TV.",
    __v: 0,
  },
];

// Get all rooms endpoint
router.get("/getallrooms", async (req, res) => {
  try {
    console.log("API: Fetching all rooms...");
    console.log("API: Found rooms:", rooms.length);

    res.json(rooms);
  } catch (error) {
    console.error("API: Error fetching rooms:", error);
    res.status(500).json({ message: error.message });
  }
});

// Check room availability for specific dates
router.post("/check-availability", async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    console.log(
      "API: Checking room availability for dates:",
      fromDate,
      "to",
      toDate
    );

    // Validate dates
    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: "Both fromDate and toDate are required",
      });
    }

    // Ensure toDate is after fromDate
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Find bookings that conflict with requested dates
    const conflictingBookings = await Booking.find({
      status: "booked", // Only consider confirmed bookings
      $or: [
        // Booking starts during requested period
        {
          fromDate: { $gte: fromDate, $lt: toDate },
        },
        // Booking ends during requested period
        {
          toDate: { $gt: fromDate, $lte: toDate },
        },
        // Booking completely encompasses requested period
        {
          fromDate: { $lte: fromDate },
          toDate: { $gte: toDate },
        },
      ],
    });

    console.log("API: Found conflicting bookings:", conflictingBookings.length);

    // Get list of booked room IDs for the requested dates
    const bookedRoomIds = conflictingBookings.map((booking) => booking.roomId);
    console.log("API: Booked room IDs:", bookedRoomIds);

    // Add availability status to each room
    const roomsWithAvailability = rooms.map((room) => ({
      ...room,
      isAvailable: !bookedRoomIds.includes(room._id),
      totalDays: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)),
      totalAmount:
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) *
        room.rentperday,
    }));

    const availableRooms = roomsWithAvailability.filter(
      (room) => room.isAvailable
    );

    console.log(
      "API: Available rooms:",
      availableRooms.length,
      "out of",
      rooms.length
    );

    res.json({
      success: true,
      data: {
        rooms: roomsWithAvailability,
        availableCount: availableRooms.length,
        totalCount: rooms.length,
        requestedDates: { fromDate, toDate },
      },
    });
  } catch (error) {
    console.error("API: Error checking room availability:", error);
    res.status(500).json({
      success: false,
      message: "Error checking room availability",
      error: error.message,
    });
  }
});

module.exports = router;
