import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import http from "http";

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to the Simplify Backend API");
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running  on port ${process.env.PORT || 5000}`);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});
