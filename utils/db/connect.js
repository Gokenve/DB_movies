const mongoose = require('mongoose');

const DB_URL = "mongodb+srv://root:nUH69ghJtacKMnmp@bd-movies.0y5sh78.mongodb.net/?retryWrites=true&w=majority";

const connect = () => {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports = connect;