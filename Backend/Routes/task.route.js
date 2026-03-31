import express from "express"
import { isAdmin, isEmployee, ProtectedRoute } from "../Middleware/auth.middleware.js"
import { createTask, deleteTask, getAllTasks, getMyTask, updateTaskStatus } from "../Controller/task.controller.js"

const router = express.Router()

router.post("/create",ProtectedRoute, isAdmin, createTask)
router.get("/all",ProtectedRoute,isAdmin, getAllTasks)
router.delete("/:id",ProtectedRoute,isAdmin, deleteTask)

//EMPLOYEE
router.get("/myTask",ProtectedRoute, isEmployee, getMyTask)
router.put("/status/:id", ProtectedRoute, isEmployee, updateTaskStatus)

export default router