import jwt from "jsonwebtoken"
import { User } from "../Models/auth.model.js"


export const ProtectedRoute = async(req, res, next)=>{
    try {

        const token = req.cookies.JWT
        if(!token){
            return res.status(400).json({message: "Invalid Token"})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decode){
            return res.status(400).json({message: "No User Found!!!"})
        }

        const user = await User.findById(decode.userID).select("-password")
        req.user = user

        next()

    } catch (error) {
        console.log("Error in ProtectedRoute", error.message)
    }
}

export const isAdmin = async(req, res, next) => {
    if(req.user.role !== "admin"){
        return res.status(403).json({message: "Admin only access!!!"})
    }
    next()
}

export const isEmployee = async(req, res, next) => {
    if(req.user.role !== "employee"){
        return res.status(403).json({message: "Employee only access!!!"})
    }
    next()
}