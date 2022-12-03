//! Hay que mirar como es el documeto de películas para poder hacer las búsquedas adecuadas en los endpoints.Ver que nombre tiene el archivo con los "personajes"(películas)

//? Importation of dependencies and functions into movi.routes file.

const express = require("express");
const Movie = require("../models/Movie.js");
const createError = require("../utils/errors/create-error.js");

const moviesRouter = express.Router();

//? Creation of endpoint to get all movies from DB.

moviesRouter.get("/", async (req, res) => {
  try {
        const movies = await Movie.find();
        return res.status(200).json(movies); 
  } catch (err) {
        return next(err);
  }
});

//? Creation of endpoint to get movies by id from DB.

moviesRouter.get("/:", async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movie.findById(id);
    if (movie) {
      return res.status(200).json(movie); 
    } else {
      next(createError(`No existe una película con el id ${id} en nuestra base de datos.`, 404));
    }
  } catch (err) {
    return next(err);
  }
});

//? Creation of endpoint to get movie by title from DB.

moviesRouter.get("/title", async (req, res) => {
  const title = req.query.title;
  try {
    if (!title) {
      return next(createError(`No existe una película con el titulo ${title} en nuestra base de datos.`, 404 ));
    }
    const searchedMovie = await Movie.find({
       title: { $in: [title]
       }});
    return res.status(200).json(searchedMovie);
  } catch (err) {
      return next(err);
  }
});

//? Creation of endpoint to get movie by genere from DB.

moviesRouter.get("/genre", async (req, res) => {
  const genre = req.query.genre;
  try {
    if (!genre) {
      return next(createError('No existen películas con ese genero en nuesta Base de datos.', 404 ));
    }
    const genredMovies = await Movie.find({
       genre: { $in: [genre]
       }});
    return res.status(200).json(genredMovies);
  } catch (err) {
      return next(err);
  }
});

//? Creation of endpoint to get movies premier from year "2010" (any year) from DB.



module.exports = moviesRouter;
