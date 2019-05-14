'use strict'
const express = require('express');
const fs = require('fs');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');
let {Alumno} = require('./mongodb/Alumno');
let {User} = require('./mongodb/User');
//import {Alumno} from './mongodb/mongodb-connect'
//let {User} = require('./mongodb/User')


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
app.use('/api/alumno/:id',validarId);

app.use(express.static(__dirname + '/public'))

//app.get('/', (req, res) => res.send('Hello DASWorld!'))
//app.route('/home').get((req, res) => res.send('DASWorld HOME1'))

function autenticar(req,res, next){
    let token = req.get('x-auth');
    if(!token){
        res.status(401).send({error: "no hay token"});
        return;
    }

    User.verificarToken(token).then((user)=>{
        console.log("Token verificado ...");
        req.userid = user._id;
        next();
    }).catch((err)=>{
        res.status(401).send(err);
    });

}


app.route('/api/alumno')
    .get(autenticar, (req, res) => {  //AQUI SE USA EL MIDDLEWARE DE AUTENTICAR *****
        // if (req.query.edad) {
        //     console.log(chalk.bold.blue(req.query.edad))
        //     let alumnosFiltro = alumnos.filter(al => al.edad >= Number(req.query.edad))
        //     res.json(alumnosFiltro);
        // } else {
        //     res.json(alumnos);
        // }
        Alumno.find({},{_id:0,nombre:1, edad:1},(err,docs)=>{
            if(err){
                console.log(err);
                res.status(400).send();
            }else{
                res.json(docs);
            }
        })
    })
    .post((req, res) => {
        let body = req.body;
        console.log(chalk.blue.bold(JSON.stringify(req.body)));
        if (body.carrera && body.nombre && body.edad && body.calificacion) {
   
            let newAlumno = new Alumno(body);
            newAlumno.save((err,doc)=>{
                if(doc){
                    console.log(doc);
                    res.status(201).json(doc);
                }else{
                    res.status(400).send();
                }
            })
        }else{
            res.status(400).send({
                error: " Faltan atributos en el body"
            })
        }

       

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
            res.send();
        } else{
            res.status(400).send({error:"Faltan datos o id incorrecto"})
        }
    })
    .patch((req,res)=>{
        let id = req.params.id;
        let body = req.body;
        if(partialUpdateAlumno(id,body)){
            res.send();
        } else{
            res.status(400).send({error:"Faltan datos o id incorrecto"})
        }
    })
    .delete((req, res)=>{
        let id = req.params.id;
        let pos = alumnos.findIndex(al => al.id == id);
        if(pos==-1){
            res.status(404).send({informacion: "Id no existe"});
            return;
        }

        let borrado = alumnos.splice(pos,1);
        fs.writeFileSync('alumnos.json',JSON.stringify(alumnos));
        res.send(borrado);


    })


 app.route('/api/user/login')
    .post( async (req,res)=>{
        console.log(req.body);
        let body = req.body;
        if(body.email && body.password){
            try{
                let token = await User.validarUsuario(body.email, body.password);
                res.set('x-auth',token);
                res.send();
                
            } catch(err){
                console.log(err);
                res.status(400).send(err);
            }
            
        }else{
            res.status(400).send({error:"falta email o password"})
        }

    })   

app.route('/api/user/logout')    
    .get((req, res)=>{
       let token = req.get('x-auth');
       if(!token){
           console.log("no existe token");
           res.status(400).send({error: "falta header con token"})
           return;
       }    

       // * SE ASUME QUE SI HAY TOKEN
       let datosUsuario = User.verDatosToken(token);
       console.log(datosUsuario);
       if(datosUsuario && datosUsuario._id){
           
           User.updateOne({_id:datosUsuario._id},{token: "123"}).then((doc)=>{
              res.send(doc);
           }).catch((err)=>{
               console.log(err);
               res.status(404).send();
           })
       }
    })


app.listen(port, () => console.log(`Example app listening on port http://127.0.0.1:${port}!`))

function updateAlumno(id, alumno){
    let pos = alumnos.findIndex(al => al.id == id);
        
    if (alumno.id && alumno.nombre && alumno.edad && id == alumno.id) {
        Object.assign(alumnos[pos],alumno);
        fs.writeFileSync('alumnos.json', JSON.stringify(alumnos));
        return true;
    }
    return false;
}

function partialUpdateAlumno(id, alumno){
    let pos = alumnos.findIndex(al => al.id == id);
        
    alumnos[pos].nombre = (alumno.nombre)? alumno.nombre: alumnos[pos].nombre;    
    alumnos[pos].edad = (alumno.edad)? alumno.edad: alumnos[pos].edad;

    Object.assign(alumnos[pos],alumno);
    fs.writeFileSync('alumnos.json', JSON.stringify(alumnos));
    return true;
 
}

function validarId(req,res, next){
    console.log("hola");
    let id = req.params.id;
    let pos = alumnos.findIndex(al => al.id == id);
    if(pos==-1){
        res.status(404).send({error:"Id no existe"});
        return;
    }
    next();
}