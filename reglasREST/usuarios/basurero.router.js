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
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
