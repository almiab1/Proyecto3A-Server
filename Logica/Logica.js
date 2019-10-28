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
        this.laConexionBD = new ConexionBD(nombreBD, function (err) {
            console.log("Me conecto a la BD desde la logica");
            if (err) console.error(err);
        });
    } //constructor

    cerrar() {
        this.laConexionBD.cerrar();
    }
    //////////////////////////////////////
    /*
        void  --> getUltimaMedida()  --> callback
    */
    getUltimaMedida(callback) {

        let sql = "SELECT * FROM Medidas WHERE tiempo=(SELECT MAX(tiempo) FROM Medidas);";
        this.laConexionBD.consultar(sql, function (err, rows) {

            if (err) {
                callback(err, null);
                return;
            } //Si salta error no sigo

            if (rows.length == 0 || rows === undefined || rows === null) {
                callback("Sin resultados", null);
                return;
            } //Si no ha encontrado nada tampoco continuo

            callback(null, rows[0]);

        }); //consultar

    } //getUltimaMedida()



    //////////////////////////////////////
    /*
        JSON  --> guardarMedida() --> callback
    */
    guardarMedida(json, callback) {

        if (!this.elJsonTieneTodosLosCamposRequeridos(json)) {
            callback('JSON incompleto', null); //Mal request
            return;
        }


        let datos = {
            $idTipoMedida : json.idTipoMedida,
            $valorMedido : json.valorMedido,
            $tiempo : json.tiempo,
            $latitud : json.latitud,
            $longitud : json.longitud,
            $idUsuario : json.idUsuario
        }


        let textoSQL = 'INSERT INTO Medidas (idTipoMedida, valorMedido, tiempo, latitud, longitud, idUsuario) VALUES ($idTipoMedida, $valorMedido, $tiempo, $latitud, $longitud, $idUsuario);';
        this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);

    } //guardarMedida()


    elJsonTieneTodosLosCamposRequeridos(json) {

        let propiedades = ['idTipoMedida', 'valorMedido', 'tiempo', 'latitud', 'longitud', 'idUsuario'];
        let errCounter = 0;

        propiedades.forEach(function (key) {

            //Si uno de los campos no está en el JSON o su valor es null no lo considero bueno
            if(json[key] === undefined || json[key] === null) {
                errCounter++;
            }
           
        });

        return errCounter === 0;


    }//camposRequeridos


    ////////////////////////////////////
    /*
        void -> borrarUltimaMedida() --> callback
    */

    borrarUltimaMedida(callback){

        let sql = 'DELETE FROM Medidas WHERE idMedida=(SELECT MAX(idMedida) FROM Medidas);'

        this.laConexionBD.modificar(sql,function(err,res){
            callback(err,res);
        })

    }

}