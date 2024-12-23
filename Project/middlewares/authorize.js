module.exports = function checkAccess(...permittedRoles) {
    return (req, res, next) => {
      if (!req.session.account) {
        return res.redirect("/login"); // Redirect to login if not authenticated
      }
  
      const { userRole } = req.session.account; // Access the user's role
  
      if (!permittedRoles.includes(userRole)) {
        return res.status(403).send("Access Denied: You don't have the required permissions.");
      }
      next();
    };
};
