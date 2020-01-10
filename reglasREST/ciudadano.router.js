//------------------------------------------------------------------------------------------
// ciudadano.router.js
// Equipo 4
// Brian, Carlos Tortosa, Carlos Canut, Oscar, Alejandro
// copyright
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')
const app = express();
const jwt = require('jsonwebtoken')

const jsdom = require('jsdom')
const {
  JSDOM
} = jsdom

//------------------------------------------------------------------------------------------
// Creación del enrutador
//------------------------------------------------------------------------------------------
const router = express.Router()

//------------------------------------------------------------------------------------------
// /getUltimaMedida
//------------------------------------------------------------------------------------------
router.get('/getUltimaMedida', function(req, res) {
  LogicaDeNegocio.getUltimaMedida(function(err, resultado) {
    if (err) {
      if (err == 'Sin resultados') {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) //getUltimaMedida
//------------------------------------------------------------------------------------------
// /getAllMedidas
//------------------------------------------------------------------------------------------
router.get('/getAllMedidas', (req, res) => {
  LogicaDeNegocio.getAllMedidas(function(err, resultado) {
    if (err) {
      if (err == 'Sin resultados') {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) // getAllMedidas
//------------------------------------------------------------------------------------------
// /getAllOzono
//------------------------------------------------------------------------------------------
router.get('/getAllOzono', (req, res) => {
  LogicaDeNegocio.getAllOzono(function(err, resultado) {
    if (err) {
      if (err == 'Sin resultados') {
        res.sendStatus(404);
      } else {
        res.sendStatus(500);
      }
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) // getAllOzono


//------------------------------------------------------------------------------------------
//  POST /login
//------------------------------------------------------------------------------------------
router.post('/login', async (req, res) => {

  var usuario = req.body.idUsuario
  var contrasenya = req.body.contrasenya

  // comprueba que hay idUsuario y contrasenya
  if (!usuario || !contrasenya) {
    console.log({
      usuario,
      contrasenya
    })
    res.status(400).send({
      message: 'idUsuario and contrasenya required'
    })
  }
  await LogicaDeNegocio.verificarUsuario(usuario, contrasenya, (err, resultado) => {
    if (err) {
      res.status(401).end();
      return;
    } else {
      try {
        if (resultado == '') {
          res.status(404).end();
          return;
        }
        // payload (token)
        var tokenData = {
          usuario: usuario,
          idTipoUsuario: resultado[0].idTipoUsuario
        }
        // signing options
        var signOptions = {
          issuer: 'iPolution',
          expiresIn: 60 * 60 * 24
          // aqui puede meterse un algoritmo de encriptación
        }
        // Se genera el token
        const token = jwt.sign(tokenData, 'privateKey', signOptions)
        console.log(token)
        res.status(200).send({
          token
        })
      } catch (error) {
        console.error(error)
        res.status(401).end()
      }
    }
  });
}); // /login


//------------------------------------------------------------------------------------------
//  GET /getMedidasOficiales
//------------------------------------------------------------------------------------------
router.get('/getMedidasOficiales', (req, res) => {

  // funcion que muestra las medidas oficiales
  LogicaDeNegocio.getMedidasOficialeslol(req, res);

}) // /getMedidasOficiales

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
