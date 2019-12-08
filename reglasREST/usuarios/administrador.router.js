//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')
const app = express();
//------------------------------------------------------------------------------------------
// Creación del enrutador
//------------------------------------------------------------------------------------------
const router = express.Router()
/* *********** CORS *********************************
 * Óscar Blánquez
 * description: middleware que habilita el
 * uso de CORS del servidor para poder realizar
 * peticiones HTTP desde el script de un cliente.
 * @params: req: Object, res: Object, next
 * @return: void
 ***************************************************/


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
router.delete('/darBajaUsuario/:id', async function(req, res) {
  await LogicaDeNegocio.darDeBajaUsuario(req.params, function(err, algo) {
    if (err) {
      res.sendStatus(500);
    } else {
      console.log(req.params);
      res.sendStatus(200);
    }
  });
}) // darBajaUsuario
//------------------------------------------------------------------------------------------
// /darBajaSensor
//------------------------------------------------------------------------------------------
router.delete('/darBajaSensor/:id', async function(req, res) {
  await LogicaDeNegocio.darDeBajaSensor(req.params, function(err, algo) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
}); // darBajaSensor
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
      if (bool == true) {
        actividad = "activo"
      } else {
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
// /estadoSensores
//------------------------------------------------------------------------------------------
router.get('/estadoSensores', async function(req, res) {

  let tiempoLimite = 3600000 * 24;
  let listaSensores = await LogicaDeNegocio.dameTodosSensoresConSuUltimaMedida();
  let sensoresInactivos = await LogicaDeNegocio.dameListaSensoresInactivos(tiempoLimite, listaSensores)
  res.send(JSON.stringify(sensoresInactivos)).status(200);

}) // estadoSensores
//------------------------------------------------------------------------------------------
// /estadoUnSensor
//------------------------------------------------------------------------------------------
router.get('/estadoUnSensor/:idSensor', async function(req, res) {

  var idSensor = req.params.idSensor;
  console.log(idSensor);
  let tiempoLimite = 3600000 * 24;
  let tiempo = await LogicaDeNegocio.dameUltimaMedidaDeUnSensor(idSensor);
  console.log(tiempo);
  let bool = await LogicaDeNegocio.estaInactivoUnSensor(tiempoLimite, tiempo[0].tiempo)
  console.log(bool);
  res.send(JSON.stringify(bool)).status(200);

}) // estadoSensores
//------------------------------------------------------------------------------------------
// /getUsuarios
//------------------------------------------------------------------------------------------
router.get('/getUsuarios', async function(req, res) {

  await LogicaDeNegocio.getUsuarios(function(err, resultado) {
    if (err) {
      res.sendStatus(500);
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
      res.sendStatus(500);
    } else {
      res.send(JSON.stringify(resultado)).status(200);
    }
  });
}) // getSensores

//------------------------------------------------------------------------------------------
// GET /borrarUltimaMedida
//------------------------------------------------------------------------------------------
router.get('/borrarUltimaMedida', async (req, res) => {
  await LogicaDeNegocio.borrarUltimaMedida((confirmacion, respuesta) => {
    if (confirmacion == true) {
      res.status(200).send('Se ha borrado la medida con ID: ' + respuesta);
    }
    if (confirmacion == false) {
      res.end();
    }
  });
});

//------------------------------------------------------------------------------------------
// GET /borrarTodasLasMedidas
//------------------------------------------------------------------------------------------
router.get('/borrarTodasLasMedidas', async (req, res) => {
  await LogicaDeNegocio.borrarTodasLasMedidas((confirmacion, err) => {
    if (confirmacion == true) {
      res.status(200).send('Se han borrado todas las medidas');
    }
    if (confirmacion == false) {
      res.status(500).send({
        Error: 'Error al borrar en la base de datos: ' + err
      });
    }
  });
});

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
