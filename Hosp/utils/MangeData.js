const { MongoClient } = require('mongodb');

let _db;
const mongoUrl = process.env.MONGO_URI || "mongodb+srv://ritik:8287617808@ritikyadav.9q3yt.mongodb.net/?retryWrites=true&w=majority&appName=RitikYadav";

const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,  // Ensure secure connection
    });

    console.log("✅ Connected to MongoDB");
    _db = client.db("Hosp_db");

    if (callback) callback(client);
  } catch (error) {
    console.error("❌ Error while connecting to MongoDB:", error);
  }
};

const getDB = () => {
  if (!_db) {
    throw new Error("❌ Not connected to MongoDB!");
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;