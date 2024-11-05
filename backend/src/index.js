import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./DB/index.js";

dotenv.config({
    path : './env',
})

const app = express();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true,
}))

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is listening on port : ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed : ", error);
})

app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended : true, limit : "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./Routes/user.routes.js"
import blogRouter from "./Routes/blog.routes.js"
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blog", blogRouter);