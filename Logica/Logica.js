/*
    Carlos Tortosa Micó
*/
const ConexionBD = require('./ConexionBD');
module.exports = class Logica {

    /* En parte privada tenemos:
        db --> Objeto de la biblioteca de mysql con los métodos de acceso
        dbSettings -> Usado para crear el db con los parámetros que queremos
    */

    //////////////////////////////////////
    //Constructores
    //////////////////////////////////////
    constructor(nombreBD, callback) {
        this.laConexionBD = new ConexionBD(nombreBD, callback);
    } //constructor

    cerrar() {
        this.laConexionBD.cerrar();
    }
    //////////////////////////////////////
    /*
        Request,[Response  --> getUltimaMedida()
    */
    getUltimaMedida(callback) {

        let sql = "SELECT * FROM Medidas WHERE Tiempo=(SELECT MAX(Tiempo) FROM Medidas)";
        this.laConexionBD.consultar(sql, function (err, rows) {

            if (err) {
                callback(err,null);
                return;
            } //Si salta error no sigo

            if (row.length == 0 || row === undefined || row === null) {
                callback("Sin resultados", null);
                return;
            }

            callback(null, JSON.stringify(rows[0]));

        });//consultar

    } //getUltimaMedida()



    //////////////////////////////////////
    /*
        [Request],[Response]  --> [guardarMedida()] 
    */
    guardarMedida(req, res) {
    } //guardarMedida()

}