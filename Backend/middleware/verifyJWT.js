const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    console.log("Authorization Header received:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Missing or malformed Authorization header");
        return res.sendStatus(401); // Unauthorized
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log("JWT verification failed:", err.message);
                return res.sendStatus(403); // Forbidden
            }

            console.log("Decoded JWT payload:", decoded);

            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;

            next();
        }
    );
};

module.exports = verifyJWT;
