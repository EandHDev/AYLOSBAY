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

// Add the CORS configuration here, before any routes
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://main.d2efko68ec6usk.amplifyapp.com",
      "https://cors-anywhere.herokuapp.com",
      "https://api.codetabs.com",
      "https://thingproxy.freeboard.io"
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
    optionsSuccessStatus: 200 // for legacy browser support
  })
);

app.use((req, res, next) => {
  // Allow all origins for proxy requests
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Body parser middleware
app.use(express.json());

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

// Custom proxy endpoint to handle CORS issues
app.use('/api/proxy', (req, res) => {
  // Remove /proxy from the path and forward to actual endpoint
  const targetPath = req.originalUrl.replace('/api/proxy', '/api');
  
  // Forward the request internally
  req.url = targetPath;
  
  // Continue to the actual route handlers
  if (targetPath.startsWith('/api/users')) {
    return usersRoute(req, res);
  } else if (targetPath.startsWith('/api/auth')) {
    return authRouter(req, res);
  } else if (targetPath.startsWith('/api/rooms')) {
    return roomsRoute(req, res);
  } else if (targetPath.startsWith('/api/paystack')) {
    return paystackRoute(req, res);
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

// Your existing API routes
app.use("/api/rooms", require("./routes/roomsRoute"));
app.use("/api/users", usersRoute);
app.use("/api/paystack", paystackRoute);
app.use("/api/auth", authRouter);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
