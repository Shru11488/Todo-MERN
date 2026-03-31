import bcrypt from "bcryptjs"
import { User } from "../Models/auth.model.js"
import { GenerateToken } from "../utils/GenerateToken.js"

export const Register = async(req, res) => {
    try {
        const {fullname, email, password, role} = req.body

        if(!fullname || !role || !email || !password){
            return res.status(400).json("All fields are Required!!!")
        }

        const exsistingEmail = await User.findOne({email})
        if(exsistingEmail){
            return res.status(400).json("Email already exsist!!!")
        }

        const hashPass = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            fullname,
            email,
            password: hashPass,
            role
        })
        console.log("User Created Sucessfully!!!!")
        return res.status(200).json(newUser)

    } catch (error) {
        console.log("Error in Register Controller", error.message)
    }
}

export const Login = async(req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json("No User Found!!!")
        }

        const matchPass = await bcrypt.compare(password, user.password)
        if(!matchPass){
            return res.status(400).json("Invalid Credentials")
        }

        GenerateToken(user._id, res)

        const loggedInUser = await User.findById(user._id).select("-password")
        return res.status(200).json(loggedInUser)


    } catch (error) {
        console.log("Error in Login Controller", error.message)
    }
}

export const Logout = async(req, res) => {
    try {
        res.clearCookie("JWT")
        return res.status(200).json("User LoggedOut Successfully!!!!")
    } catch (error) {
        console.log("Error in Logout Controller", error.message)
    }
}

export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in getMe Controller", error.message)
    }
}

export const getEmployees = async(req, res) => {
    try {
        const employees = await User.find({role: "employee"}).select("-password")

        res.status(200).json(employees)

        
    } catch (error) {
        console.log("Error in GetEmployess Controller", error.message)
    }
}