require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const testSimpleEmail = async () => {
  try {
    // Debug API key
    const apiKey = process.env.SENDGRID_API_KEY;
    console.log("🔑 API Key exists:", !!apiKey);
    console.log("🔑 API Key starts with SG.:", apiKey?.startsWith("SG."));
    console.log("🔑 API Key length:", apiKey?.length);

    const msg = {
      to: "nigel@ianaitch.com", // Your email
      from: "info@anaitch.com", // ✅ Your verified email from SendGrid
      subject: "SendGrid Test - Hotel Booking System",
      text: "This is a test email from your hotel booking system!",
      html: "<p>This is a test email from your hotel booking system!</p><p>If you received this, SendGrid is working! ✅</p>",
    };

    console.log("🧪 Sending simple test email...");
    console.log("📧 From:", msg.from);
    console.log("📧 To:", msg.to);

    await sgMail.send(msg);
    console.log("✅ SUCCESS! Simple email sent - check your inbox!");
  } catch (error) {
    console.error("❌ Simple email failed:", error.message);
    console.error("❌ Error code:", error.code);

    if (error.response && error.response.body) {
      console.error(
        "❌ SendGrid error details:",
        JSON.stringify(error.response.body, null, 2)
      );
    }
  }
};

console.log("🚀 Testing SendGrid with verified sender...");
testSimpleEmail();
