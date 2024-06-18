// require('dotenv').config(path : '../.env');
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_Name } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config(
    {
        // path : '../.env'
    }
);


connectDB()
.then(() => {
    app.on("error", (error)=>{
        console.log(`Error: ${error}`);
        console.log(`Error: ${error.message}`);
        throw error;
    })

    app.listen(process.env.port || 8000 , () => {
        console.log(`Server is running on port ${process.env.port || 8000}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB Connection Failed !!! ",err);
})



/*

import express from "express";
const app = express();

// const connectDB(){
// }
// connectDB();

(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_Name}`)
        app.on("error", (error)=>{
            console.log(`Error: ${error}`);
            // console.log(`Error: ${error.message}`);
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })
    }
    catch(error){
        console.log(`Error: ${error}`);
        // console.log(`Error: ${error.message}`);
        throw error;
    }
})()

*/
