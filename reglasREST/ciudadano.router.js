//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')

//------------------------------------------------------------------------------------------
// Creación del enrutador
//------------------------------------------------------------------------------------------
const router = express.Router()



//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------


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
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
