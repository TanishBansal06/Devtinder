const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://tanishbansal:M0AmoifjIOJo7OSe@cluster0.xveitvp.mongodb.net/devTinder");
    console.log("MongoDB connected Successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;



