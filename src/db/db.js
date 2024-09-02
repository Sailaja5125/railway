// connects the backend with database
import mongoose from "mongoose";
const DB_NAME = "railway"

const connectdb = async()=>{
    try{
    const response = await mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`) // connect database
    console.log(`MongoDB connected: ${response.connection.host}`);

    }
    catch(err){
     console.log("MONGO DB",err);  
     
    }
 }

 export default connectdb