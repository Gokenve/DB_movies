//? Creating cinemas schema.
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: { 
        type: String, 
        required: true, 
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Ese formato de email no es válido. Introduzca un email válido por favor.']},
    password: {  
        type: String, 
        required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

