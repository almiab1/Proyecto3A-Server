const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');

var laLogica = new Logica('./test/copiaDeLaBD.db');

describe('Inserción de datos en la BD', function () {

    it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function (hecho) {

        let elJsonBueno = {

            idUsuario: "migui@gmail.com",
            contrasenya: "migui1234",
            idTipoUsuario: 1,
            telefono: "612783920"
        }

        laLogica.darDeAlataUsuario(elJsonBueno, function (err, result) {


            assert.equal(elJsonBueno.idUsuario, "migui@gmail.com");
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

        laLogica.darDeAlataUsuario(jsonMalo, function (err, result) {
            assert.notEqual(err, null, '¿Lo ha guardado igualmente?: ' + result);
            hecho();
        })

    }) //it

    it('Pruebo a insertar un email ya registrado y compruebo que no me deja', function (hecho) {

      let jsonMalo = {

          idUsuario: "migui@gmail.com",
          contrasenya: "migui1234",
          idTipoUsuario: 1,
          telefono: "612783920"
      }

        laLogica.darDeAlataUsuario(jsonMalo, function (err, result) {
            assert.notEqual(err, null);
            hecho();
        })

    }) //it

}) //describe
