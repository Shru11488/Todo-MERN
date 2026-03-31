import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./utils/connectDB.js"
import AuthRouter from "./Routes/auth.routes.js"
import TaskRouter from "./Routes/task.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", AuthRouter)
app.use("/api/task", TaskRouter)

const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`Server is running at port ${port}`)
    connectDB()
})