const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');
const kriging = require('@sakitam-gis/kriging');

var laLogica = new Logica('./test/copiaDeLaBD.db');



describe('Obtención de datos de la BD Medidas', function () {

    it('Extraigo la ultima medida de la BD sin error', async function () {

        await laLogica.getUltimaMedida(function (err, res) {
            assert.equal(res.length, 1)
            assert.equal(res[0].idMedida, 566)
            assert.equal(res[0].idUsuario, "canut@gmail.com")
        }) //getUltimaMedida

    }) //it

    it('Extraigo todas las medidas de la BD Mediciones sin error', async function () {

        await laLogica.getAllMedidas(function (err, res) {
            assert.equal(res.length, 100)
        }) //getUltimaMedida

    }) //it

    it('Extraigo todas las medidas de ozono de la BD Mediciones sin error', async function () {

        await laLogica.getAllOzono(function (err, res) {
            assert.equal(res.length, 100)
        }) //getUltimaMedida

    }) //it

}) //Describe


describe('Obtención de datos de la BD Usuarios y Sensores', function () {
    it('Busco información de usuario', async function () {

        let usuario = "briancalabuig@gmail.com"

        await laLogica.buscarUsuario(usuario, function (err, res) {
            assert.equal(res[0].telefono, "664410457")
            assert.equal(res[0].descripcion, "Basurero")
        })
    })

    it('Busco información de sensor', async function () {

        let sensor = 1

        await laLogica.buscarSensor(sensor, function (err, res) {
            assert.equal(res[0].descripcion, "Ozono")
        })
    })
})

describe('Inserción de datos en la BD sensor', function () {

    it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function (hecho) {

        let elJsonBueno = {
            idSensor: 10,
            idTipoSensor: 1,
            idUsuario: "bri"
        }

        laLogica.darDeAltaSensor(elJsonBueno, function (err, result) {


            assert.equal(elJsonBueno.idTipoSensor, 1);
            assert.equal(elJsonBueno.idUsuario, "bri");
            hecho();
        })

    })

}) //describe
describe('Inserción de datos en la BD Usuario', function () {

    it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function (hecho) {

        let elJsonBueno = {

            idUsuario: "migui@gmail.com",
            contrasenya: "migui1234",
            idTipoUsuario: 1,
            telefono: "612783920",
            nombre: "Migui Alvarez Nistal"
        }

        laLogica.darDeAltaUsuario(elJsonBueno, function (err, result) {


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

        laLogica.darDeAltaUsuario(jsonMalo, function (err, result) {
            assert.notEqual(err, null, '¿Lo ha guardado igualmente?: ' + result);
            hecho();
        })

    }) //it

    it('Pruebo a insertar un email ya registrado y compruebo que no me deja', function (hecho) {

        let jsonMalo = {

            idUsuario: "migui@gmail.com",
            contrasenya: "migui1234",
            idTipoUsuario: 1,
            telefono: "612783920",
            nombre: "Migui Alvarez Nistal"
        }

        laLogica.darDeAltaUsuario(jsonMalo, function (err, result) {
            assert.notEqual(err, null);
            hecho();
        })

    }) //it
})
describe('Inserción de datos en la BD Medidas', function () {

    it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function (hecho) {

        let elJsonBueno = {

            valorMedido: 150,
            tiempo: 155555643123,
            latitud: 193.2,
            longitud: 176.2,
            idTipoMedida: 1,
            temperatura: 23,
            humedad: 45
        }

        laLogica.guardarMedida(elJsonBueno, function (err, result) {

            assert.equal(elJsonBueno.valorMedido, 150);
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


describe('Calculo de distancias', function () {
    it('Vamos a pasarle un json con latitudes y longitudes y calcular la distancia', async function () {

        let listaPosiciones = [{
                latitud: 10.0,
                longitud: 10.0
            },
            {
                latitud: 70.0,
                longitud: 40.0
            }
        ]

        let distancia = laLogica.calcularDistancia(listaPosiciones)

        assert.equal(distancia, 6994)
    })
})

describe('Estimación calidad del aire media respirada', function () {

    let horaInicio = 1575389711221;
    let horaFinal = 1575389711221 + (2 * 3600000); // + 2 horas
    let ubicacion1 = {
        latitud: 38,
        longitud: -0.17
    }

    let ubicacion2 = {
        latitud: 38.6,
        longitud: -0.20
    }

    let ubicacion3 = {
        latitud: 39,
        longitud: -0.23
    }

    let ubicaciones = [ubicacion1, ubicacion2, ubicacion3];

    let json = {
        puntosRuta: ubicaciones,
        horaInicio: horaInicio,
        horaFinal: horaFinal
    }

    it('Pruebo el método para estimar la calidad del aire segun ruta recorrida y tiempo tomado', function(hecho){
        laLogica.calidadDelAireMediaRespirada(json, function(err,res){
            assert.equal(err,null, 'Ha habido un error estimando la calidad del aire: ' + err);
            assert.equal(res, 162.60927321885924, 'No coincide el resultado con el esperado: ' + res);
            hecho();
        })
    })//

}) //Describe