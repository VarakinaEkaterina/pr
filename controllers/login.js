const User = require("../models/user");

exports.form = (req, res) => {
    res.render("loginForm", {
        title: "Login",
        validationError: null,
    });
};

exports.submit = (req, res, next) => {
    User.authenticate(req.body.loginForm, (err, data) => {
        if (err) return next(err);
        if (!data) {
            console.log("имя или пароль неверный");
            return res.render("loginForm", {
                title: "login",
                validationError: { field: 'password', message: 'Неверный логин или пароль' },
                formData: req.body.loginForm
            });
            // res.redirect("back");
        } else {
            req.session.userEmail = data.email;
            req.session.userName = data.name;
            res.redirect("/");
        }
    });
};

exports.logout = function(req, res) {
    req.session.destroy((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
};