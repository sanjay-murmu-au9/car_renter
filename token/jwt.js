const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' })
    }

    const token = authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ messge: 'Token expired! Please login again' })
    }
}

module.exports = authMiddleware