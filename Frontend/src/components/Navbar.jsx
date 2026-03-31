import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Logged out successfully")
            navigate("/login")
        } catch {
            toast.error("Logout failed")
        }
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="brand-icon">✦</span>
                <span className="brand-name">TaskFlow</span>
            </div>
            <div className="navbar-right">
                {user && (
                    <>
                        <div className="navbar-user">
                            <span className="user-avatar">{user.fullname?.charAt(0).toUpperCase()}</span>
                            <div className="user-info">
                                <span className="user-name">{user.fullname}</span>
                                <span className={`role-badge role-${user.role}`}>{user.role}</span>
                            </div>
                        </div>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
