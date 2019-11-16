//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express');
const app = express();
const Logica = require('./Logica/Logica');
const parser = require('body-parser');
const path = require('path');
const cors = require('cors')
const morgan = require('morgan')

// Routers
const routerCiudadano = require('./reglasREST/ciudadano.router')
const routerAdministrador = require('./reglasREST/usuarios/administrador.router')
const routerBasurero = require('./reglasREST/usuarios/basurero.router')


/*
    Carlos Tortosa

*/

//------------------------------------------------------------------------------------------
// constructor objeto LogicaDeNegocio
//------------------------------------------------------------------------------------------
LogicaDeNegocio = new Logica('./Logica/baseDeDatos.db');


//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
app.use(parser.urlencoded({extended: true}));
app.use(parser.json()); //Auto parsea a objeto el body de los requests
app.use(cors())
app.use(morgan('dev'))


// enrrutadores
app.use('/',routerCiudadano)
app.use('/admin',routerAdministrador)
app.use('/basurero',routerBasurero)

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
app.get('/', function(req,res){
    //res.sendFile(path.join(__dirname,'/HTML/index.html'));
    res.send({"message": "Server Working"})
})
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------
// puertos
//------------------------------------------------------------------------------------------
let PUERTO;
if(process.env.PORT === undefined) {
    PUERTO = 8080;
} else {
    PUERTO = process.env.PORT;
}

app.listen(PUERTO, function(){
    console.log('Server conectado en puerto ' + PUERTO);
});
