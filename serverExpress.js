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
    origin: 'http://127.0.0.1:5500'
}


let jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(cors(corsOptions));

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => res.send('Hello DASWorld!'))
//app.route('/home').get((req, res) => res.send('DASWorld HOME1'))
app.route('/api/alumno')
    .get((req, res) => {
        if (req.query.edad) {
            console.log(chalk.bold.blue(req.query.edad))
            let alumnosFiltro = alumnos.filter(al => al.edad >= Number(req.query.edad))
            res.json(alumnosFiltro);
        } else {
            res.json(alumnos);
        }
    })
    .post((req, res) => {
        let body = req.body;

        if (body.id && body.nombre && body.edad) {
            //TODO: ver que no exista id 
            alumnos.push(body);
            fs.writeFileSync('alumnos.json', JSON.stringify(alumnos));
            console.log(chalk.blue.bold(JSON.stringify(req.body)));
            console.log(req.body.nombre);
            res.status(201).send(body);
            return;
        }

        res.status(400).send({
            error: " Faltan atributos en el body"
        })

    })

app.route('/api/alumno/:id')
    .get((req, res) => {
        let id = req.params.id;
        let alumno = alumnos.find(al => al.id == id);
        console.log("id:" + id);
        if (alumno) {
            res.json(alumno);
        } else {
            res.json({
                error: "no existe"
            });
        }
    })
    .put((req,res)=>{
        let id = req.params.id;
        let body = req.body;
        if(updateAlumno(id,body)){
            res.send(alumnos[pos]);
        } else{
            res.status(400).send({error:"Faltan datos o id incorrecto"})
        }
    })
    .patch((req,res)=>{

    })


app.listen(port, () => console.log(`Example app listening on port http://127.0.0.1:${port}!`))

function updateAlumno(id, alumno){
    let pos = alumnos.findIndex(al => al.id == id);
        
    if (alumno.id && alumno.nombre && alumno.edad && id == alumno.id) {
        Object.assign(alumnos[pos],alumno);
        fs.writeFileSync('alumnos.json', JSON.stringify(alumnos));
        res.send(alumnos[pos]);
        return;
    }

}
