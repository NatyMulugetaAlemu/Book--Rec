import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import dns from "node:dns/promises"
// import job from "./lib/cron.js";
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const app = express();
const PORT = process.env.PORT || 3000;

// job.start();
app.use(express.json());
app.use(cors())
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});











