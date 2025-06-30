const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rooms",
      required: true,
    }, // Reference to Room model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    }, // Reference to User model
    roomId: { type: String, required: true },
    roomName: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    rentPerDay: { type: Number, required: true },
    transactionId: { type: String, required: true }, // Add this for the Paystack transaction reference
    status: { type: String, required: true, default: "booked" }, // Add a status field
    reference: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const booking = mongoose.model("bookings", bookingSchema); // Use 'bookings' as collection name
module.exports = booking;
