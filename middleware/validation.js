const validatePassword = (req, res, next) => {
    const { password } = req.body.dataForm;

    if (!password || password.trim().length < 6) {
        console.log("Пароль должен содержать минимум 6 символов");
        return res.render("registerForm", {
            title: "Register",
            validationError: { field: 'password', message: 'Пароль должен содержать минимум 6 символов' },
            formData: req.body.dataForm
        });
    }

    next();
};

module.exports = validatePassword;