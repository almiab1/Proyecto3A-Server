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
// /guardarMedida
//------------------------------------------------------------------------------------------
router.post('/guardarMedida', function(req,res){
    LogicaDeNegocio.guardarMedida(req.body, function(err,algo){
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
})// guardarMedida


router.route('/hola')
    .get((req, res) => {
        res.send({'message': 'hola'})
    })
    .post((req, res) => {
        res.send(req.body)
    })

/*
app.get('/getAllMedidas', (req, res) => {
    
    var medidas = [medida_1={"1":{valor:'20',instante:'18:00'}},
     medida_2={"2": [valor='30',instante='19:00']}]
   

    

    

    res.send(JSON.stringify(medidas)).status(200);


    

})
*/

module.exports = router