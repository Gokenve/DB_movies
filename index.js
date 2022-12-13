//? Executing dependency to protect the environment Variables.
require("dotenv").config();

//? Importing dependencies,functions and DB's url into de index.js.
//* I will use passport to authenticate.
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require('path');

const createError = require("./utils/errors/create-error.js");
const usersRouter = require("./routes/users.routes.js");
const moviesRouter = require("./routes/movie.routes.js");
const cinemasRouter = require("./routes/cinema.routes.js");
const connect = require("./utils/db/connect.js");

const DB_URL = require ('./utils/db/urlMongoDB');

//? Connecting to the DB.
connect();

const PORT = process.env.PORT || 4000;

//? Initialazing server and cors.
const server = express();
server.use(cors());

//? Parseing POST/PUt bodies that came as JSON.
server.use(express.json());

//? Parseing POST/PUt bodies that came as string or array.
server.use(express.urlencoded({ extended: false }));

//? Createing route for static files. Images in this case.
server.use(express.static(path.join(__dirname, 'public')));

//? Executing passport function. Creation of sessions handler and keeping them into DB. Initialazing passport and sessions handler.
require("./utils/authentication/passport.js");
server.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1800000 },
    store: MongoStore.create({
      mongoUrl: DB_URL,
    }),
  })
);
server.use(passport.initialize());
server.use(passport.session());

//? Initialazing routers users, movies and cinemas.
server.use("/user", usersRouter);
server.use("/movies", moviesRouter);
server.use("/cinemas", cinemasRouter);

//? Errors handlers.
server.use("*", (req, res, next) => {
  next(createError("Esta ruta no existe", 404));
});
server.use((err, req, res, next) => {
  return res.status(err.status || 500).json(err.message || "Unexpected error");
});

//? Server listening.
server.listen(PORT, () => {
  console.log(`El servidor está escuchando en http://localhost:${PORT}`);
});
