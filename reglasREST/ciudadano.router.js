//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')
const Logica = require('../Logica/Logica');

//------------------------------------------------------------------------------------------
// Creación del enrutador
//------------------------------------------------------------------------------------------
const router = express.Router()

//------------------------------------------------------------------------------------------
// constructor objeto LogicaDeNegocio
//------------------------------------------------------------------------------------------
LogicaDeNegocio = new Logica('../Logica/baseDeDatos.db');


//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------
// /getUltimaMedida
//------------------------------------------------------------------------------------------
router.get('/getUltimaMedida', function(req, res){
    LogicaDeNegocio.getUltimaMedida(function(err, resultado){
        if(err){
            if (err == 'Sin resultados'){
                res.sendStatus(404);
            } else {
                res.sendStatus(500);
            }
        } else {
            res.send(JSON.stringify(resultado)).status(200);
        }
    });
})//getUltimaMedida




router.route('/hola')
    .get((req, res) => {
        res.send({'message': 'hola'})
    })
    .post((req, res) => {
        res.send(req.body)
    })


router.get('/getAllMedidas', (req, res) => {
    
    var medidas = [medida_1={"1":{valor:'20',instante:'18:00'}},
     medida_2={"2": [valor='30',instante='19:00']}]
   

    

    

    res.send(JSON.stringify(medidas)).status(200);


    

})


module.exports = router