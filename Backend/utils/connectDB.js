import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB Connected Successfully!!!!!")
    } catch (error) {
        console.log("Error while connecting the DB", error.message)
    }
}