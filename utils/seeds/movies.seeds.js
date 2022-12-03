const mongoose = require('mongoose');
const fs = require('fs');
const Movie = require('../../models/Movie.js');

const DB_URL = "mongodb+srv://root:nUH69ghJtacKMnmp@bd-movies.0y5sh78.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async() => {

    const movies = await Movie.find();

    if (movies.length) {
        await Movie.collection.drop();
    }
}).catch (err => {
    console.log(`Ha habido un error eliminando los datos: ${err}`);
})
.then(async() => {
    const data= fs.readFileSync('./utils/db/movies.json');
    const parsedData = JSON.parse(data);
    const movieDocs = parsedData.map((movie) => {
    return new Movie(movie);
    });
    await Movie.insertMany(movieDocs);
})
.catch((err) => {
    console.log(`Ha habido un error al añadir el documento a la colección ${err}`)
})
.finally(() => mongoose.disconnect())