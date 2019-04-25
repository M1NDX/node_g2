'use strict'
const express = require('express');
const fs = require('fs');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');

//npm i body-parser --save
const app = express()
const port = 3000
let alumnos = JSON.parse(fs.readFileSync('alumnos.json'));

let corsOptions = {
   origin:'http://127.0.0.1:5500' 
}


let jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors(corsOptions));

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => res.send('Hello DASWorld!'))
app.route('/home').get((req, res) => res.send('DASWorld HOME1'))
app.route('/alumnos')
    .get((req, res) => {
        if(req.query.edad){
            console.log(chalk.bold.blue(req.query.edad))
            let alumnosFiltro = alumnos.filter(al => al.edad >= Number(req.query.edad))
            res.json(alumnosFiltro);
        } else {
            res.json(alumnos);  
        }
    })
    .post((req, res) => {
        
        console.log(chalk.blue.bold(JSON.stringify(req.body)));
        console.log(req.body.nombre);
        res.status(201).send();
    })

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

app.listen(port, () => console.log(`Example app listening on port http://127.0.0.1:${port}!`))
