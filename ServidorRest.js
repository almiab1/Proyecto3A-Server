//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express');
const app = express();
const Logica = require('./Logica/Logica');
const parser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Routers
const routerCiudadano = require('./reglasREST/ciudadano.router')
const routerAdministrador = require('./reglasREST/usuarios/administrador.router')
const routerBasurero = require('./reglasREST/usuarios/basurero.router')

/* *********** CORS *********************************
 * Óscar Blánquez
 * description: middleware que habilita el
 * uso de CORS del servidor para poder realizar
 * peticiones HTTP desde el script de un cliente.
 * @params: req: Object, res: Object, next
 * @return: void
 ***************************************************/

/*
    Carlos Tortosa
*/

//------------------------------------------------------------------------------------------
// constructor objeto LogicaDeNegocio
//------------------------------------------------------------------------------------------
LogicaDeNegocio = new Logica('./SQL/baseDeDatos.db');


//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
app.use(parser.urlencoded({extended: false}));
app.use(parser.json()); //Auto parsea a objeto el body de los requests
app.use(cors());

app.use('/admin', LogicaDeNegocio.autentificarUsuario)
app.use('/basurero', LogicaDeNegocio.autentificarUsuario)

// enrrutadores
app.use('/',routerCiudadano)
app.use('/admin',routerAdministrador)
app.use('/basurero',routerBasurero)

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
app.get('/', function(req,res){
    //res.sendFile(path.join(__dirname,'/HTML/index.html'));
    res.send({mensaje: "Server Working"})
})
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
// puertos
//------------------------------------------------------------------------------------------
const PUERTO = process.env.PORT || 8080;

app.listen(PUERTO, function() {
    console.log('Server conectado en puerto ' + PUERTO);
});
