const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');

var laLogica = new Logica('./test/copiaDeLaBD.db');



describe('Obtención de datos de la BD', function(){

    it('Extraigo la ultima medida de la BD sin error', function(hecho){

        laLogica.getUltimaMedida(function(err,res){

           assert.equal(err,null,'Err no es null: ' + err);

           assert.notEqual(res,null,'No he recibido nada de la BD');

           if(res) console.log(res);

           hecho();

        })//getUltimaMedida

    })//it

})//Describe