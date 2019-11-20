//------------------------------------------------------------------------------------------
// requires
//------------------------------------------------------------------------------------------
const express = require('express')
const Logica = require('./Logica');


//------------------------------------------------------------------------------------------
// constructor objeto LogicaDeNegocio
//------------------------------------------------------------------------------------------
LogicaDeNegocio = new Logica('./baseDeDatos.db');


//----------------------------------------------------------------------------
//método para rellenar bd
//----------------------------------------------------------------------------
async function scriptParaRellenarBaseDatos(){

  var date = new Date()
  var tiempo = date.getTime()

  var medida = 0;

  var latitud = 38.900
  var longitud = -0.200

  for (var i = 0; i < 10; i++) {

    tiempo = new Date().getTime()

    medida = Math.floor(Math.random() * 100) + 15;

    latitud = latitud + 0.001
    longitud = longitud + 0.0001

    var json ={
      valorMedido: medida,
      tiempo: tiempo,
      latitud: latitud,
      longitud: longitud,
      idUsuario: "briancalabuig@gmail.com",
      idTipoMedida: 1,
      idSensor: 1,
      temperatura: 20,
      humedad: 66
    }

    await LogicaDeNegocio.guardarMedida(json, function(err, res){

    })

  }//for

}

//----------------------------------------------------------------------------
//llamada función
//----------------------------------------------------------------------------
scriptParaRellenarBaseDatos()
