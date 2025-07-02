const usersDB = {
  users: require("../models/users.json"),
  setUsers : function(data) {this.users = data}
};

const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log("Login attempt:", username, password);

    if (!username || !password)
        return res.status(400).json({ message: "Username and password required" });

    const foundUser = usersDB.users.find(user => user.username === username);
    console.log("Found user:", foundUser);

    if (!foundUser) {
        console.log("User not found");
        return res.sendStatus(401);
    }

    const match = password === foundUser.password;
    console.log("Password match:", match);

    if (match) {
        const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '120s' }
        );

        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        );

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        res.json({ accessToken });
    } else {
        console.log("Password mismatch");
        res.sendStatus(401);
    }
};


module.exports ={handleLogin}