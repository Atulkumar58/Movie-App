import dns from "node:dns";
dns.setServers(["8.8.8.8"], ["1.1.1.1"])

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB...`, process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Successfully connected to MongoDB 👍`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
