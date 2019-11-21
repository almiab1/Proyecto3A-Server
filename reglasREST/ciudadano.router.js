//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')
const app = express();
const jwt = require('jsonwebtoken')

const jsdom = require('jsdom')
const {JSDOM} = jsdom

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
      if(!usuario || !contrasenya){
        console.log({usuario, contrasenya})
        res.status(400).send({message: 'idUsuario and contrasenya required'})
    }
    console.log({usuario, contrasenya})


    await LogicaDeNegocio.verificarUsuario(usuario,contrasenya,(err,resultado) => {
      if(err){
        res.status(401).end()
      } else {
        try{
          if(resultado==''){
            res.status(401).end()
          }
          console.log({resultado})
          // payload (token)
          var tokenData = {
            usuario: usuario,
            contrasenya: contrasenya
          }
          // signing options
          var signOptions = {
            issuer: 'iPolution',
            expiresIn: 60 * 60 * 24
            // aqui puede meterse un algoritmo de encriptación
          }
          // Se genera el token
          const token = jwt.sign(tokenData,'privateKey',signOptions)
          console.log(token)
          res.status(200).send({token})
        } catch(error){
          console.error(error)
          res.status(401).end()
        }
      }
    })

   
}) // /login


//------------------------------------------------------------------------------------------
//  GET /getMedidasOficiales
//------------------------------------------------------------------------------------------
router.get('/getMedidasOficiales', (req, res) => {

  // funcion que muestra las medidas oficiales
  LogicaDeNegocio.getMedidasOficialeslol(req, res);

})  // /getMedidasOficiales


//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
