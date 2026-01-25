import mongoose from "mongoose";

const connectDB = async function(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongo DB connected successfully");
    }catch(err)
    {
        console.log("error connecting DataBase: ", err?.message)
    }
}

export default connectDB;