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
app.use( (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
})

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
// /calidadDelAireMediaRespirada
//------------------------------------------------------------------------------------------
router.get('/calidadDelAireMediaRespirada', async function(req, res) {
  if(req.body) {
    await LogicaDeNegocio.calidadDelAireMediaRespirada(req.body, function(err, media){
      if(err){
        res.json({error: err}).status(500);
      } else {
        res.json({CalidadDelAire: media}).status(200);
      }
    })
  } else {
    res.sendStatus(403);
  }
}) // cambiarContrasenya
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
