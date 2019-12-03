const mocha = require('mocha');
const Logica = require('../Logica');
const assert = require('assert');

const laLogica = new Logica('copiaDeLaBD.db');

let medida1 = {
    latitud: 1,
    longitud: 2,
    valorMedido: 3
}
let medida2 = {
    latitud: 2,
    longitud: -1,
    valorMedido: 6
}

let medida3 = {
    latitud: 1.5,
    longitud: 2.3,
    valorMedido: 2
}


let medidas = [medida1, medida2, medida3];

laLogica.calidadDelAireMediaRespirada(medidas, function(err, res){
    if(err) {
        console.error(err);
    } else {
        console.log(res);
    }
});