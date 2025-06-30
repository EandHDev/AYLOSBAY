// Gmail Email Service using Nodemailer (services/emailService.js)
const nodemailer = require("nodemailer");

// Create Gmail transporter
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const sendBookingConfirmation = async (bookingDetails, userDetails) => {
  try {
    console.log("📧 Creating Gmail transporter...");
    const transporter = createGmailTransporter();

    console.log("📧 Preparing email for:", userDetails.email);
    console.log("📧 From Gmail account:", process.env.GMAIL_USER);

    const mailOptions = {
      from: {
        name: "Aylos Bay Hotel",
        address: process.env.GMAIL_USER,
      },
      to: userDetails.email,
      subject: `🏨 Booking Confirmation - ${bookingDetails.roomName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px; background-color: #2c5aa0; color: white; padding: 20px; border-radius: 8px;">
            <h1 style="margin: 0; font-size: 28px;">🏨 Aylos Bay Hotel</h1>
            <p style="margin: 5px 0; font-size: 16px;">Your Lakeside Retreat</p>
          </div>
          
          <!-- Confirmation Message -->
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
            <h2 style="margin-top: 0; font-size: 24px;">✅ Booking Confirmed!</h2>
            <p style="font-size: 16px; margin-bottom: 0;">Dear ${
              userDetails.name
            }, we're excited to welcome you to Aylos Bay Hotel!</p>
          </div>
          
          <!-- Booking Details -->
          <div style="background-color: white; border: 1px solid #dee2e6; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #2c5aa0; margin-top: 0; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px;">📋 Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Booking Reference:</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee; color: #2c5aa0; font-weight: bold; font-size: 16px;">${
                  bookingDetails.reference
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Room:</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 16px;">${
                  bookingDetails.roomName
                }</td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Check-in:</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">${
                  bookingDetails.fromDate
                } <strong>(3:00 PM)</strong></td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Check-out:</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">${
                  bookingDetails.toDate
                } <strong>(11:00 AM)</strong></td>
              </tr>
              <tr>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Duration:</td>
                <td style="padding: 12px 8px; border-bottom: 1px solid #eee;">${
                  bookingDetails.totalDays
                } nights</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px 8px; font-weight: bold; color: #28a745; font-size: 16px;">Total Amount Paid:</td>
                <td style="padding: 12px 8px; font-weight: bold; color: #28a745; font-size: 20px;">GHS ${
                  bookingDetails.totalAmount
                }</td>
              </tr>
            </table>
          </div>
          
          <!-- Hotel Information -->
          <div style="background-color: #e3f2fd; border: 1px solid #90caf9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #1976d2; margin-top: 0;">🏨 Hotel Information & Check-in Instructions</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 20px;">
              <div style="flex: 1; min-width: 200px;">
                <p style="margin: 8px 0;"><strong>📍 Address:</strong><br>Lake Volta, Ghana</p>
                <p style="margin: 8px 0;"><strong>📞 Phone:</strong> +233 XXX XXX XXX</p>
                <p style="margin: 8px 0;"><strong>📧 Email:</strong> info@aylosbay.com</p>
              </div>
              <div style="flex: 1; min-width: 200px;">
                <p style="margin: 8px 0;"><strong>🕒 Check-in:</strong> 3:00 PM</p>
                <p style="margin: 8px 0;"><strong>🕚 Check-out:</strong> 11:00 AM</p>
                <p style="margin: 8px 0;"><strong>🆔 Required:</strong> Valid ID for check-in</p>
              </div>
            </div>
          </div>
          
          <!-- Important Notes -->
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h4 style="color: #856404; margin-top: 0;">📝 Important Information</h4>
            <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Please bring this confirmation and a valid ID for check-in</li>
              <li>Cancellation policy: 24 hours before check-in</li>
              <li>Free Wi-Fi available throughout the hotel</li>
              <li>Complimentary breakfast included (7:00 AM - 10:00 AM)</li>
              <li>Private parking available</li>
              <li>Lakeside activities: Boat tours, fishing, swimming</li>
            </ul>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #2c5aa0;">
            <p style="color: #2c5aa0; font-size: 18px; font-weight: bold; margin-bottom: 10px;">Thank you for choosing Aylos Bay Hotel! 🌊</p>
            <p style="color: #666; font-size: 14px; margin-bottom: 5px;">We look forward to providing you with an exceptional lakeside experience.</p>
            <p style="color: #666; font-size: 14px;">Questions? Contact us at info@aylosbay.com or +233 XXX XXX XXX</p>
            
            <!-- Transaction Details -->
            <div style="margin-top: 20px; padding: 10px; background-color: #f8f9fa; border-radius: 5px; font-size: 12px; color: #666;">
              <p style="margin: 2px 0;">Transaction ID: ${
                bookingDetails.transactionId
              }</p>
              <p style="margin: 2px 0;">Booking confirmed on: ${new Date().toLocaleDateString(
                "en-GB"
              )}</p>
              <p style="margin: 2px 0;">Powered by Aylos Bay Hotel Booking System</p>
            </div>
          </div>
          
        </div>
      `,
      // Text version for email clients that don't support HTML
      text: `
        Aylos Bay Hotel - Booking Confirmation
        
        Dear ${userDetails.name},
        
        Your booking has been confirmed!
        
        Booking Details:
        - Booking Reference: ${bookingDetails.reference}
        - Room: ${bookingDetails.roomName}
        - Check-in: ${bookingDetails.fromDate} (3:00 PM)
        - Check-out: ${bookingDetails.toDate} (11:00 AM)
        - Duration: ${bookingDetails.totalDays} nights
        - Total Amount Paid: GHS ${bookingDetails.totalAmount}
        
        Hotel Information:
        Aylos Bay Hotel
        Lake Volta, Ghana
        Phone: +233 XXX XXX XXX
        Email: info@aylosbay.com
        
        Check-in Instructions:
        - Check-in time: 3:00 PM
        - Check-out time: 11:00 AM
        - Please bring a valid ID for check-in
        - Present this confirmation email at reception
        
        Important Notes:
        - Cancellation policy: 24 hours before check-in
        - Free Wi-Fi and complimentary breakfast included
        - Private parking available
        
        Thank you for choosing Aylos Bay Hotel!
        We look forward to welcoming you.
        
        Transaction ID: ${bookingDetails.transactionId}
      `,
    };

    console.log("📤 Sending email...");
    await transporter.sendMail(mailOptions);
    console.log(
      "✅ Booking confirmation email sent successfully via Gmail to:",
      userDetails.email
    );
    return { success: true, message: "Email sent successfully via Gmail" };
  } catch (error) {
    console.error(
      "❌ Error sending booking confirmation email via Gmail:",
      error
    );

    // Provide helpful error messages
    if (error.code === "EAUTH") {
      console.error(
        "❌ Gmail authentication failed. Check your GMAIL_USER and GMAIL_APP_PASSWORD in .env file"
      );
    } else if (error.code === "ESOCKET") {
      console.error(
        "❌ Network connection error. Check your internet connection"
      );
    }

    return { success: false, message: error.message };
  }
};

// Export the function
module.exports = {
  sendBookingConfirmation,
};
