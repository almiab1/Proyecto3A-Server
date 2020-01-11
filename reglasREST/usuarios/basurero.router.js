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
// A pesar de ser un get, uso post porque la libreria de Ionic no permite adjuntar body con los get
//------------------------------------------------------------------------------------------
router.post('/getValoracionCalidadAire', async function(req, res) {
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
  if (req.query) {
    await LogicaDeNegocio.getValoracionCalidadAireJornada(req.query, function(err, media) {
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
    res.send('No se han detectado los datos en la peticion (Comprueba el query)').status(403);
  }
}) // cambiarContrasenya

//------------------------------------------------------------------------------------------
//  POST /postRuta
//------------------------------------------------------------------------------------------
router.post('/postRuta', async function(req, res) {

  await LogicaDeNegocio.postRuta(req.body, function(err, algo) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });

}) // /postRuta

//------------------------------------------------------------------------------------------
// GET /getRutasPredefinidas
//------------------------------------------------------------------------------------------
router.get('/getRutasPredefinidas', async function(req, res) {

  await LogicaDeNegocio.getRutasPredefinidas(function(err, resultado) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) // getRutasPredefinidas

//------------------------------------------------------------------------------------------
// GET /getRutasRealizadas
//------------------------------------------------------------------------------------------
router.get('/getRutasRealizadas/:usuario', async function(req, res) {

  var idUsuario = req.params.usuario

  await LogicaDeNegocio.getRutasRealizadas(idUsuario, function(err, resultado) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) // getRutasRealizadas

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
router.post('/prueba', (req, res) => {
  res.status(200).send("Probando router basurero");
})
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
