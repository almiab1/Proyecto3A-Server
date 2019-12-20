const Logica = require('./Logica.js');

var laLogica = new Logica('./baseDeDatos.db');

laLogica.getMedidasDeIntervaloConcreto({ fecha: 1576835820967, ventanaDeHoras: 12 }, function(err, res) {
    console.error(err);
    console.log(res);
})