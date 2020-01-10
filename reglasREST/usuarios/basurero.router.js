//------------------------------------------------------------------------------------------
// basurero.router.js
// Equipo 4
// Brian, Carlos Tortosa, Carlos Canut, Oscar, Alejandro
// copyright
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')
const app = express();
//------------------------------------------------------------------------------------------
// Creación del enrutador
//------------------------------------------------------------------------------------------
const router = express.Router()

//------------------------------------------------------------------------------------------
// Óscar Blánquez
// description: middleware que habilita el
// uso de CORS del servidor para poder realizar
// peticiones HTTP desde el script de un cliente.
// @params: req: Object, res: Object, next
// @return: void
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// /guardarMedida
//------------------------------------------------------------------------------------------
router.post('/guardarMedida', async function(req, res) {
  await LogicaDeNegocio.guardarMedida(req.body, function(err, algo) {
    if (err) {
      if (err == 'JSON incompleto') {
        res.sendStatus(400);
      } else {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(200);
    }
  });
}) // guardarMedida
//------------------------------------------------------------------------------------------
// /cambiarContrasenya
//------------------------------------------------------------------------------------------
router.put('/cambiarContrasenya', async function(req, res) {
  await LogicaDeNegocio.cambiarContrasenya(req.body, function(err, algo) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
}) // cambiarContrasenya


//------------------------------------------------------------------------------------------
// Carlos Tortosa Micó
// /getValoracionCalidadAire
//------------------------------------------------------------------------------------------
router.get('/getValoracionCalidadAire', async function(req, res) {
  if (req.body) {
    await LogicaDeNegocio.getValoracionCalidadAire(req.body, function(err, media) {
      if (err) {
        res.json({
          error: err
        }).status(500);
      } else {
        res.json({
          CalidadDelAire: media
        }).status(200);
      }
    })
  } else {
    res.sendStatus(403);
  }
}) // cambiarContrasenya
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
// Carlos Tortosa Micó
// /getValoracionCalidadAireJornada
//------------------------------------------------------------------------------------------
router.get('/getValoracionCalidadAireJornada', async function(req, res) {
  if (req.body) {
    await LogicaDeNegocio.getValoracionCalidadAireJornada(req.body, function(err, media) {
      if (err) {
        res.json({
          error: err
        }).status(500);
      } else {
        res.json({
          CalidadDelAire: media
        }).status(200);
      }
    })
  } else {
    res.send('No se ha detectado body en la peticion').status(403);
  }
}) // cambiarContrasenya
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
