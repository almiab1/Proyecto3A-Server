const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');

var laLogica = new Logica('./test/copiaDeLaBD.db');



describe('Obtención de datos de la BD', function () {

    it('Extraigo la ultima medida de la BD sin error', function (hecho) {

        laLogica.getUltimaMedida(function (err, res) {

            assert.equal(err, null, 'Err no es null: ' + err);

            assert.notEqual(res, null, 'No he recibido nada de la BD');

            hecho();

        }) //getUltimaMedida

    }) //it



}) //Describe

describe('Inserción de datos en la BD', function () {

    it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function (hecho) {

        let elJsonBueno = {
            idTipoMedida: 2,
            valorMedido: 150,
            tiempo: 155555643123,
            latitud: 193.2,
            longitud: 176.2,
            idUsuario: "ec4bmw16",
            temperatura: 23,
            humedad: 45
        }

        laLogica.guardarMedida(elJsonBueno, function (err, result) {
            assert.equal(err, null, 'Error guardando en la BD: ' + err);
            hecho();
        })

    })

    it('Pruebo a darle un json no valido y compruebo que responde acorde', function (hecho) {

        let jsonMalo = {
            idTipoMedida: 'algo',
            otraCosa: 'que no tiene nada que ver',
            latitud: 145,
            idUsuario: null
        }

        laLogica.guardarMedida(jsonMalo, function (err, result) {
            assert.notEqual(err, null, '¿Lo ha guardado igualmente?: ' + result);
            hecho();
        })

    }) //it

}) //describe

describe('Borrado de datos de la BD', function () {

    it('Pruebo a borrar el elemento que he insertado antes', function (hecho) {

        laLogica.borrarUltimaMedida(function(err,res){
            assert.equal(err,null,'Ha habido un error borrando de la BD: ' + err);
            hecho();
        })

    })//it

})//Describe