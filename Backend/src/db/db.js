const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection with MONGODB is successfull");
  } catch (err) {
    console.log("Error while connecting to mongoDB", err);
  }
};

module.exports = connectDB;
