const mongoose = require("mongoose");

// Make sure database name is explicitly set to 'aylosbay'
const mongoURL =
  "mongodb+srv://nigel:kinky69@cluster0.fwox6.mongodb.net/aylosbay/?retryWrites=true&w=majority&appName=Cluster0";

// Add database name in connection options
mongoose.connect(mongoURL, {
  dbName: "aylosbay", // Explicitly set database name
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
