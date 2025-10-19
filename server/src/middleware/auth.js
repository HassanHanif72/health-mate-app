const jwt = require("jsonwebtoken");
const { User } = require("../models/User");


const authMiddleware = async (req, res, next)=>{
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({ message: "Login required" });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err && err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.status(401).json({ message: "Invalid token" });
        }
        const { id } = decoded;
        const user = await User.findById(id);
        if(!user){
            return res.status(403).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });  
    }
}
module.exports = {
    authMiddleware
}