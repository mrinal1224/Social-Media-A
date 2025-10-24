import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Accept several common env var names for flexibility
    const rawUri = process.env.dbUrl || process.env.MONGODB_URL || process.env.MONGODB_URI;

    // If user provided a base cluster url and a DBNAME, append it when appropriate
    let uri = rawUri;
    if (process.env.MONGODB_URL && process.env.DBNAME) {
      // If rawUri is exactly the base MONGODB_URL (no DB name), append DBNAME
      const base = process.env.MONGODB_URL;
      if (!rawUri || rawUri === base || !rawUri.includes(process.env.DBNAME)) {
        uri = `${base}/${process.env.DBNAME}`;
      }
    }

    if (!uri) {
      throw new Error(
        "Missing DB connection string: set `dbUrl` or `MONGODB_URL` in your .env (see .env.example)"
      );
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message || error);
    console.error(
      "Please create a '.env' file in the server folder with a line like: dbUrl=mongodb://127.0.0.1:27017/socialdb"
    );
    process.exit(1);
  }
};

export default connectDB;
