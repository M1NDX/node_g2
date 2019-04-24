'use strict'
const express = require('express')
const fs = require('fs')
const chalk = require('chalk')
const app = express()
const port = 3000

let alumnos = JSON.parse(fs.readFileSync('alumnos.json'));

app.get('/', (req, res) => res.send('Hello DASWorld!'))
app.route('/home').get((req, res) => res.send('DASWorld HOME1'))
app.route('/alumnos').get((req, res) => {
    if(req.query.edad){
        console.log(chalk.bold.blue(req.query.edad))
        let alumnosFiltro = alumnos.filter(al => al.edad >= Number(req.query.edad))
        res.json(alumnosFiltro);
    } else {
        res.json(alumnos);  
    }
    
    
} )

app.route('/alumnos/:id').get((req, res) =>{
    let id = req.params.id;
    let alumno = alumnos.find( al => al.id == id);
    console.log("id:"+id);
    if(alumno){
        res.json(alumno);
    }else{
        res.json({error: "no existe"});
    }
   
    //res.json(alumnos)
} )

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
