//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')
const jwt = require('jsonwebtoken')

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
          var tokenData = {
            usuario: usuario,
            contrasenya: contrasenya
          }
          // Se genera el token
          const token = jwt.sign(tokenData,'privateKey',{
            expiresIn: 60 * 60 * 24 // 24 horas
          })
          res.status(200).send({token})
        } catch(error){
          console.error(error)
          res.status(401).end()
        }
      }
    })

   
})
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
module.exports = router
