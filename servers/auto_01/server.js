import express from "express";
import schedule from "node-schedule";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/connectDB.js";

const app = express();

app.use(express.json());

//port
const PORT = process.env.PORT || 3000;

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

//listen on port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
