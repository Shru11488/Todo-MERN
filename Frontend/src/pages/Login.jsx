import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const user = await login(form.email, form.password)
            toast.success(`Welcome back, ${user.fullname}!`)
            navigate(user.role === "admin" ? "/admin" : "/employee")
        } catch (err) {
            toast.error(err?.response?.data || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-bg" />
            <div className="auth-card">
                <div className="auth-header">
                    <span className="brand-icon-large">✦</span>
                    <h1 className="auth-title">TaskFlow</h1>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary btn-full" disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : "Sign In"}
                    </button>
                </form>
                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register" className="auth-link">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
