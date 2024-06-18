import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

export const connectDB = async ()=>{
    try {
        // const mongoUri = `${process.env.MONGODB_URI}/Youtube/`;
        // console.log(mongoUri);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        // console.log(`${connectionInstance}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host} \n`);
        
    }
    catch(error){
        console.log(process.env.MONGODB_URI);
        console.log(`${DB_Name}`);
        console.log(`MONGODB connection Failed: ${error}`);
        console.log(`MONGODB connection Failed: ${error.message}`);
        // throw error;
        process.exit(1);    // 1 means exit with error // 0 means exit without error // -1 means exit with exception
    }
}

export default connectDB;
