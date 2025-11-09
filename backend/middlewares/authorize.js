module.exports.authorize = (allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({ error : "Forbidden. You don't have permission to access this resource." });
        }
        next();
    }
}