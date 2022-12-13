//? Middleware to upload static files
const multer = require('multer');
const path = require('path');
const createError = require('../errors/create-error');

//? Setting images extensions allowed and filtering them.
const VALID_FILE_TYPES = ['image/jpg', 'image/png', 'image/jpeg'];
const fileFilter = (req, file, cb) =>{
  if (!VALID_FILE_TYPES.includes(file.mimetype)) {
    cb(createError(`Esa extensión de archivo no está permitido. Las extensiones permitidas son: jpg, png y jpeg.`));
  } else {
    cb(null, true)
  }
};

//? Creating files store by date and name.
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'))
  }
});

//? Creating middleware to export.
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;