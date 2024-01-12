const express = require("express");
const favicon = require("express-favicon");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");

const app = express();
const myRoutes = require("./routers/index_routers");
const userSession = require("./middleware/user_session");

const port = "3000";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "css")));
app.use(express.static(path.join(__dirname, "views")));

app.use(
    session({
        secret: "aboba",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(
    "/css/bootstrap.css",
    express.static(
        path.join(__dirname, "public/css/bootstrap-5.3.2/dist/css/bootstrap.css")
    )
);

app.use(favicon(__dirname + "/public/favicon.ico"));

app.use(userSession);
app.use(myRoutes);

// app.get("env") == "production";
// if (app.get("env") == "production") {
//   app.use((req, res, err) => {
//     res.status(err.status);
//     res.sendFile(err.message);
//   });
// }

//error handler

app.use(function(req, res, next) {
    const err = new Error("NO FOUND ERROR");
    err.code = 404;
    next(err);
});

if (app.get("env") != "development") {
    app.use(function(err, req, res, next) {
        err.status = 404;
        res.render("error");
    });
} else {
    app.use(function(err, req, res, next) {
        console.log(app.get("env"), err.code, err.message);
    });
}

app.listen(port, function() {
    console.log("Сервер запущен. Порт: " + port);
});