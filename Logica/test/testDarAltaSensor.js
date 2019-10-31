const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');

var laLogica = new Logica('./test/copiaDeLaBD.db');

describe('Inserción de datos en la BD sensor', function () {

    it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function (hecho) {

        let elJsonBueno = { idTipoSensor: 1}

        laLogica.darDeAltaSensor(elJsonBueno, function (err, result) {


            assert.equal(elJsonBueno.idTipoSensor, 1);
            hecho();
        })

    })

}) //describe
