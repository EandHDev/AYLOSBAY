// routes/paystackRoute.js
const express = require("express");
const router = express.Router();
const Paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY); // Initialize Paystack

router.post("/initialize-payment", async (req, res) => {
  const { amount, email, reference, bookingDetails } = req.body;
  const callbackUrl = `http://localhost:5001/api/paystack/verify-payment`; // Define it here
  console.log(
    "Backend: Initializing Paystack payment for reference:",
    reference,
    "with callback_url:",
    callbackUrl
  ); // ADD THIS LOG
  try {
    const response = await Paystack.transaction.initialize({
      amount: amount * 100,
      email: email,
      reference: reference,
      metadata: {
        bookingDetails: bookingDetails,
      },
      callback_url: callbackUrl, // Use the defined variable
    });
    console.log("Backend: Paystack initialization response:", response); // ADD THIS LOG
    // ...
  } catch (error) {
    console.error("Paystack initialization error:", error);
    // ...
  }
});

// Route to verify payment after redirect (Paystack calls this)
router.get("/verify-payment/:reference", async (req, res) => {
  const { reference } = req.params;
  console.log("Backend: /verify-payment route hit for reference:", reference); // ADD THIS LOG
  try {
    const response = await Paystack.transaction.verify(reference);
    console.log(
      "Backend: Paystack verification response status:",
      response.status,
      "data status:",
      response.data.status
    ); // ADD THIS LOG

    if (response.status && response.data.status === "success") {
      console.log(
        "Backend: Paystack verification successful. Attempting to save booking..."
      ); // ADD THIS LOG
      // --- YOUR BOOKING SAVE LOGIC GOES HERE ---
      // This is the most important part now: saving the booking to your DB.
      // If you don't have this, the booking won't be saved.
      // Example:
      /*
            const Booking = require('../models/bookingModel'); // Assuming you have a Booking model
            const newBooking = new Booking({
                // ... populate booking details from response.data.metadata.bookingDetails
                transactionId: response.data.reference,
                status: 'booked'
            });
            await newBooking.save();
            console.log('Backend: Booking saved successfully!');
            */
      // --- END BOOKING SAVE LOGIC ---

      res.redirect(
        `http://localhost:3000/booking-success?reference=${reference}&status=success`
      );
    } else {
      console.log("Backend: Paystack verification failed or not successful."); // ADD THIS LOG
      res.redirect(
        `http://localhost:3000/booking-failure?reference=${reference}&status=failed`
      );
    }
  } catch (error) {
    console.error("Backend: Paystack verification error:", error); // ADD THIS LOG
    res.redirect(
      `http://localhost:3000/booking-failure?reference=${reference}&status=error`
    );
  }
});

module.exports = router;
