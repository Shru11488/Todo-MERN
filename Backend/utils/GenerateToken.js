import jwt from "jsonwebtoken"

export const GenerateToken = async(userID, res) => {
    try {
        const token = jwt.sign({userID}, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})

        res.cookie("JWT", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        
    } catch (error) {
        console.log("Error while Generating Token!!!", error.message)
    }
}