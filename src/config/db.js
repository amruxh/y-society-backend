const mongoose = require("mongoose");
const MONGO_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/y-society";
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Failed to connect to MongoDB : ", error);
  }
};
module.exports = connectDB;
