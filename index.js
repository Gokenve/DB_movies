const express = require('express');
const moviesRouter = require('./routes/movie.routes.js');
const connect = require('./utils/db/connect.js');
const cors = require('cors');
const createError = require('./utils/errors/create-error.js');

connect();

const PORT = 3000;
const server = express();

server.use(cors());

//? To parse POST/PUt bodies wicht came as JSON.
server.use(express.json());

//? To parse POST/PUt bodies wicht came as string or array.
server.use(express.urlencoded({ extended: false }));

server.use('/movies', moviesRouter);

//? Errors handlers.

server.use('*', (req, res, next) => {
    next(createError('Esta ruta no existe', 404));
});
server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
});


server.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`);
});