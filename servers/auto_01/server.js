import express from "express";
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

const url0 = process.env.URL_PING;
const url1 = process.env.URL_PING_1;
const url2 = process.env.URL_PING_2;
if (!url0) console.warn("Warning: URL_PING is not defined in .env");
if (!url1) console.warn("Warning: URL_PING_1 is not defined in .env");
if (!url2) console.warn("Warning: URL_PING_2 is not defined in .env");

// Ping server every 5 minutes to keep it awake
function pingauto1() {
  try {
    fetch(url2);
    console.log("Pinged server auto_01 to keep it awake.");

    fetch(url1);
    console.log("Pinged server display to keep it awake.");

    fetch(url0);
    console.log("Pinged server g317 to keep it awake.");
  } catch (error) {
    console.error("Error pinging server:", error);
  }
}

setInterval(pingauto1, 5 * 60 * 1000);

(async () => {
  await connectDB();
  // Import cron job sau khi DB đã kết nối
  await import("./controllers/cronJob.js");
  await import("./controllers/dataDisplay.js");

  app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server auto_01 started.");
  });
})();

//listen on port
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
