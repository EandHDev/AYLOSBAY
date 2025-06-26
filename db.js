const mongoose = require("mongoose");
// Make sure dotenv is configured here if db.js is loaded before server.js's dotenv.config()
// Or ensure server.js's dotenv.config() runs before db.js is required.
// For safety, you can add it here too, but it's usually done once in the main app entry.
require("dotenv").config(); // <-- ADD THIS LINE TO ENSURE .env IS LOADED

// Get the MongoDB URL from environment variables
const mongoURL = process.env.MONGO_URL; // <-- CHANGE THIS LINE

console.log("DB.js: Attempting to connect with MONGO_URL:", mongoURL); // <-- ADD THIS LINE FOR DEBUGGING

// Add database name in connection options (optional if already in URI)
mongoose.connect(mongoURL, {
  // dbName: "aylosbay", // This might be redundant if the database name is already in the mongoURL
  useNewUrlParser: true, // Add these options back for modern Mongoose
  useUnifiedTopology: true, // Add these options back for modern Mongoose
});

const connection = mongoose.connection;

connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

connection.on("connected", () => {
  console.log(
    "MongoDB connected successfully to database:",
    connection.db.databaseName
  );
});

module.exports = mongoose;
