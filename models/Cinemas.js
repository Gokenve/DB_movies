//? Creating cinemas schema.
const mongoose = require("mongoose");

const cinemasSchema = new mongoose.Schema(
  {
    name: { type: String, required: true}, 
    location: { type: String, required: true},
    movies: [{ type: mongoose.Types.ObjectId, ref: 'Movie' }]
  },
  {
    timestamps: true
  }
);

const Cinema = mongoose.model("Cinema", cinemasSchema);

module.exports = Cinema;
