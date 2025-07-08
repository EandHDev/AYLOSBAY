require("dotenv").config();

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

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://main.d2e1ko68ec6usk.amplifyapp.com",
      "https://d2e1ko68ec6usk.amplifyapp.com"
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

// Handle preflight requests
app.options('*', cors());

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

// API routes
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/paystack", paystackRoute);
app.use("/api/auth", authRouter);

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
