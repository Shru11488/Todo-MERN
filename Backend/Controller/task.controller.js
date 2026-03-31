import { Task } from "../Models/task.model.js"


export const createTask = async(req,res)=>{
    try{

        const {title,description,assignedTo} = req.body

        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy:req.user._id,
        })

        res.status(201).json(task)

    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getAllTasks = async(req,res)=>{
    try{

        const tasks = await Task.find()
        .populate("assignedTo","fullname email")

        res.json(tasks)

    }catch(error){
        console.log("Error in GetAll task controller")
        res.status(500).json({error:error.message})
    }
}
export const getMyTask = async(req,res)=>{
    try{

        const tasks = await Task.find({assignedTo: req.user._id})

        res.json(tasks)

    }catch(error){
        console.log("Error in GetMy task controller")
        res.status(500).json({error:error.message})
    }
}

export const deleteTask = async(req, res)=>{
    try {
        const {id} = req.params

        await Task.findByIdAndDelete(id)

        return res.status(200).json({message: "Task Deleted"})

    } catch (error) {
        console.log("Error in deleteTask task controller")
        res.status(500).json({error:error.message})
    }
}


export const updateTaskStatus = async(req,res)=>{
 try{

  const {status} = req.body

  const task = await Task.findOne({
   _id:req.params.id,
   assignedTo:req.user._id
  })

  if(!task){
   return res.status(404).json({
    message:"Task not found or not assigned to you"
   })
  }

  task.status = status

  await task.save()

  res.json(task)

 }catch(error){
  res.status(500).json({error:error.message})
 }
}