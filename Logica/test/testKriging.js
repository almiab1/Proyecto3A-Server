const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');

const laLogica = new Logica('copiaDeLaBD.db');

let medida1 = {
    latitud: 31,
    longitud: 32,
    valorMedido: 3
}
let medida2 = {
    latitud: 37,
    longitud: 31,
    valorMedido: 6
}

let medida3 = {
    latitud: 38.5,
    longitud: 33,
    valorMedido: 2
}


let medidas = [medida1, medida2, medida3];

let json = {
    ubicaciones: medidas,
    horaInicio: 1575389711221,
    horaFinal: 1575389711221 + (2 * 3600 * 1000)
}

laLogica.calidadDelAireMediaRespirada(json, function(err, res){
    if(err) {
        console.error(err);
    } else {
        console.log(res);
    }
});