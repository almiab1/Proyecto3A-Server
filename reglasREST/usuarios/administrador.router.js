//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')

//------------------------------------------------------------------------------------------
// Creación del enrutador
//------------------------------------------------------------------------------------------
const router = express.Router()




//------------------------------------------------------------------------------------------
// /darAltaUsuario
//------------------------------------------------------------------------------------------
router.post('/darAltaUsuario', async function(req, res) {
  await LogicaDeNegocio.darDeAltaUsuario(req.body, function(err, algo) {
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
router.post('/darAltaSensor', async function(req, res) {
  await LogicaDeNegocio.darDeAltaSensor(req.body, function(err, algo) {
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
  await LogicaDeNegocio.asociarSensorAUsuario(req.body, function(err, algo) {
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
router.delete('/darBajaUsuario', async function(req, res) {
  await LogicaDeNegocio.darDeBajaUsuario(req.body, function(err, algo) {
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
router.delete('/darBajaSensor', async function(req, res) {
  await LogicaDeNegocio.darDeBajaSensor(req.body, function(err, algo) {
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
router.get('/buscarUsuario/:usuario', async function(req, res) {

  var idUsuario = req.params.usuario

   await LogicaDeNegocio.buscarUsuario(idUsuario, function(err, resultado) {
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
router.get('/buscarSensor/:sensor', async function(req, res) {

  var idSensor = req.params.sensor

  await LogicaDeNegocio.buscarSensor(idSensor, function(err, resultado) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) // buscarSensor
//------------------------------------------------------------------------------------------
// /distanciaRecorridaUsuario
//------------------------------------------------------------------------------------------
router.get('/distanciaActividad/:usuario', async function(req, res) {

  var idUsuario = req.params.usuario

  await LogicaDeNegocio.obtenerPosicionesYTiempoUsuario(idUsuario, function(err, resultado) {
    if (err) {
      res.sendStatus(500);
    } else {
      let distancia = LogicaDeNegocio.calcularDistancia(resultado)
      let bool = LogicaDeNegocio.calcularActividad(resultado)

      let actividad = ""
      if (bool == true){
        actividad = "activo"
      }
      else {
        actividad = "inactivo"
      }
      json = {
        distancia: distancia,
        actividad: actividad
      }
      res.send(JSON.stringify(json)).status(200);
    }
  });
}) // distanciaRecorridaUsuario
//------------------------------------------------------------------------------------------
// /getUsuarios
//------------------------------------------------------------------------------------------
router.get('/getUsuarios', async function(req, res) {

    await LogicaDeNegocio.getUsuarios(function(err, resultado) {
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
  }) // getUsuarios
//------------------------------------------------------------------------------------------
// /getSensores
//------------------------------------------------------------------------------------------
router.get('/getSensores', async function(req, res) {

    await LogicaDeNegocio.getSensores(function(err, resultado) {
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
  }) // getSensores
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

// Prueba admin
router.get('/prueba', (req, res, next) => {
  if(err) res.send(err);
  res.status(200).send('Administrador');
});

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
