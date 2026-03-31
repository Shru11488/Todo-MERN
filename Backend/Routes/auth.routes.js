import express from "express"
import { getEmployees, getMe, Login, Logout, Register } from "../Controller/auth.controller.js"
import { ProtectedRoute } from "../Middleware/auth.middleware.js"

const router = express.Router()

router.post("/register", Register)
router.post("/login", Login)
router.post("/logout", Logout)
router.get("/me", ProtectedRoute,getMe)
router.get("/employees", ProtectedRoute, getEmployees)

export default router