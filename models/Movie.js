//Cambiar el schemma por los requeridos en el proyecto 1 de películas

const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    director: { type: String, required: true },
    year: { type: Number, min: [1896, 'En ese año aun no se había inventado el cine'] },
    genre: { type: String }

  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
