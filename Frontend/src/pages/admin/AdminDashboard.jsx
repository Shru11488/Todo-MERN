import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import API from "../../api/axios"
import toast from "react-hot-toast"

const STATUS_COLORS = {
    pending: "status-pending",
    "in-progress": "status-inprogress",
    completed: "status-completed",
}

const EMPTY_FORM = { title: "", description: "", assignedTo: "" }

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState(null)
    const [form, setForm] = useState(EMPTY_FORM)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const fetchTasks = async () => {
        try {
            const { data } = await API.get("/task/all")
            setTasks(data)
        } catch {
            toast.error("Failed to load tasks")
        }
    }

    const fetchEmployees = async () => {
        try {
            const { data } = await API.get("/auth/employees")
            setEmployees(data)
        } catch {
            toast.error("Failed to load employees")
        }
    }

    useEffect(() => {
        Promise.all([fetchTasks(), fetchEmployees()]).finally(() => setLoading(false))
    }, [])

    const openCreate = () => {
        setEditingTask(null)
        setForm(EMPTY_FORM)
        setModalOpen(true)
    }

    const openEdit = (task) => {
        setEditingTask(task)
        setForm({
            title: task.title,
            description: task.description,
            assignedTo: task.assignedTo?._id || task.assignedTo,
        })
        setModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            if (editingTask) {
                const { data } = await API.put(`/task/update/${editingTask._id}`, form)
                setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)))
                toast.success("Task updated!")
            } else {
                const { data } = await API.post("/task/create", form)
                await fetchTasks()
                toast.success("Task created!")
            }
            setModalOpen(false)
        } catch (err) {
            toast.error(err?.response?.data?.message || "Operation failed")
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await API.delete(`/task/${id}`)
            setTasks((prev) => prev.filter((t) => t._id !== id))
            toast.success("Task deleted")
            setDeleteConfirm(null)
        } catch {
            toast.error("Delete failed")
        }
    }

    const stats = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "pending").length,
        inProgress: tasks.filter((t) => t.status === "in-progress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
    }

    return (
        <div className="dashboard">
            <Navbar />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Admin Dashboard</h1>
                        <p className="dashboard-subtitle">Manage and assign tasks to your team</p>
                    </div>
                    <button className="btn-primary" onClick={openCreate}>
                        <span>+</span> New Task
                    </button>
                </div>

                {/* Stats Row */}
                <div className="stats-row">
                    <div className="stat-card stat-total">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total Tasks</span>
                    </div>
                    <div className="stat-card stat-pending">
                        <span className="stat-number">{stats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-card stat-inprogress">
                        <span className="stat-number">{stats.inProgress}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                    <div className="stat-card stat-completed">
                        <span className="stat-number">{stats.completed}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>

                {/* Tasks Table */}
                {loading ? (
                    <div className="loader-overlay-inner"><div className="spinner" /></div>
                ) : tasks.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        <p>No tasks yet. Create your first task!</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="tasks-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Assigned To</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task._id}>
                                        <td className="task-title-cell">{task.title}</td>
                                        <td className="task-desc-cell">{task.description}</td>
                                        <td>
                                            <div className="assigned-cell">
                                                <span className="mini-avatar">
                                                    {task.assignedTo?.fullname?.charAt(0).toUpperCase()}
                                                </span>
                                                <span>{task.assignedTo?.fullname}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${STATUS_COLORS[task.status]}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(task.createdAt).toLocaleDateString("en-IN", {
                                                day: "2-digit", month: "short", year: "numeric"
                                            })}
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn-icon btn-edit" onClick={() => openEdit(task)} title="Edit">
                                                    ✏️
                                                </button>
                                                <button className="btn-icon btn-delete" onClick={() => setDeleteConfirm(task._id)} title="Delete">
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    placeholder="Task title"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Task description"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    required
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Assign To</label>
                                <select
                                    value={form.assignedTo}
                                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                                    required
                                >
                                    <option value="">Select an employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.fullname} ({emp.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? <span className="btn-spinner" /> : editingTask ? "Update Task" : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Delete Task</h2>
                            <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
                        </div>
                        <p className="modal-confirm-text">Are you sure you want to delete this task? This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
