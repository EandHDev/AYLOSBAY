const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const axios = require("axios");
const { sendBookingConfirmation } = require("../services/emailService"); // Import email service

// Generate booking reference function
const generateBookingReference = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `HTL-${year}-${randomNum}`;
};

// Initialize payment route (unchanged)
router.post("/initialize-payment", async (req, res) => {
  const { amount, email, bookingDetails } = req.body;

  try {
    const reference = new Date().getTime().toString();
    const callbackUrl = `${
      process.env.BACKEND_URL || "http://localhost:5001"
    }/api/paystack/verify-payment/${reference}`;

    console.log("Backend: Initializing payment with reference:", reference);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: amount,
        email: email,
        reference: reference,
        callback_url: callbackUrl,
        metadata: {
          bookingDetails: JSON.stringify(bookingDetails),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status) {
      res.json({
        status: true,
        data: {
          authorization_url: response.data.data.authorization_url,
          access_code: response.data.data.access_code,
          reference: response.data.data.reference,
        },
      });
    } else {
      res
        .status(400)
        .json({ status: false, message: "Payment initialization failed" });
    }
  } catch (error) {
    console.error("Backend: Payment initialization error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
});

// Updated verify payment route with email functionality
router.get("/verify-payment/:reference", async (req, res) => {
  const { reference } = req.params;
  console.log("Backend: Verifying payment for reference:", reference);

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Backend: Paystack verification response:", response.data);

    if (response.data.status && response.data.data.status === "success") {
      console.log("Backend: Payment verification successful!");

      // Parse booking details from metadata
      let bookingDetails;
      try {
        bookingDetails = JSON.parse(response.data.data.metadata.bookingDetails);
        console.log("Backend: Parsed booking details:", bookingDetails);
      } catch (parseError) {
        console.error("Backend: Error parsing booking details:", parseError);
        return res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/booking-failure?error=metadata_parse`
        );
      }

      // Generate unique booking reference
      const bookingReference = generateBookingReference();

      // Create new booking with both reference fields and individual fields
      const newBooking = new Booking({
        // Reference fields (for relationships)
        room: bookingDetails.roomId,
        user: bookingDetails.userId,
        // Individual fields (for direct access)
        roomId: bookingDetails.roomId,
        roomName: bookingDetails.roomName,
        userId: bookingDetails.userId,
        userName: bookingDetails.userName,
        fromDate: bookingDetails.fromDate,
        toDate: bookingDetails.toDate,
        totalAmount: response.data.data.amount / 100,
        totalDays: bookingDetails.totalDays || 1,
        rentPerDay: bookingDetails.rentPerDay,
        transactionId: response.data.data.reference,
        reference: bookingReference, // Add booking reference
        status: "booked",
      });

      try {
        await newBooking.save();
        console.log("Backend: Booking saved successfully!", newBooking._id);

        // 🎯 SEND CONFIRMATION EMAIL
        console.log("Backend: Sending booking confirmation email...");

        // Prepare email data
        const emailBookingDetails = {
          reference: bookingReference,
          roomName: bookingDetails.roomName,
          fromDate: bookingDetails.fromDate,
          toDate: bookingDetails.toDate,
          totalDays: bookingDetails.totalDays,
          totalAmount: response.data.data.amount / 100,
          transactionId: response.data.data.reference,
        };

        const emailUserDetails = {
          name: bookingDetails.userName,
          email: response.data.data.customer.email,
        };

        // Send the email
        const emailResult = await sendBookingConfirmation(
          emailBookingDetails,
          emailUserDetails
        );

        if (emailResult.success) {
          console.log(
            "Backend: ✅ Booking confirmation email sent successfully"
          );
        } else {
          console.error(
            "Backend: ❌ Failed to send booking confirmation email:",
            emailResult.message
          );
          // Don't fail the booking if email fails, just log it
        }

        // Redirect to success page with booking reference
        res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/booking-success?reference=${reference}&bookingRef=${bookingReference}`
        );
      } catch (saveError) {
        console.error("Backend: Error saving booking:", saveError);
        res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/booking-failure?reference=${reference}&error=booking_save`
        );
      }
    } else {
      console.log("Backend: Payment verification failed:", response.data.data);
      res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/booking-failure?reference=${reference}&status=failed`
      );
    }
  } catch (error) {
    console.error("Backend: Payment verification error:", error);
    res.redirect(
      `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/booking-failure?reference=${reference}&error=server`
    );
  }
});

// Add these admin routes to your paystackRoute.js file

// Get all bookings (for admin)
router.get("/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .sort({ createdAt: -1 }) // Newest first
      .limit(50); // Limit for performance

    console.log("Admin: Fetched", bookings.length, "bookings");

    res.json({
      success: true,
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Admin: Error fetching bookings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel a booking (makes room available again)
router.put("/admin/bookings/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        cancelReason: reason || "Cancelled by admin",
        cancelledAt: new Date(),
      },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    console.log("Admin: Cancelled booking", id, "for room", booking.roomName);

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Admin: Error cancelling booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a booking completely (makes room available again)
router.delete("/admin/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    console.log("Admin: Deleted booking", id, "for room", booking.roomName);

    res.json({
      success: true,
      message: "Booking deleted successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Admin: Error deleting booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get bookings for specific dates (to see conflicts)
router.post("/admin/bookings/conflicts", async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    const conflictingBookings = await Booking.find({
      status: "booked",
      $or: [
        { fromDate: { $gte: fromDate, $lt: toDate } },
        { toDate: { $gt: fromDate, $lte: toDate } },
        { fromDate: { $lte: fromDate }, toDate: { $gte: toDate } },
      ],
    });

    res.json({
      success: true,
      data: conflictingBookings,
      count: conflictingBookings.length,
    });
  } catch (error) {
    console.error("Admin: Error checking conflicts:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
module.exports = router;
