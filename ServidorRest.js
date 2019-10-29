const express = require('express');
const app = express();
const Logica = require('./Logica/Logica');
const parser = require('body-parser');
const path = require('path');

/*
    Carlos Tortosa Micó
*/

LogicaDeNegocio = new Logica('baseDeDatos.db');

app.use(parser.json()); //Auto parsea a objeto el body de los requests

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'/HTML/index.html'));
})

app.get('/getUltimaMedida', function(req, res){
    LogicaDeNegocio.getUltimaMedida(req, res);
})

app.post('/guardarMedida', function(req,res){
    LogicaDeNegocio.guardarMedida(req,res);
})

let PUERTO;
if(process.env.PORT === undefined) {
    PUERTO = 8080;
} else {
    PUERTO = process.env.PORT;
}

app.listen(PUERTO, function(){
    console.log('Server conectado en puerto ' + PUERTO);
});