import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import router from "./routes/user.routes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use("/api", router);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
      console.log("DB connection established");
    });
  })
  .catch((err) => console.log("Error connecting to Mongodb", err));
