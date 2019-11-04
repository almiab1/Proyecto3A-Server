const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');

var laLogica = new Logica('./test/copiaDeLaBD.db');



describe('Obtención de datos de la BD Medidas', function () {

    it('Extraigo la ultima medida de la BD sin error', async function () {

          await laLogica.getUltimaMedida(function (err, res) {
              assert.equal(res.length, 1)
              assert.equal(res[0].idMedida, 10)
              assert.equal(res[0].idUsuario, "a@gmail.com")
        }) //getUltimaMedida

    }) //it

    it('Extraigo todas las medidas de la BD Mediciones sin error', async function () {

          await laLogica.getAllMedidas(function (err, res) {
            assert.equal(res.length, 6)
        }) //getUltimaMedida

    }) //it

    it('Extraigo todas las medidas de ozono de la BD Mediciones sin error', async function () {

          await laLogica.getAllOzono(function (err, res) {
            assert.equal(res.length, 6)
        }) //getUltimaMedida

    }) //it

}) //Describe


describe('Obtención de datos de la BD Usuarios y Sensores', function(){
  it('Busco información de usuario', async function(){

    let usuario = "briancalabuig@gmail.com"

    await laLogica.buscarUsuario(usuario, function(err, res){
      assert.equal(res[0].telefono, "664410457")
      assert.equal(res[0].descripcion, "Basurero")
    })
  })

  it('Busco información de sensor', async function(){

    let sensor = 1

    await laLogica.buscarSensor(sensor, function(err, res){
      assert.equal(res[0].descripcion, "Ozono")
    })
  })
})

describe('Obtención de los tiempos y posiciones de un usuario y su distancia recorrida', function(){

  it('Busco los tiempos de un usuario', async function(){

    let usuario = "a@gmail.com"

    await laLogica.obtenerTiempoUsuario(usuario, function(err, res){
      assert.equal(res.length, 1)
      assert.equal(res[0].tiempo, 8439792)
    })
  })

  it('Busco las posiciones de un usuario', async function(){

    let usuario = "a@gmail.com"

    await laLogica.obtenerPosicionesUsuario(usuario, function(err, res){
      assert.equal(res.length, 1)
      assert.equal(res[0].latitud, 345310)
      assert.equal(res[0].longitud, 4350320)
    })
  })

  it('calculo la distancia de un usuario', async function(){

    let listaPosiciones = [ { latitud: 745320, longitud: 4320750 },
  { latitud: 345310, longitud: 4350320 } ]

    await laLogica.calcularDistancia(listaPosiciones, function(err, res){
      assert.equal(res, 401.101)
    })
  })
})

describe('Inserción de datos en la BD sensor', function () {

    it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function (hecho) {

        let elJsonBueno = { idSensor: 10, idTipoSensor: 1, idUsuario:"bri"}

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
            telefono: "612783920"
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
          telefono: "612783920"
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

describe('Borrar Usuario y Sensor', function () {

    it('Insertamos un usuario y posteriormente lo borramos', async function () {

        let elJsonBueno = {

            idUsuario: "migui2@gmail.com",
            contrasenya: "migui1234",
            idTipoUsuario: 1,
            telefono: "612783920"
        }

        await laLogica.darDeAltaUsuario(elJsonBueno, function (err, result) {


            assert.equal(elJsonBueno.idUsuario, "migui2@gmail.com");

        })

        let datos1 = {
          idUsuario: "migui2@gmail.com"
        }

        await laLogica.darDeBajaUsuario(datos1, function(err, res){

        })

        await laLogica.buscarUsuario("migui2@gmail.com", function(err, res){
          assert.equal(res, [])
        })


    })

    it('Insertamos un sensor y posteriormente lo borramos', async function () {

        let elJsonBueno = {

            idSensor: 190,
            idTipoSensor: 1,
            idUsuario: "briancalabuig@gmail.com"
        }

        await laLogica.darDeAltaSensor(elJsonBueno, function (err, result) {


            assert.equal(elJsonBueno.idSensor, 190);

        })

        let datos2 = {
          idSensor: 190
        }

        await laLogica.darDeBajaSensor(datos2, function(err, res){

        })

        await laLogica.buscarSensor(190, function(err, res){
          assert.equal(res, [])
        })


    })

}) //describe
