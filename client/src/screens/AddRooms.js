const mongoose = require("mongoose");
const Room = require("./models/rooms");

mongoose.connect(
  "mongodb+srv://nigel:24we50me@cluster0.fwox6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);

const rooms = [
  {
    name: "Waterfront Room #103",
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: "9989649278",
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room",
    imageurls: [], // We'll add image URLs after setting up Cloudinary
  },
  {
    name: "Garden Room #201",
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: "9989649278",
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort",
    imageurls: [],
  },
  {
    name: "Garden Room #202",
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: "9989649378",
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort",
    imageurls: [],
  },
  {
    name: "Garden Room #203",
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: "9989649478",
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort",
    imageurls: [],
  },
];

async function addRooms() {
  try {
    // First, clear existing rooms
    await Room.deleteMany({});
    console.log("Cleared existing rooms");

    // Add new rooms
    const result = await Room.insertMany(rooms);
    console.log("Rooms added successfully:", result);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

addRooms();
