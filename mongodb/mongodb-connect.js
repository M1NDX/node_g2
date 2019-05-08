'use strict'
let mongoose = require('mongoose');
//let mongoDB ='mongodb://localhost:27017/AlumnosDBG2';
let mongoDB = "mongodb+srv://alumnos:<password>@cluster0-8lgbb.mongodb.net/test?retryWrites=true"
mongoose.connect(mongoDB,{ useNewUrlParser: true });
let db = mongoose.connection;

let alumnoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    edad:{
        type: Number,
        min: 17,
        max: 80,
        required: true
    },
    carrera:{
        type: String,
        enum: ['IE','ISC','IES', 'ISI'],
        required: true
    },
    calificacion:{
        type: Number,
        min: 50,
        max: 100,
        required:true
    }
});

let Alumno = mongoose.model('alumnos', alumnoSchema);

let alumnoN = Alumno({nombre:"Abc", edad:23, carrera:"ISC", calificacion: 80 });

// alumnoN.save()
//     .then((doc)=>console.log(doc))
//     .catch((err)=>console.log(err));
//{calificacion:{$gte:60} }
//Alumno.find({calificacion:{$gte:60}, carrera:"ISC" }, (err, docs)=>{
Alumno.find({$and:[{calificacion:{$gte:60}},{carrera:"ISC"}] }, (err, docs)=>{

    if(err){
        console.log(err);
        return;
    }

    console.log(docs);
})