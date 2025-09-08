import schedule from "node-schedule";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";

(async () => {
  await connectDB();
  // Import cron job sau khi DB đã kết nối
  await import("./controllers/cronJob.js");

  console.log("🚀 Server auto_01 started.");
})();
