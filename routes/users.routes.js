//? Importation of dependencies to create sessions in users routes.
const express = require("express");
const passport = require("passport");

//? initializing users router.
const userRouter = express.Router();

//? Creating endpoint to register users in collection users into the DB.
userRouter.post("/register", (req, res, next) => {
  const done = (err, user) => {
    if (err) {
      return next(err);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json(user);
    });
  };
  passport.authenticate("register", done)(req);
});

//? Creating endpoint to login users in collection sessions into the DB.
userRouter.post("/login", (req, res, next) => {
  const done = (err, user) => {
    if (err) {
      return next(err);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json(user);
    });
  };
  passport.authenticate("login", done)(req);
});

//? Creating endpoint to logout users in collection sessions in the DB.
userRouter.post('/logout', (req, res, next) => {
  if (req.user) {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        return res.status(200).json('Hasta pronto!!');
    });
    });
  } else {
    //* Not sending message because whith error 304 it's not able to do it.
    return res.status(304).json();
  }
});

module.exports = userRouter;
