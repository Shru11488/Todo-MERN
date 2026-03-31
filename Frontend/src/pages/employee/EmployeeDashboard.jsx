import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import API from "../../api/axios"
import toast from "react-hot-toast"

const STATUSES = ["all", "pending", "in-progress", "completed"]

const STATUS_COLORS = {
    pending: "status-pending",
    "in-progress": "status-inprogress",
    completed: "status-completed",
}

const STATUS_LABELS = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
}

const EmployeeDashboard = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("all")
    const [updating, setUpdating] = useState(null)

    const fetchTasks = async () => {
        try {
            const { data } = await API.get("/task/myTask")
            setTasks(data)
        } catch {
            toast.error("Failed to load tasks")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchTasks() }, [])

    const updateStatus = async (taskId, status) => {
        setUpdating(taskId + status)
        try {
            const { data } = await API.put(`/task/status/${taskId}`, { status })
            setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)))
            toast.success(`Status updated to "${STATUS_LABELS[status]}"`)
        } catch (err) {
            toast.error(err?.response?.data?.message || "Update failed")
        } finally {
            setUpdating(null)
        }
    }

    const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter)

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
                        <h1 className="dashboard-title">My Tasks</h1>
                        <p className="dashboard-subtitle">Track and update your assigned tasks</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="stats-row">
                    <div className="stat-card stat-total">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total</span>
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

                {/* Filter Bar */}
                <div className="filter-bar">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            className={`filter-btn ${filter === s ? "filter-btn-active" : ""}`}
                            onClick={() => setFilter(s)}
                        >
                            {s === "all" ? "All Tasks" : STATUS_LABELS[s]}
                            <span className="filter-count">
                                {s === "all" ? tasks.length : tasks.filter((t) => t.status === s).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Task Cards */}
                {loading ? (
                    <div className="loader-overlay-inner"><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🎉</span>
                        <p>{filter === "all" ? "No tasks assigned to you yet." : `No ${STATUS_LABELS[filter]} tasks.`}</p>
                    </div>
                ) : (
                    <div className="task-cards-grid">
                        {filtered.map((task) => (
                            <div key={task._id} className={`task-card task-card-${task.status.replace("-", "")}`}>
                                <div className="task-card-header">
                                    <h3 className="task-card-title">{task.title}</h3>
                                    <span className={`status-badge ${STATUS_COLORS[task.status]}`}>
                                        {STATUS_LABELS[task.status]}
                                    </span>
                                </div>
                                <p className="task-card-desc">{task.description}</p>
                                <div className="task-card-date">
                                    📅 {new Date(task.createdAt).toLocaleDateString("en-IN", {
                                        day: "2-digit", month: "short", year: "numeric"
                                    })}
                                </div>
                                <div className="status-toggle-group">
                                    {["pending", "in-progress", "completed"].map((s) => (
                                        <button
                                            key={s}
                                            className={`toggle-btn toggle-${s.replace("-", "")} ${task.status === s ? "toggle-active" : ""}`}
                                            onClick={() => task.status !== s && updateStatus(task._id, s)}
                                            disabled={task.status === s || updating === task._id + s}
                                        >
                                            {updating === task._id + s ? (
                                                <span className="btn-spinner-sm" />
                                            ) : (
                                                STATUS_LABELS[s]
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmployeeDashboard
