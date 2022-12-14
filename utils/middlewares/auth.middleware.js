//? Creating authentication's middleware.
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json('Necesita iniciar sesión o registrarse si aun no lo está.');  }
}
module.exports = isAuthenticated;