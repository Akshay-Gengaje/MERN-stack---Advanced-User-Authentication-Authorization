import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
dotenv.config()
const app = express();

app.use("/",(req, res, next) =>{
    res.send("Hello there!")
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
        console.log("DB connection established");
    })
}).catch(err => console.log("Error connecting to Mongodb", err));