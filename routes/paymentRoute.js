// routes/paymentRoute.js
const express = require("express");
const router = express.Router();

console.log(
  "PaymentRoute.js: process.env.STRIPE_SECRET_KEY (before Stripe init):",
  process.env.STRIPE_SECRET_KEY
); // <-- THIS LINE MUST BE HERE

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

router.post("/process-payment", async (req, res) => {
  const { amount, id, bookingDetails } = req.body;

  try {
    // Create a charge using the payment method ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "usd",
      payment_method: id,
      confirm: true, // Confirm the payment immediately
      description: `Booking for ${bookingDetails.roomName}`,
      metadata: {
        roomId: bookingDetails.roomId,
        userId: bookingDetails.userId,
        checkIn: bookingDetails.fromDate,
        checkOut: bookingDetails.toDate,
      },
      // --- ADD THESE LINES TO RESOLVE THE ERROR ---
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never", // This tells Stripe not to expect redirects for this payment
      },
      // --- END ADDITION ---
    });

    // --- IMPORTANT: Integrate with your actual booking saving logic here ---
    // After successful payment, you should save the booking to your database.
    // This is where you would typically call your Mongoose model to create a new booking document.
    // For example:
    /*
        const Booking = require('../models/bookingModel'); // Assuming you have a Booking model
        const newBooking = new Booking({
            roomId: bookingDetails.roomId,
            userId: bookingDetails.userId,
            fromDate: bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            totalAmount: bookingDetails.totalAmount,
            totalDays: bookingDetails.totalDays,
            transactionId: paymentIntent.id, // Store Stripe's transaction ID
            status: 'booked' // Or 'paid'
        });
        await newBooking.save();
        */
    // For now, we'll just return success. Your frontend's handleBookingConfirmation will do the actual save.

    res.json({
      success: true,
      message: "Payment successful!",
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error("Stripe payment error:", error);
    // Log the full Stripe error object for better debugging
    console.error("Full Stripe error object:", JSON.stringify(error, null, 2));
    res.status(500).json({
      success: false,
      message: error.message || "Payment failed",
    });
  }
});

module.exports = router;
