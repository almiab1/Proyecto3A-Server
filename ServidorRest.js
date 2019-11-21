//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express');
const app = express();
const Logica = require('./Logica/Logica');
const parser = require('body-parser');
const path = require('path');

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
LogicaDeNegocio = new Logica('./Logica/baseDeDatos.db');


//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
app.use(parser.urlencoded({extended: true}));
app.use(parser.json()); //Auto parsea a objeto el body de los requests

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
    res.send({"message": "Server Working"})
})
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

app.get('/prueba', (req, res) => {
    res.status(200).send(req.headers);
    console.log("HEADERS! :  "+ req.headers.authorization);
})

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
