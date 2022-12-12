//? Importing dependencies and functions into de index.js.
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');

const createError = require('./utils/errors/create-error.js');
const usersRouter = require('./routes/users.routes.js');
const moviesRouter = require('./routes/movie.routes.js');
const cinemasRouter = require('./routes/cinema.routes.js');
const connect = require('./utils/db/connect.js');

//? Connecting to the DB.
connect();

const PORT = 3000;

//? Initialazing server and cors.
const server = express();

server.use(cors());

//? Parseing POST/PUt bodies that came as JSON.
server.use(express.json());

//? Parseing POST/PUt bodies that came as string or array.
server.use(express.urlencoded({ extended: false }));

//? Initialazing passport function, creation of sessions handler and executeing passport and sessions handler.
require('./utils/authentication/passport.js');
server.use(session({
    secret: '73@mad#LP',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000}
}));
server.use(passport.initialize());
server.use(passport.session());

//? Initialazing routers users, movies and cinemas.
server.use('/user', usersRouter);
server.use('/movies', moviesRouter);
server.use('/cinemas', cinemasRouter);

//? Errors handlers.
server.use('*', (req, res, next) => {
    next(createError('Esta ruta no existe', 404));
});
server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
});

//? Server listening.
server.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`);
});

