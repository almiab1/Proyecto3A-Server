//------------------------------------------------------------------------------------------
// testEstadoSensor.js
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
//------------------------------------------------------------------------------------------

var laLogica = new Logica('./test/copiaDeLaBD1.db');

//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
describe('Prueba método dameListaSensoresConSuUltimaMedida()', function(){

  //------------------------------------------------------------------------------------------
  // prueba 1
  //------------------------------------------------------------------------------------------
  it('Compruebo que teniendo 1hora de tiempo límite saca un sensor inactivo', async function(){

    let unaHoraEnMilis = 3600000;

    let lista = await laLogica.dameTodosSensoresConSuUltimaMedida();

    console.log(lista);

    let sensoresInactivos = await laLogica.dameListaSensoresInactivos(unaHoraEnMilis, lista)

    console.log(sensoresInactivos);

    assert.equal(sensoresInactivos.length, 1);
    assert.equal(sensoresInactivos[0], 2)

  })//it
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //prueba 2
  //------------------------------------------------------------------------------------------
  it('Compruebo que teniendo 30 minutos de tiempo límite saca dos sensores inactivos', async function(){

    let mediaHoraEnMilis = 3600000/2;

    let lista = await laLogica.dameTodosSensoresConSuUltimaMedida();

    console.log(lista);

    let sensoresInactivos = await laLogica.dameListaSensoresInactivos(mediaHoraEnMilis, lista)

    console.log(sensoresInactivos);

    assert.equal(sensoresInactivos.length, 2)
    assert.equal(sensoresInactivos[0], 1)
    assert.equal(sensoresInactivos[1], 2)

  })//it
  //------------------------------------------------------------------------------------------

})
//------------------------------------------------------------------------------------------
