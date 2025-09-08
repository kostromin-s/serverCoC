import express from "express";
import schedule from "node-schedule";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Server auto_01 is running!");
});

(async () => {
  await connectDB();
  // Import cron job sau khi DB đã kết nối
  await import("./controllers/cronJob.js");

  app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server auto_01 started.");
  });
})();
