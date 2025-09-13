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

// Ping server every 5 minutes to keep it awake
function pingauto1() {
  try {
    fetch("https://servercoc-fypm.onrender.com/");
    console.log("Pinged server auto_01 to keep it awake.");

    fetch("https://servercoc-be-display.onrender.com/");
    console.log("Pinged server display to keep it awake.");
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
