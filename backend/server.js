import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import clanRoutes from "./routes/clanRoute.js";

dotenv.config();

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.use("/api/clan", clanRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server running on port http://localhost:${process.env.PORT || 5000}`
  );
});
