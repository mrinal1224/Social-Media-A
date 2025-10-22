import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbUrl = process.env.dbUrl || "mongodb://localhost:27017/social-media";
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("Please make sure MongoDB is running on your system");
    process.exit(1);
  }
};

export default connectDB;
