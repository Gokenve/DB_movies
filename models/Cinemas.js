//? Creating cinemas schema.
const mongoose = require("mongoose");

const cinemasSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    website: { type: String }, 
    location: { type: String, required: true},
    movies: [{ type: mongoose.Types.ObjectId, ref: 'Movie' }],
    contact: 
    {
      email: { type: String, unique: true},
      phone: { type: Number }
    }
  },
  {
    timestamps: true
  }
);

const Cinema = mongoose.model("Cinema", cinemasSchema);

module.exports = Cinema;
