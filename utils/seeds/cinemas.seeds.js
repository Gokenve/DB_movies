//? Creating cinemas seed's middleware to populate the DB.
const mongoose = require('mongoose');
const fs = require('fs');
const Cinema = require('../../models/Cinemas.js');
const DB_URL = require ('./urlMongoDB');

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async() => {

    const cinemas = await Cinema.find();

    if (cinemas.length) {
        await Cinema.collection.drop();
    }
}).catch (err => {
    console.log(`Ha habido un error eliminando los datos: ${err}`);
})
.then(async() => {
    const data= fs.readFileSync('./utils/db/cinemas.json');
    const parsedData = JSON.parse(data);
    const cinemaDocs = parsedData.map((cinema) => {
    return new Cinema(cinema);
    });
    await Cinema.insertMany(cinemaDocs);
})
.catch((err) => {
    console.log(`Ha habido un error al añadir el documento a la colección ${err}`)
})
.finally(() => mongoose.disconnect())