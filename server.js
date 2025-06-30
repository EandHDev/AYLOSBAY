// server.js
require("dotenv").config(); // This should be at the very top

console.log(
  "Server.js: process.env.STRIPE_SECRET_KEY (after dotenv.config()):",
  process.env.STRIPE_SECRET_KEY
); // <-- THIS LINE MUST BE HERE

const express = require("express");
const app = express();
const cors = require("cors");
const dbConfig = require("./db"); // This will now have access to process.env.MONGO_URL
//const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/userRoute");
const paystackRoute = require("./routes/paystackRoute");

// Add the CORS configuration here, before any routes
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend domain
    credentials: true, // Allow cookies and credentials
  })
);

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/rooms", require("./routes/roomsRoute"));
app.use("/api/users", usersRoute);
app.use("/api/paystack", paystackRoute);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
