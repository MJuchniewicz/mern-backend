const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require("dotenv");
dotenv.config()

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HttpError = require("./models/http-error");

const mongoose = require('mongoose')
const url = process.env.MONGO_API_KEY
const app = express()

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route", 404)
    throw error
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }

    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured'});
})

mongoose
  .connect(url)
    .then(() => {
        app.listen(5000)
        console.log("Coonnection established")
    })
    .catch(err => console.log(err));
