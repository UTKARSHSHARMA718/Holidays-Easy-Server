import express from "express";// es6
import dotenv from "dotenv";// es6
import mongoose from "mongoose";// es6
import authRoute from "./routes/auth.js";
import roomRoute from "./routes/rooms.js";
import hotelRoute from "./routes/hotels.js";
import userRoute from "./routes/users.js";
import cookieparser from "cookie-parser"
import cors from "cors";
const app = express();
dotenv.config();

//connecting with the mongodb
const connect = async () =>{   
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongodb.")
    }catch(err){
        throw err;
    }
}

mongoose.connection.on("disconnection",()=>{
    console.log("mongodb disconnected");
});


//middle to send req to express server
app.use(cookieparser())
app.use(cors())
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/hotels",hotelRoute);
app.use("/api/rooms",roomRoute);
app.use("/api/users",userRoute);

//next middleware for error
app.use((err,req,res,next)=>{

    //next middleware 

    const errStatus = err.status || 500;
    const errMessage = err.message || "something went wrong";
    return res.status(errStatus).json({
        success:false,
        status:errStatus,
        message:errMessage,
        stack:err.stack,
    });
})

app.get('/',(req,res) =>{
    res.status(200).send("Hello World");
});

app.listen( process.env.PORT || 8800,()=>{
    connect();//connecting with backend
    console.log("connected to backend..");
})