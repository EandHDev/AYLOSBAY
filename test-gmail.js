require("dotenv").config();
const { sendBookingConfirmation } = require("./services/emailService");

const testGmailEmail = async () => {
  try {
    console.log("🚀 Testing Gmail email service...");
    console.log(
      "📧 Gmail User:",
      process.env.GMAIL_USER ? "Set ✅" : "Missing ❌"
    );
    console.log(
      "📧 Gmail App Password:",
      process.env.GMAIL_APP_PASSWORD ? "Set ✅" : "Missing ❌"
    );

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.log("❌ Missing Gmail credentials in .env file");
      console.log("Please add:");
      console.log("GMAIL_USER=nyjlhupauty@gmail.com");
      console.log("GMAIL_APP_PASSWORD=povfdupcvvthiyml");
      return;
    }

    const testBookingDetails = {
      reference: "HTL-2025-TEST123",
      roomName: "Waterfront Room #101",
      fromDate: "2025-07-03",
      toDate: "2025-07-07",
      totalDays: 4,
      totalAmount: 2400,
      transactionId: "test_paystack_ref_123456",
    };

    const testUserDetails = {
      name: "Test User",
      email: "nigel@ianaitch.com", // Your email to receive the test
    };

    console.log("📤 Sending test booking confirmation email...");
    console.log("📧 To:", testUserDetails.email);

    const result = await sendBookingConfirmation(
      testBookingDetails,
      testUserDetails
    );

    if (result.success) {
      console.log("✅ SUCCESS! Gmail email sent successfully");
      console.log("📬 Check your inbox at", testUserDetails.email);
      console.log("📬 Also check spam folder just in case");
    } else {
      console.log("❌ FAILED! Gmail email not sent");
      console.log("Error:", result.message);
    }
  } catch (error) {
    console.error("❌ Gmail email test error:", error.message);
  }
};

console.log("🚀 Starting Gmail email test...\n");
testGmailEmail();
