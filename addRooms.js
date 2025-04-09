const mongoose = require("mongoose");
const Room = require("./models/rooms");

const mongoURL =
  "mongodb+srv://nigel:kinky69@cluster0.fwox6.mongodb.net/aylosbay/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURL, {
    dbName: "aylosbay",
  })
  .then(async () => {
    console.log(
      "MongoDB connected successfully to database:",
      mongoose.connection.db.databaseName
    );
    await addRooms();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const rooms = [
  {
    name: "Waterfront Room #101",
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: "9989649278",
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956994/IMG_9458_npty5m.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956995/IMG_9460_nqrm7h.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956996/IMG_9379_adyl0x.jpg",
    ],
  },
  {
    name: "Waterfront Room #102",
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: "9989649278",
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956994/IMG_9458_npty5m.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956995/IMG_9460_nqrm7h.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956996/IMG_9379_adyl0x.jpg",
    ],
  },
  {
    name: "Waterfront Room #103",
    rentperday: 600,
    type: "Waterfront",
    maxcount: 3,
    phonenumber: "9989649278",
    currentbookings: [],
    description:
      "Revel in stunning views of the Volta Lake from the comfort of your room",
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956994/IMG_9458_npty5m.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956995/IMG_9460_nqrm7h.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743956996/IMG_9379_adyl0x.jpg",
    ],
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
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957068/IMG_9440_xnsnni.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957065/IMG_9441_xhfbxp.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957066/IMG_9442_t2dqsn.jpg",
    ],
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
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957068/IMG_9440_xnsnni.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957065/IMG_9441_xhfbxp.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957066/IMG_9442_t2dqsn.jpg",
    ],
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
    imageurls: [
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957068/IMG_9440_xnsnni.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957065/IMG_9441_xhfbxp.jpg",
      "https://res.cloudinary.com/dugvudqm6/image/upload/v1743957066/IMG_9442_t2dqsn.jpg",
    ],
  },
];

async function addRooms() {
  try {
    console.log("Database name:", mongoose.connection.db.databaseName);
    console.log("Collection name:", Room.collection.collectionName);

    console.log("Clearing existing rooms...");
    await Room.deleteMany({});
    console.log("Cleared existing rooms");

    console.log("Adding new rooms...");
    const result = await Room.insertMany(rooms);
    console.log("Number of rooms added:", result.length);
    console.log("Rooms added:");
    result.forEach((room, index) => {
      console.log(`${index + 1}. ${room.name}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
}
