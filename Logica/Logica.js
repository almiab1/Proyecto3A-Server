/*
    Carlos Tortosa Micó
*/
const ConexionBD = require('./ConexionBD');
module.exports = class Logica {

    /* En parte privada tenemos:
        laConexionDB --> Objeto de la biblioteca de sqlite con los métodos de acceso
    */

    //////////////////////////////////////
    //Constructores
    //////////////////////////////////////
    constructor(nombreBD) {
        this.laConexionBD = new ConexionBD(nombreBD, function(err){
            console.log("Me conecto a la BD desde la logica");
            if(err) console.error(err);
        });
    } //constructor

    cerrar() {
        this.laConexionBD.cerrar();
    }
    //////////////////////////////////////
    /*
        Request,[Response  --> getUltimaMedida()
    */
    getUltimaMedida(callback) {

        let sql = "SELECT * FROM Medidas WHERE tiempo=(SELECT MAX(tiempo) FROM Medidas);";
        this.laConexionBD.consultar(sql, function (err, rows) {

            if (err) {
                callback(err,null);
                return;
            } //Si salta error no sigo

            if (rows.length == 0 || rows === undefined || rows === null) {
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