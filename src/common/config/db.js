import mongoose from "mongoose";
import dotenv from 'dotenv'
import config from "./envConfig.js";
dotenv.config();

const database = mongoose.connect(`mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log(error);
})

export default database;