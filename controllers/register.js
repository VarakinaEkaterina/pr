const User = require("../models/user");
const validatePassword = require("../middleware/validation");

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

exports.form = (req, res) => {
    res.render("registerForm", {
        title: "Register",
        validationError: null,
        formData: {}
    });
};

exports.submit = (req, res, next) => {
    const { email, name, password, confirm_password, age } = req.body.dataForm;

    if (password !== confirm_password) {
        console.log("Пароли не совпадают");
        return res.render("registerForm", {
            title: "Register",
            validationError: { field: 'password', message: 'Пароли не совпадают' },
            formData: req.body.dataForm
        });
    }

    if (!validateEmail(email)) {
        console.log("Невалидный email");
        return res.render("registerForm", {
            title: "Register",
            validationError: { field: 'email', message: 'Невалидный email' },
            formData: req.body.dataForm
        });
    }

    validatePassword(req, res, () => {
        User.findByEmail(email, (err, user) => {
            if (err) return next(err);
            if (user) {
                console.log("Такой пользователь уже существует");
                return res.redirect("/");
            } else {
                User.create({ email, name, password, age }, (err) => {
                    if (err) return next(err);
                    req.session.userEmail = email;
                    req.session.userName = name;
                    return res.redirect("/");
                });
            }
        });
    });
};