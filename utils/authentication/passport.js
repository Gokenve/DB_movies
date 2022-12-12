const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const createError = require("../errors/create-error.js");
const User = require("../../models/Users.js");

//? Creation of register's Strategy
passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const previousUser = await User.findOne({ email });
        if (previousUser) {
          return done(
            createError(
              `El usuario ${previousUser.email} ya está registrado. Inicie sesión.`
            )
          );
        }
        const encPasword = await bcrypt.hash(password, 10);
        const newUser = new User({
          email,
          password: encPasword,
        });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//? Creation of login's Strategy
passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
          return done(
            createError(`El  usuario con el email ${email} no existe un nuestra base de datos. Regístrese.`)); 
        }
        const isValidPassword = await bcrypt.compare(
          password,
          currentUser.password
        );
        if (!isValidPassword) {
          return done(createError(`La contraseña es incorrecta`));
        }
        currentUser.password = null;
        return done(null, currentUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//? Registering user by id in the DB.
passport.serializeUser((user, done) => {
  return done(null, user._id);
});

//? Searching user by id in the DB.
passport.deserializeUser(async (userId, done) => {
  try {
    const existingUser = await User.findById(userId);
    return done(null, existingUser);
  } catch (err) {
    return done(err);
  }
});
