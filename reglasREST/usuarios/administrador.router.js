//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')
const Logica = require('../../Logica/Logica');

//------------------------------------------------------------------------------------------
// Creación del enrutador
//------------------------------------------------------------------------------------------
const router = express.Router()

//------------------------------------------------------------------------------------------
// constructor objeto LogicaDeNegocio
//------------------------------------------------------------------------------------------
LogicaDeNegocio = new Logica('../../Logica/baseDeDatos.db');



//------------------------------------------------------------------------------------------
// /darAltaUsuario
//------------------------------------------------------------------------------------------
router.post('/darAltaUsuario', function(req, res) {
  LogicaDeNegocio.darDeAltaUsuario(req.body, function(err, algo) {
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
}) // darAltaUsuario
//------------------------------------------------------------------------------------------
// /darDeAltaSensor
//------------------------------------------------------------------------------------------
router.post('/darAltaSensor', function(req, res) {
  LogicaDeNegocio.darDeAltaSensor(req.body, function(err, algo) {
    if (err) {
      if (err == 'JSON incompleto') {
        res.sendStatus(400);
        return;
      } else {
        res.sendStatus(500);
        return;
      }
    } else {
      res.status(200);
    }
  });
  LogicaDeNegocio.asociarSensorAUsuario(req.body, function(err, algo) {
    if (err) {
      if (err == 'JSON incompleto') {
        res.sendStatus(400);
        return;
      } else {
        res.sendStatus(500);
        return;
      }
    } else {
      res.sendStatus(200);
    }
  });
}) // darAltaSensor
//------------------------------------------------------------------------------------------
// /darBajaUsuario
//------------------------------------------------------------------------------------------
router.delete('/darBajaUsuario', function(req, res) {
  LogicaDeNegocio.darDeBajaUsuario(req.body, function(err, algo) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
}) // darBajaUsuario
//------------------------------------------------------------------------------------------
// /darBajaSensor
//------------------------------------------------------------------------------------------
router.delete('/darBajaSensor', function(req, res) {
  LogicaDeNegocio.darDeBajaSensor(req.body, function(err, algo) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
}) // darBajaSensor
//------------------------------------------------------------------------------------------
// /buscarUsuario
//------------------------------------------------------------------------------------------
router.get('/buscarUsuario/:usuario', function(req, res) {

  var idUsuario = req.params.usuario

  LogicaDeNegocio.buscarUsuario(idUsuario, function(err, resultado) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) // buscarUsuario
//------------------------------------------------------------------------------------------
// /buscarSensor
//------------------------------------------------------------------------------------------
router.get('/buscarSensor/:sensor', function(req, res) {

  var idSensor = req.params.sensor

  LogicaDeNegocio.buscarUsuario(idSensor, function(err, resultado) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) // buscarSensor
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
