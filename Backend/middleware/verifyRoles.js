const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("Request roles:", req.roles);
    if (!req?.roles) {
      console.log("No roles attached to request");
      return res.sendStatus(401);
    }

    const userRoles = req.roles;
    console.log("User roles from token:", userRoles);
    console.log("Allowed roles for route:", allowedRoles);

    const result = userRoles.some(role => allowedRoles.includes(role));

    if (!result) {
      console.log("Role verification failed");
      return res.sendStatus(403);
    }

    next();
  };
};

module.exports = verifyRoles;
