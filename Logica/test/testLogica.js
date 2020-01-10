//------------------------------------------------------------------------------------------
// testLogica.js
// Equipo 4
// Brian, Carlos Tortosa, Carlos Canut, Oscar, Alejandro
// copyright
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');
const kriging = require('@sakitam-gis/kriging');

//------------------------------------------------------------------------------------------
var laLogica = new Logica('./test/copiaDeLaBD.db');


//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
describe('Obtención de datos de la BD Medidas', function() {

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Extraigo la ultima medida de la BD sin error', async function() {

    await laLogica.getUltimaMedida(function(err, res) {
      assert.equal(res.length, 1)
      assert.equal(res[0].idMedida, 566)
      assert.equal(res[0].idUsuario, "canut@gmail.com")
    }) //getUltimaMedida

  }) //it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Extraigo todas las medidas de la BD Mediciones sin error', async function() {

    await laLogica.getAllMedidas(function(err, res) {
      assert.equal(res.length, 100)
    }) //getUltimaMedida

  }) //it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Extraigo todas las medidas de ozono de la BD Mediciones sin error', async function() {

    await laLogica.getAllOzono(function(err, res) {
      assert.equal(res.length, 100)
    }) //getUltimaMedida

  }) //it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Obtener las medidas que se publicaron dentro de un intervalo de tiempo', function(hecho) {

    let fecha = 1575388147733; // Tue Dec 03 2019 16:49:07

    let intervalo = 24; // 24 horas

    let json = {
      fecha: fecha,
      ventanaDeHoras: intervalo
    }

    laLogica.getMedidasDeIntervaloConcreto(json, function(err, res) {
      assert.equal(err, null, 'Ha habido un error buscando medidas dentro de intervalo: ' + err);
      assert.notStrictEqual(res, null, 'No he recibido las medidas dentro de intervalo del servidor');
      assert.strictEqual(res.length, 100, 'No hay 100 medidas dentro del intervalo: ' + res.length);
      hecho();
    })

  }) //it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Compruebo que el método de getMediasDeIntervaloConcreto maneja los errores', function(hecho) {
    laLogica.getMedidasDeIntervaloConcreto({
      algo: 'incorrecto'
    }, function(err, res) {
      assert.notStrictEqual(err, null, '¿Ha habido algun error?: ' + err);
      hecho();
    })
  }) //it
  //------------------------------------------------------------------------------------------

}) //Describe
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
describe('Obtención de datos de la BD Usuarios y Sensores', function() {

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Busco información de usuario', async function() {

    let usuario = "briancalabuig@gmail.com"

    await laLogica.buscarUsuario(usuario, function(err, res) {
      assert.equal(res[0].telefono, "664410457")
      assert.equal(res[0].descripcion, "Basurero")
    })
  }) //it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Busco información de sensor', async function() {

    let sensor = 1

    await laLogica.buscarSensor(sensor, function(err, res) {
      assert.equal(res[0].descripcion, "Ozono")
    })
  }) //it
  //------------------------------------------------------------------------------------------

}) //describe
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
describe('Inserción de datos en la BD sensor', function() {

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function(hecho) {

    let elJsonBueno = {
      idSensor: 10,
      idTipoSensor: 1,
      idUsuario: "bri"
    }

    laLogica.darDeAltaSensor(elJsonBueno, function(err, result) {


      assert.equal(elJsonBueno.idTipoSensor, 1);
      assert.equal(elJsonBueno.idUsuario, "bri");
      hecho();
    })

  }) //it
  //------------------------------------------------------------------------------------------

}) //describe
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
describe('Inserción de datos en la BD Usuario', function() {

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function(hecho) {

    let elJsonBueno = {

      idUsuario: "migui@gmail.com",
      contrasenya: "migui1234",
      idTipoUsuario: 1,
      telefono: "612783920",
      nombre: "Migui Alvarez Nistal"
    }

    laLogica.darDeAltaUsuario(elJsonBueno, function(err, result) {


      assert.equal(elJsonBueno.idUsuario, "migui@gmail.com");
      hecho();
    }) //it
    //------------------------------------------------------------------------------------------

  }) //describe
  //------------------------------------------------------------------------------------------


  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Pruebo a insertar un email ya registrado y compruebo que no me deja', function(hecho) {

    let jsonMalo = {

      idUsuario: "migui@gmail.com",
      contrasenya: "migui1234",
      idTipoUsuario: 1,
      telefono: "612783920",
      nombre: "Migui Alvarez Nistal"
    }

    laLogica.darDeAltaUsuario(jsonMalo, function(err, result) {
      assert.notEqual(err, null);
      hecho();
    })

  }) //it
  //------------------------------------------------------------------------------------------
}) //describe
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
describe('Inserción de datos en la BD Medidas', function() {

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Examino que el json tiene todos los campos que necesito y guarda los datos si son validos', function(hecho) {

    let elJsonBueno = {

      valorMedido: 150,
      tiempo: 155555643123,
      latitud: 193.2,
      longitud: 176.2,
      idTipoMedida: 1,
      temperatura: 23,
      humedad: 45
    }

    laLogica.guardarMedida(elJsonBueno, function(err, result) {

      assert.equal(elJsonBueno.valorMedido, 150);
      hecho();
    })

  }) //in
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Pruebo a darle un json no valido y compruebo que responde acorde', function(hecho) {

    let jsonMalo = {
      idTipoMedida: 'algo',
      otraCosa: 'que no tiene nada que ver',
      latitud: 145,
      idUsuario: null
    }

    laLogica.guardarMedida(jsonMalo, function(err, result) {
      assert.notEqual(err, null, '¿Lo ha guardado? ' + result);
      hecho();
    })

  }) //it
  //------------------------------------------------------------------------------------------

}) //describe
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
describe('Calculo de distancias', function() {
  it('Vamos a pasarle un json con latitudes y longitudes y calcular la distancia', async function() {

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
  }) //it
  //------------------------------------------------------------------------------------------
}) //describe
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
describe('Estimación calidad del aire media respirada', function() {

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

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Pruebo el método para estimar la calidad del aire segun ruta recorrida y tiempo tomado', function(hecho) {
    laLogica.getValoracionCalidadAire(json, function(err, res) {
      assert.equal(err, null, 'Ha habido un error estimando la calidad del aire: ' + err);
      assert.equal(res, 1, 'Ha dado algo diferente?: ' + res);
      hecho();
    })
  }) //it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Pruebo que maneja bien entrega incorrecta de datos', function(hecho) {
    laLogica.getValoracionCalidadAire({
      algo: 'Incorrecto'
    }, function(err, res) {
      assert.notEqual(err, null, 'No ha habido error, ¿lo ha ejecutado?: ' + res);
      hecho();
    })
  }) //it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Prueno el método de estimar la calidad del aire recorrido por camiones', function(hecho) {
    laLogica.getValoracionCalidadAireJornada({
      idUsuario: 'canut@gmail.com',
      horaInicio: 1575388147734,
      horaFinal: 1575388147735
    }, function(err, res) {
      assert.equal(err, null, 'Ha habido un error en la calidad del aire por camiones: ' + err);
      assert.equal(res, 3, '¿Ha dado algo imprevisto?: ' + res);
      hecho();
    })

  }) //it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  it('Pruebo que el método de calidad del aire de camiones maneja malos requests bien', function(hecho) {
    laLogica.getValoracionCalidadAireJornada({
      Algo: 'incorrecto'
    }, function(err, res) {
      assert.notEqual(err, null, '¿Lo ha procesado pese a estar mal?: ' + res);
      hecho();
    })
  }) //it
  //------------------------------------------------------------------------------------------
}) //Describe
//------------------------------------------------------------------------------------------
