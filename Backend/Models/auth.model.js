import mongoose from "mongoose";


const AuthSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["admin", "employee"],
        default: "user"
    }
    
},{timestamps: true})

export const User = mongoose.model("User", AuthSchema)
