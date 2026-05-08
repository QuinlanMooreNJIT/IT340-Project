const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    console.log("------- AUTHMIDDLEWARE ------")
    
    const authHeader = req.headers.authorization;
    
    console.log("AUTH HEADER:", authHeader);
    
    if (!authHeader) {
        console.log("NO AUTH HEADER")
        return res.status(401).json({ message: "No token" });
    }
    
    const token = authHeader.split(" ")[1];
    
    console.log("TOKEN RECIEVED:", token);
    
    console.log("JWT SECRET:", process.env.JWT_SECRET);
    
    try {
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log("DECODED TOKEN:", decoded);
        
        req.user = decoded;
        
        next();
        
    } catch (err) {
        
        console.log("JWT VERIFY FAILED");
        console.error("ERROR MESSAGE:", err.message);
        
        return rest.status(401).json({
            message: "Invalid token"
        });
    }
};
