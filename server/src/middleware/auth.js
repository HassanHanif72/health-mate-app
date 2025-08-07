const jwt = require("jsonwebtoken");
const { User } = require("../models/user");


const authMiddleware = async (req, res, next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            throw new Error("Login Required");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id } = decoded;
        const user = await User.findById(id);
        if(!user){
            throw new Error("Unauthorized");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });  
    }
}
module.exports = {
    authMiddleware
}