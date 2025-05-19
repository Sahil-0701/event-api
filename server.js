import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); 
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import eventRouter from "./routes/eventRoute.js";
import adminRouter from "./routes/adminRoute.js";
import ticketRouter from "./routes/ticketRoute.js";

const app = express();
const port = process.env.PORT || 5000;

connectDB(); 
connectCloudinary();

app.use(express.json());
app.use(cors());

// API routes
app.use("/api/user", userRouter);
app.use("/api/event", eventRouter);
app.use("/api/admin", adminRouter);
app.use("/api/ticket", ticketRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
