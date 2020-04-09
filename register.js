const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, validateUser } = require("../model/users");
const { loggedin } = require("../middlewares/access");



router.get("/", loggedin, (req, res) => {
    res.render("register", { error: "" });
})

router.post("/", loggedin, async (req, res, next) => {
    const { error } = validateUser(req.body);
    if (error) {

        const err = new Error(error.details[0].message);
        res.render("register", { error: err.message })

    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        res.status(400).render("register", { error: "User already has an account." })
    }

    user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    req.session.userId = user._id;

    res.redirect("/dailyjournal/posts");
})


module.exports = router;