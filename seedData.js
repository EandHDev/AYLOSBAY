const mongoose = require("mongoose");
const Room = require("./models/rooms");

console.log("Starting seed script...");

const roomsData = [
  {
    name: "Waterfront Room #101",
    imageurls: [
      "https://freeimage.host/i/35ZpBII",
      "https://freeimage.host/i/35ZpfmN",
      "https://freeimage.host/i/35ZpKep",
      "https://freeimage.host/i/35ZpCXt",
    ],
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: 9989649276,
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room, or your private balcony or patio. Located near the main lodge amenities, you are never far from dining, entertainment, meeting, and gathering spaces.",
  },
  {
    name: "Waterfront Room #102",
    imageurls: [
      "https://freeimage.host/i/35ZpBII",
      "https://freeimage.host/i/35ZpfmN",
      "https://freeimage.host/i/35ZpKep",
      "https://freeimage.host/i/35ZpCXt",
    ],
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: 9989649277,
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room, or your private balcony or patio. Located near the main lodge amenities, you are never far from dining, entertainment, meeting, and gathering spaces.",
  },
  {
    name: "Waterfront Room #103",
    imageurls: [
      "https://freeimage.host/i/35ZpBII",
      "https://freeimage.host/i/35ZpfmN",
      "https://freeimage.host/i/35ZpKep",
      "https://freeimage.host/i/35ZpCXt",
    ],
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: 9989649278,
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room, or your private balcony or patio. Located near the main lodge amenities, you are never far from dining, entertainment, meeting, and gathering spaces.",
  },
  {
    name: "Garden Room #201",
    imageurls: [
      "https://freeimage.host/i/35Zy4cb",
      "https://freeimage.host/i/35ZyrKu",
      "https://freeimage.host/i/35ZySV9",
    ],
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: 9989649278,
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort. Carefully curated artwork by Ayigbe carpenters adorns the walls to create a calming, residential setting. In addition to two queen beds with crisp cotton bedding, features include a mini-refrigerator and an LCD flat-screen TV.",
  },
  {
    name: "Garden Room #202",
    imageurls: [
      "https://freeimage.host/i/35Zy4cb",
      "https://freeimage.host/i/35ZyrKu",
      "https://freeimage.host/i/35ZySV9",
    ],
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: 9989649378,
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort. Carefully curated artwork by Ayigbe carpenters adorns the walls to create a calming, residential setting. In addition to two queen beds with crisp cotton bedding, features include a mini-refrigerator and an LCD flat-screen TV.",
  },
  {
    name: "Garden Room #203",
    imageurls: [
      "https://freeimage.host/i/35Zy4cb",
      "https://freeimage.host/i/35ZyrKu",
      "https://freeimage.host/i/35ZySV9",
    ],
    rentperday: 300,
    type: "Garden",
    maxcount: 2,
    phonenumber: 9989649478,
    currentbookings: [],
    description:
      "Each and every tasteful furnishing is designed to offer you truly serene comfort. Carefully curated artwork by Ayigbe carpenters adorns the walls to create a calming, residential setting. In addition to two queen beds with crisp cotton bedding, features include a mini-refrigerator and an LCD flat-screen TV.",
  },
];

console.log(`Attempting to seed ${roomsData.length} rooms...`);

mongoose
  .connect(
    "mongodb+srv://nigel:24we50me@cluster0.fwox6.mongodb.net/Aylos?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(async () => {
    console.log("MongoDB connected successfully");

    try {
      await Room.deleteMany({});
      console.log("Existing rooms deleted");

      const result = await Room.insertMany(roomsData);
      console.log(`${result.length} rooms added successfully`);

      await mongoose.disconnect();
      console.log("Database connection closed");
    } catch (error) {
      console.error("Error seeding data:", error);
      await mongoose.disconnect();
    }
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
    process.exit(1);
  });
