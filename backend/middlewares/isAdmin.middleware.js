//middle ware for check the user is admin
const isAdmin = (req, res, next) => {
  // Check if user is attached to request (set by verifyToken middleware)
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user info" });
  }

  // Check if user is admin
  if (req.user.role && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: Admins only" });
};

export { isAdmin };
