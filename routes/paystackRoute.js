// routes/paystackRoute.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/booking"); // Import your Booking model
const Paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);

router.post("/initialize-payment", async (req, res) => {
  const { amount, email, bookingDetails } = req.body;

  try {
    // Generate a unique transaction reference (important for Paystack)
    const reference = new Date().getTime().toString(); // Or use uuid library

    // Construct the callback URL dynamically, including the reference
    const callbackUrl = `http://localhost:5001/api/paystack/verify-payment/${reference}`; // <--- Make sure this is correct

    console.log(
      "Backend: Initializing Paystack payment for reference:",
      reference,
      "with callback_url:",
      callbackUrl
    );

    const response = await Paystack.transaction.initialize({
      // ... other parameters
      callback_url: callbackUrl, // Use the dynamically generated URL
    });

    // ... rest of the route code ...
  } catch (error) {
    // ... error handling ...
  }
});

// Route to verify payment after redirect (Paystack calls this)
router.get("/verify-payment/:reference", async (req, res) => {
  const { reference } = req.params;
  console.log("Backend: /verify-payment route hit for reference:", reference);
  try {
    const response = await Paystack.transaction.verify(reference);
    console.log("Backend: Paystack verification response:", response);

    if (response.status && response.data.status === "success") {
      console.log(
        "Backend: Paystack verification successful. Attempting to save booking..."
      );

      const bookingDetails = JSON.parse(response.data.metadata.bookingDetails);

      const newBooking = new Booking({
        room: bookingDetails.roomId,
        user: bookingDetails.userId,
        // ... map other fields ...
        transactionId: response.data.reference,
        status: "booked",
      });

      try {
        await newBooking.save();
        console.log("Backend: Booking saved successfully!");
        res.redirect(
          `http://localhost:3000/booking-success?reference=${reference}&status=success`
        );
      } catch (saveError) {
        console.error("Backend: Error saving booking:", saveError);
        res.redirect(
          `http://localhost:3000/booking-failure?reference=${reference}&status=error`
        );
        return;
      }
    } else {
      console.log("Backend: Paystack verification failed or not successful.");
      res.redirect(
        `http://localhost:3000/booking-failure?reference=${reference}&status=failed`
      );
    }
  } catch (error) {
    console.error("Backend: Paystack verification error:", error);
    res.redirect(
      `http://localhost:3000/booking-failure?reference=${reference}&status=error`
    );
  }
});

module.exports = router;
