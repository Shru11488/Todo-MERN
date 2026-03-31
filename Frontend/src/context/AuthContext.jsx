import { createContext, useContext, useState, useEffect } from "react"
import API from "../api/axios"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const { data } = await API.get("/auth/me")
                setUser(data)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchMe()
    }, [])

    const login = async (email, password) => {
        const { data } = await API.post("/auth/login", { email, password })
        setUser(data)
        return data
    }

    const register = async (fullname, email, password, role) => {
        const { data } = await API.post("/auth/register", { fullname, email, password, role })
        return data
    }

    const logout = async () => {
        await API.post("/auth/logout")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
