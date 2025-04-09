const express = require("express");
const app = express();
const cors = require("cors"); // Add this line at the top
const dbConfig = require("./db");
const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/userRoute");
require("dotenv").config();

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
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
