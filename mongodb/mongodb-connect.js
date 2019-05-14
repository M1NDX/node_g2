'use strict'
let mongoose = require('mongoose');
let mongoDB ='mongodb://localhost:27017/AlumnosDBG2';
//let mongoDB = "mongodb+srv://alumnos:alumnos@cluster0-8lgbb.mongodb.net/test?retryWrites=true"
mongoose.connect(mongoDB,{ useNewUrlParser: true });
let db = mongoose.connection;

module.exports = {mongoose}
