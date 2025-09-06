import express from "express";
import connectDB from "./config/connectDB.js";
import { saveAllianceData } from "./controllers/saveData.js";

const app = express();
const PORT = process.env.PORT || 3000;

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
    // Có thể thêm delay nếu muốn, ví dụ: await new Promise(r => setTimeout(r, 1000));
  }
}

// Khởi động vòng lặp lưu dữ liệu
loopSaveAllianceData();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
