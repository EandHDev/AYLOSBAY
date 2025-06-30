const express = require("express");
const router = express.Router();
const Booking = require("../models/booking"); // Import your Booking model
const axios = require("axios"); // Use axios instead of paystack-api library

// Initialize payment route
router.post("/initialize-payment", async (req, res) => {
  const { amount, email, bookingDetails } = req.body;

  try {
    const reference = new Date().getTime().toString();

    // Create callback URL - MUST be your deployed backend URL for production
    const callbackUrl = `${
      process.env.BACKEND_URL || "http://localhost:5001"
    }/api/paystack/verify-payment/${reference}`;

    console.log("Backend: Initializing payment with reference:", reference);
    console.log("Backend: Callback URL:", callbackUrl);
    console.log("Backend: Amount:", amount, "Email:", email);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: amount, // Amount in pesewas
        email: email,
        reference: reference,
        callback_url: callbackUrl,
        metadata: {
          bookingDetails: JSON.stringify(bookingDetails), // Stringify here
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Backend: Paystack initialization response:", response.data);

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
      console.error("Backend: Payment initialization failed:", response.data);
      res
        .status(400)
        .json({ status: false, message: "Payment initialization failed" });
    }
  } catch (error) {
    console.error("Backend: Payment initialization error:", error);
    res.status(500).json({ status: false, message: error.message });
  }
});

// Verify payment route
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

      // Create new booking with both reference fields and individual fields for your schema
      const newBooking = new Booking({
        // Reference fields (required by your schema)
        room: bookingDetails.roomId,
        user: bookingDetails.userId,
        // Individual fields (also required by your schema)
        roomId: bookingDetails.roomId,
        roomName: bookingDetails.roomName,
        userId: bookingDetails.userId,
        userName: bookingDetails.userName,
        fromDate: bookingDetails.fromDate,
        toDate: bookingDetails.toDate,
        totalAmount: response.data.data.amount / 100, // Convert from pesewas to GHS
        totalDays: bookingDetails.totalDays || 1,
        rentPerDay: bookingDetails.rentPerDay,
        transactionId: response.data.data.reference,
        status: "booked",
      });

      try {
        await newBooking.save();
        console.log("Backend: Booking saved successfully!", newBooking._id);

        // Redirect to success page
        res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/booking-success?reference=${reference}&bookingId=${newBooking._id}`
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
      console.log(
        "Backend: Payment verification failed or not successful:",
        response.data.data
      );
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

module.exports = router;
