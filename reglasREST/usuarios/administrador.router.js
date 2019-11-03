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
router.post('/darAltaUsuario', function(req,res){
    LogicaDeNegocio.darDeAltaUsuario(req.body, function(err,algo){
        if(err) {
            if(err == 'JSON incompleto') {
                res.sendStatus(400);
            } else {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(200);
        }
    });
})// darAltaUsuario



//------------------------------------------------------------------------------------------
// /darDeAltaSensor
//------------------------------------------------------------------------------------------
router.post('/darAltaSensor', function(req,res){
    LogicaDeNegocio.darDeAltaSensor(req.body, function(err,algo){
        if(err) {
            if(err == 'JSON incompleto') {
                res.sendStatus(400);
            } else {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(200);
        }
    });
    LogicaDeNegocio.asociarSensorAUsuario(req.body, function(err,algo){
        if(err) {
            if(err == 'JSON incompleto') {
                res.sendStatus(400);
            } else {
                res.sendStatus(500);
            }
        } else {
            res.sendStatus(200);
        }
    });
})// darAltaSensor


//------------------------------------------------------------------------------------------
// /darBajaUsuario
//------------------------------------------------------------------------------------------
router.put('/darBajaUsuario', function(req,res){
    LogicaDeNegocio.eliminarUsuarioDeTablaMedidas(req.body, function(err,algo){
        if(err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
})// darBajaUsuario

router.delete('/darBajaUsuario', function(req,res){
   LogicaDeNegocio.darDeBajaUsuario(req.body, function(err,algo){
      if(err) {
          res.sendStatus(500);
      } else {
          res.sendStatus(200);
      }
  });
})// darBajaUsuario


//------------------------------------------------------------------------------------------
// /darBajaSensor
//------------------------------------------------------------------------------------------
router.put('/darBajaSensor', function(req,res){
    LogicaDeNegocio.eliminarSensorDeTablaMedidas(req.body, function(err,algo){
        if(err) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
})// darBajaSensor

router.delete('/darBajaSensor', function(req,res){
   LogicaDeNegocio.darDeBajaSensor(req.body, function(err,algo){
      if(err) {
          res.sendStatus(500);
      } else {
          res.sendStatus(200);
      }
  });
})// darBajaSensor




router.route('/hola')
    .get((req, res) => {
        res.send({'message': 'hola'})
    })
    .post((req, res) => {
        res.send(req.body)
    })



module.exports = router