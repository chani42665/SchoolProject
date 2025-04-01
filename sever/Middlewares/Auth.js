const jwt = require("jsonwebtoken")

function createToken(req, res, next) {
    const { email, role } = req.body;
    const token = jwt.sign({ email,role }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })
    req.token = token
    next();
}

function verify(req, res,next) {
    try{
        const user = jwt.verify(req.headers["authorization"], process.env.JWT_SECRET_KEY)
    if(!user)
        res.status(401).json({ error: "Unauthorized" })
    req.user = user
    next()
    } catch (error) {
        res.status(401).json({ error: "Invalid token." })
    }


}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
        next();
    };
}

module.exports ={createToken,verify,authorizeRoles}

