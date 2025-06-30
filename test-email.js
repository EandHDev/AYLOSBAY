require("dotenv").config();
const { sendBookingConfirmation } = require("./services/emailService");

const testEmail = async () => {
  try {
    console.log("🧪 Testing email service...");
    console.log(
      "📧 SendGrid API Key:",
      process.env.SENDGRID_API_KEY
        ? `Set (${process.env.SENDGRID_API_KEY.substring(0, 10)}...)`
        : "❌ Missing"
    );

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
      email: "nigel@ianaitch.com", // ⚠️ REPLACE WITH YOUR ACTUAL EMAIL WHERE YOU WANT TO RECEIVE THE TEST
    };

    console.log("📤 Sending test email to:", testUserDetails.email);

    const result = await sendBookingConfirmation(
      testBookingDetails,
      testUserDetails
    );

    if (result.success) {
      console.log("✅ SUCCESS! Email sent successfully");
      console.log(
        "📬 Check your inbox (and spam folder) for the confirmation email"
      );
    } else {
      console.log("❌ FAILED! Email not sent");
      console.log("Error:", result.message);
    }
  } catch (error) {
    console.error("❌ Email test error:", error.message);

    if (error.code === 403) {
      console.log(
        "\n🔧 SOLUTION: Your sender email is not verified in SendGrid"
      );
      console.log(
        "1. Go to SendGrid Dashboard → Settings → Sender Authentication"
      );
      console.log('2. Click "Verify a Single Sender"');
      console.log("3. Enter your email and verify it");
      console.log("4. Update emailService.js with your verified email");
    }
  }
};

console.log("🚀 Starting email test...\n");
testEmail();
