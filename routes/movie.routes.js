//? Importation of dependency and functions into movi.routes file.
const express = require("express");
//const { find } = require("../models/Movies.js");
const Movie = require("../models/Movies.js");
const createError = require("../utils/errors/create-error.js");

//? initializing movies router.
const moviesRouter = express.Router();

//? Creation of endpoint to get all movies from the DB.
moviesRouter.get("/", async (req, res, next) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json(movies);
  } catch (err) {
    return next(err);
  }
});

//? Creation of endpoint to get movie by title from the DB.
moviesRouter.get("/title/:title", async (req, res, next) => {
  const title = req.params.title;
  try {
    const searchedMovie = await Movie.findOne({ title }, { __v: 0 });

    if (searchedMovie === null) {
      return next(
        createError(
          `No existe una película con el titulo ${title} en nuestra base de datos.`,
          404
        )
      );
    }
    return res.status(200).json(searchedMovie);
  } catch (err) {
    return next(err);
  }
});

//? Creation of endpoint to get movie by genere from the DB.
moviesRouter.get("/genre/:genre", async (req, res, next) => {
  const genre = req.params.genre;
  try {
    const genredMovie = await Movie.findOne({ genre }, { __v: 0 });
    if (genredMovie === null) {
      return next(
        createError(
          `No existen películas con el genero ${genre} en nuesta Base de datos.`,
          404
        )
      );
    }
    return res.status(200).json(genredMovie);
  } catch (err) {
    return next(err);
  }
});

//? Creation of endpoint to get movies premier from any year from the DB.
moviesRouter.get("/year/:year", async (req, res, next) => {
  const year = req.params.year;
  const moviesFromYear = await Movie.find(
    { year: { $gte: year } },
    { __v: 0 }
  ).sort({ year: 1 });

  //*Varibles to hand errors when years don't exist in DB.
  let yearsMovies = await Movie.find().sort({ year: -1 });
  const oldestMovie = yearsMovies[0];
  const youngestMovie = yearsMovies[yearsMovies.length - 1];

  try {
    if (year > oldestMovie.year || year < youngestMovie.year) {
      return next(
        createError(
          `No existen películas estrenadas en el año ${year} en nuesta Base de datos.`,
          404
        )
      );
    }

    return res.status(200).json(moviesFromYear);
  } catch (err) {
    return next(err);
  }
});

//? Creation of endpoint to get movies by id from the DB.
moviesRouter.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const movie = await Movie.findById(id, { __v: 0 });

    if (movie === null) {
      return next(
        createError(
          `La película con el id ${id} no existe en nuestra base de datos.`,
          404
        )
      );
    }
    return res.status(200).json(movie);
  } catch (err) {
    return next(
      createError(
        `La película con el id ${id} no existe en nuestra base de datos.`,
        404
      )
    );
  }
});

//? Creation of endpoint to post movies in the DB.
moviesRouter.post("/create_movie", async (req, res, next) => {
  const newMovie = new Movie(...req.body);
  const titleNewMovie = newMovie.title;
  const createdMovie = await Movie.findOne({ title: titleNewMovie });

  try {
    if (createdMovie === null) {
      const newCreatedMovie = await newMovie.save();
      return res.status(201).json(newCreatedMovie);
    } else if (newMovie.title === createdMovie.title)
      return next(
        createError("Esa película ya existe en nuestra base de datos", 200)
      );
  } catch (err) {
    next(err);
  }
});

//? Creation of endpoint to put movies in the DB by id.
moviesRouter.put("/actualizar/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    //const createdMovie = await Movie.findById(id);
    //console.log(createdMovie);
    const modifiedMovie = new Movie(...req.body);
    modifiedMovie._id = id;
    console.log(id, modifiedMovie._id);
    const movieUpdated = await Movie.findByIdAndUpdate(
      id,
      { $set: { ...modifiedMovie } },
      { new: true }
    );
    const createdMovies = await Movie.findById(id);
    console.log(createdMovies);
    if (createdMovies) {
      res.status(200).json(movieUpdated);
    }
    return next(
      createError(
        `La película que intenta actualizar con el id ${id}, no se encuentra en la base de datos.`,
        404
      )
    );
  } catch (err) {
    return err;
  }
});

//? Creation of endpoint to delete movies in the DB by id.
moviesRouter.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return next(
        createError(
          `La película con el id ${id} no está en nuestra base de datos.`
        )
      );
    }
    return res
      .status(200)
      .json(
        `La película ${deletedMovie.title} con la id ${deletedMovie._id} ha sido eliminada correctamente`
      );
  } catch (err) {
    next(err);
  }
});

module.exports = moviesRouter;
