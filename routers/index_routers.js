const express = require("express");
const router = express.Router();

const register = require("../controllers/register");
const entries = require("../controllers/entries");
const login = require("../controllers/login");

router.get("/", entries.list);
router.post("/post", entries.submit);
router.get("/post", entries.form);

router.post("/post/delete/:id", entries.delete);
router.get("/post/update/:id", entries.updateForm);
router.post("/post/update/:id", entries.updateSubmit);


router.get("/login", login.form);
router.post("/login", login.submit);

router.get("/logout", login.logout);

router.get("/register", register.form);
router.post("/register", register.submit);

module.exports = router;