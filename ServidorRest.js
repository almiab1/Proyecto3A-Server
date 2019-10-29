const express = require('express');
const app = express();
const Logica = require('./Logica/Logica');
const parser = require('body-parser');
const path = require('path');

/*
    Carlos Tortosa Micó
*/

LogicaDeNegocio = new Logica('./Logica/baseDeDatos.db');

app.use(parser.urlencoded({extended: true}));
app.use(parser.json()); //Auto parsea a objeto el body de los requests

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'/HTML/index.html'));
})

app.get('/getUltimaMedida', function(req, res){
    LogicaDeNegocio.getUltimaMedida(function(err, resultado){
        if(err){
            if (err == 'Sin resultados'){
                res.sendStatus(404);
            } else {
                res.sendStatus(500);
            }
        } else {
            res.send(JSON.stringify(resultado)).status(200);
        }
    });
})

app.post('/guardarMedida', function(req,res){
    LogicaDeNegocio.guardarMedida(req.body, function(err,algo){
        if(err) {
            if(err == 'JSON incompleto') {
                res.sendStatus(400);
            } else {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(200);
        }
    });
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