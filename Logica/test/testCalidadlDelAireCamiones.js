const Logica = require('../Logica');

const laLogica = new Logica('./copiaDeLaBD.db');

laLogica.calidadDelAireCamiones({
    idUsuario: 'canut@gmail.com',
    horaInicio: 1575388147734,
    horaFinal: 1575388147735
}, function(err, res) {
    if (err) console.error(err);
    console.log(res);
})