import express from "express";
import connectDB from "./config/connectDB.js";
import { saveAllianceData } from "./controllers/saveData.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import axios from "axios";
dotenv.config();

const app = express();

// Kết nối MongoDB
await connectDB();

// Hàm lặp lại liên tục
async function loopSaveAllianceData() {
  while (true) {
    try {
      await saveAllianceData();
      console.log("✅ saveAllianceData completed. Restarting...");
    } catch (err) {
      console.error("❌ Error in saveAllianceData:", err);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay 5 giây trước khi lặp lại
  }
}

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

function startAutoPing() {
  const url = process.env.URL_PING;
  if (!url) return;
  setInterval(async () => {
    try {
      await axios.get(url);
      console.log(`Pinged ${url} at ${new Date().toISOString()}`);
      fetch("https://servercoc-be-display.onrender.com");
      fetch("https://servercoc-fypm.onrender.com/");
      fetch("https://servercoc-g317.onrender.com");
    } catch (err) {
      console.error(`Ping failed: ${err.message}`);
    }
  }, 5 * 60 * 1000); // 5 phút
}

// Khởi động vòng lặp lưu dữ liệu
loopSaveAllianceData();
startAutoPing();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
