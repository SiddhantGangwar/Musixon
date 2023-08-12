import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import songRoutes from "./routes/songs.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(bodyParser.json({limit:"30mb",extended : "true"}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:"true"}));
app.use(cookieParser());
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["POST","GET","PUT"],
    credentials:true
}));
// app.use(cors());
  
app.use("/user",userRoutes);
app.use("/song",songRoutes);
app.get("/",(req,res)=>{
    res.send("APP IS RUNNING.");
});
const PORT = process.env.PORT || 5050;

mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`)))
.catch((error)=>console.log(error.message));