const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../Modal/userModal");
const jwt = require("jsonwebtoken");

const authCheck = require("../middleware/authCheck")

const router = express.Router();

const checkTheUser = async (username) => {

    const data = await User.findOne({ username });
    if (data) {
        return true;
    } else {
        return false;
    }
}

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: "Please enter all the required fields." })
    }
    try {
        let userExist = await checkTheUser(username);
        if (userExist) {
            res.status(400).send({ error: "This username already exists, try using any other username." });
        } else {
            const salt = bcrypt.genSaltSync(parseFloat(process.env.SALT));
            const passwordHash = bcrypt.hashSync(password, salt);

            let userData = await User.create({ username, password: passwordHash });
            res.status(200).send({ ...userData._doc, password: undefined });
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: error.message });
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ error: "Please enter all the required fields." })
    }
    try {
        let usernamePresent = await User.findOne({ username });
        console.log(usernamePresent._id)
        if (!usernamePresent) {
            res.status(400).send({ error: "This username already exists, try using any other username." });
        } else {
            const isPasswordMatched = bcrypt.compareSync(password, usernamePresent.password);

            if (!isPasswordMatched) {
                res.status(400).send({ error: "Incorrect password." });
            } else {
                const payload = { id: usernamePresent._id }
                const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
                const user = { ...usernamePresent._doc, password: undefined };
                res.status(200).send({ token, user });
            }
        }
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get("/check", authCheck, async (req, res) => {
    return res.status(200).send({ ...req.user._doc });
});

module.exports = router;

