//? Creating movies eschema.
const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true }, 
    director: { type: String, required: true },
    year: { type: Number, min: [1896, 'En ese año aun no se había inventado el cine'] },
    genre: { type: String, enum:[
      'Acción',
      'Animación',
      'Drama',
      'Comedia',
      'Comedia romántica',
      'Comedia romántica',
      'Comedia costumbrista',
      'Comedia apocalíptica',
      'Ciencia ficción',
      'Terror',
      'Suspense',
      'Policiaca',
      'Fantasía',
      'Aventuras',
      "Musical",
      'Infantil'
    ]},
    picture: String
  },
  {
    timestamps: true
  }
);

const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
