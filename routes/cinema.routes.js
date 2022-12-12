const express = require("express");
const Cinema = require("../models/Cinemas.js");
const createError = require("../utils/errors/create-error.js");
const Movie = require('../models/Movies');
const cinemasRouter = express.Router();

//? Creation of endpoint to get all cinemas from the DB.
cinemasRouter.get("/", async (req, res, next) => {
  try {
    const cinemas = await Cinema.find({}, { __v: 0 }).populate('movies');
    console.log(cinemas);
    return res.status(200).json(cinemas);
  } catch (err) {
    return next(err);
  }
});

//? Creation of endpoint to find cinema by name from the DB.
cinemasRouter.get("/name/:name", async (req, res, next) => {
  const name = req.params.name;
  try {
    if (!name) {
      return next(createError(`No existe un cine con el nombre ${name} en nuestra base de datos.`, 404));
    }
    const searchedCinema = await Cinema.findOne({ name }, { __v: 0 }).populate(
      'movies',
      { __v: 0 }
    );
    return res.status(200).json(searchedCinema);
  } catch (err) {
    return next(err);
  }
});

//? Creation of endpoint to find cinema by movie from the DB.
cinemasRouter.get("/movie/:movie", async (req, res, next) => {
  try {
    const movie = req.params.movie;
    const movieChoosen = await Movie.find({title: movie});
    const cinemas = await Cinema.find({ movies:{$in:movieChoosen}}).populate('movies');
    console.log(movieChoosen);
    console.log(cinemas);
    if (movieChoosen) {
      return next(createError('El cine con esa película no se encuentra en nuestra base de datos'));
    }
    return res.status(200).json(cinemas);
  } catch (err) {
    return next(err);
  }
});

//? Creation of endpoint to find cinema by id from the DB.
cinemasRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const cinema = await Cinema.findById(id, {__v: 0}).populate('movies');
    if (cinema) {
      return res.status(200).json(cinema);
    } else {
      next(
        createError(
          `No existe un cine con el id ${id} en nuestra base de datos.`,
          404
        )
      );
    }
  } catch (err) {
    return next(err);
  }
});

//! Creation of endpoint to post cinemas in the DB.
//? Manejar error cuando crea cines ya existentes en la BD.
cinemasRouter.post('/create_cinema', async (req, res, next) => {
  try {
    
      const newCinema = new Cinema( ...req.body);
      const createdCinemas = await Cinema.find({title: {$in:cinemaToCreate}})
      if (newCinema === createdCinemas && createdCinemas) {
        return next(createError('Ese cine ya existe en nuestra base de datos', 200));
      }
      const NewCreatedCinema = await (newCinema.save()); 
      return res.status(201).json(NewCreatedCinema); 
  } catch (err) {
  next(err);
  }
});

//! Creation of endpoint to put cinemas in the DB by id.
//? Ver como se debe hacer desde postman.com
cinemasRouter.put('/actualizar/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const modifiedCinema = new Cinema({ ...req.body });
    modifiedCinema._id = id;
    const cinemaUpdated = await Cinema.findByIdAndUpdate( 
          id,
          { $set: { ...modifiedCinema }},
          { new: true }
      );
    if (!cinemaUpdated) {
      return next(createError('El cine que intenta actualizar no se encuentra en la base de datos.', 404));
    } else {
     res.status(200).json(cinemaUpdated);
    }
  }catch (err) {
      return(err);
  }
});

//? Creation of endpoint to delete cinemas in the DB by id.
cinemasRouter.delete('/delete/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedCinema = await Cinema.findByIdAndDelete(id);
    if (!deletedCinema) {
      return next(createError(`El cine con el id ${id} no está en nuestra base de datos.`))
    }
    return res.status(200).json(`El cine ${deletedCinema.name} ha sido eliminado correctamente`);
  }catch (err) {
    next(err);
  }
});

module.exports = cinemasRouter;