require("dotenv").config(); // This should be at the very top

console.log(
  "Server.js: process.env.STRIPE_SECRET_KEY (after dotenv.config()):",
  process.env.STRIPE_SECRET_KEY
);

const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require("./db");
const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/userRoute");
const paystackRoute = require("./routes/paystackRoute");
const { router: authRouter, verifyAdminToken } = require("./routes/auth");

// FIXED: Corrected your Amplify domain URL and improved CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://main.d2e1ko68ec6usk.amplifyapp.com", // FIXED: Corrected from d2efko68ec6usk
      "https://d2e1ko68ec6usk.amplifyapp.com", // Added without subdomain as backup
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200
  })
);

// FIXED: Simplified manual CORS headers (removed conflicting configuration)
app.use((req, res, next) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parser middleware
app.use(express.json());

// Health check routes
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Aylos Bay Hotel Booking API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// REMOVED: The custom proxy endpoint (no longer needed with proper CORS)

// Your existing API routes
app.use("/api/rooms", require("./routes/roomsRoute"));
app.use("/api/users", usersRoute);
app.use("/api/paystack", paystackRoute);
app.use("/api/auth", authRouter);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
