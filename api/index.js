import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error(err);
  });

const app = express();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});