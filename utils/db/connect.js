//? Importing dependency and DB's url into de file connect.js.
const mongoose = require('mongoose');
const DB_URL = require ('./urlMongoDB');

//? Connectint with Mongo DB.
const connect = () => {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports = connect;