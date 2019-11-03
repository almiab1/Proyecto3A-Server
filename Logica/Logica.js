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


    // ---------------------------------------------------
    // getAllMedidas() 
    // ---------------------------------------------------
    getAllMedidas(callback){

        let sql = "SELECT * FROM Medidas";
        // Realizar una consulta a la base de datos, meter todas las medidas en un objeto y pasarlo por el segundo campo del callback
        this.laConexionBD.consultar(sql, function (err, rows){

            // Si hay error o está vacio se manda el error
            if(err){
                callback(err, null);
                return;
            }
            if(rows.length == 0 || rows === undefined || rows === null){
                callback("Sin resultados", null);
                return;
            } //

            callback(null, rows);
        })
    } // getAllMedidas()

    // ---------------------------------------------------
    // getAllOzono() 
    // ---------------------------------------------------
    getAllOzono(callback){

        let sql = "SELECT idMedida, valorMedido, latitud, longitud, tiempo FROM Medidas";
        // Realizar una consulta a la base de datos, meter todas las medidas en un objeto y pasarlo por el segundo campo del callback
        this.laConexionBD.consultar(sql, function (err, rows){

            // Si hay error o está vacio se manda el error
            if(err){
                callback(err, null);
                return;
            }
            if(rows.length == 0 || rows === undefined || rows === null){
                callback("Sin resultados", null);
                return;
            } //

            callback(null, rows);
        })
    } // getAllOzono()



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

            $valorMedido : json.valorMedido,
            $tiempo : json.tiempo,
            $latitud : json.latitud,
            $longitud : json.longitud,
            $idUsuario : json.idUsuario,
            $idTipoMedida : json.idTipoMedida,
            $idSensor: json.idSensor,
            $temperatura: json.temperatura,
            $humedad: json.humedad
        }


        let textoSQL = 'INSERT INTO Medidas (valorMedido, tiempo, latitud, longitud, idUsuario, idTipoMedida, idSensor, temperatura, humedad) VALUES ($valorMedido, $tiempo, $latitud, $longitud, $idUsuario, $idTipoMedida, $idSensor, $temperatura, $humedad);';
        this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);

    } //guardarMedida()


    elJsonTieneTodosLosCamposRequeridos(json) {

        let propiedades = ['valorMedido', 'tiempo', 'latitud', 'longitud', 'idUsuario', 'idTipoMedida', 'idSensor', 'temperatura', 'humedad'];
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


//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// Métodos implementados por Brian Calabuig
// 30-10-19
//------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------
// json{idCorreo: texto, password: texto < 8 char, idTipoUsuario: Z, telefono: texto }
// -->
// darDeAltaUsuario()
// -->
//
//------------------------------------------------------------------------------------------
    darDeAltaUsuario(json, callback){

      if (!this.elJsonTieneTodosLosCamposRequeridosUsuario(json)) {
          callback('JSON incompleto', null); //Mal request
          return;
      }

      let datos = {
        $idUsuario: json.idUsuario,
        $contrasenya: json.contrasenya,
        $idTipoUsuario: json.idTipoUsuario,
        $telefono: json.telefono
      }

      let textoSQL = 'INSERT INTO Usuarios (idUsuario, contrasenya, idTipoUsuario, telefono) VALUES ($idUsuario, $contrasenya, $idTipoUsuario, $telefono);'

      this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);
    }//()
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
    elJsonTieneTodosLosCamposRequeridosUsuario(json) {

        let propiedades = ['idUsuario', 'contrasenya', 'idTipoUsuario', 'telefono'];
        let errCounter = 0;

        propiedades.forEach(function (key) {

            //Si uno de los campos no está en el JSON o su valor es null no lo considero bueno
            if(json[key] === undefined || json[key] === null) {
                errCounter++;
            }

        });

        return errCounter === 0;


    }//camposRequeridosUsuario
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// json{idTipoSensor: Z}
// -->
// darDeAltaSensor()
// -->
//
//------------------------------------------------------------------------------------------
    darDeAltaSensor(json, callback){

      let datos = {
        $idSensor: json.idSensor,
        $idTipoSensor: json.idTipoSensor
      }

      let textoSQL = 'INSERT INTO Sensores (idSensor, idTipoSensor) VALUES ($idSensor, $idTipoSensor);'

      this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);

    }
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// json{idUsuario: texto, idSensor: Z}
// -->
// asociarSensorAUsuario()
// -->
//
//------------------------------------------------------------------------------------------
    asociarSensorAUsuario(json, callback){

      let datos = {
        $idUsuario: json.idUsuario,
        $idSensor: json.idSensor
      }

      let textoSQL = 'INSERT INTO SensoresUsuarios (idUsuario, idSensor) VALUES ($idUsuario, $idSensor);'

      this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);
    }
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// json{idUsuario: texto}
// -->
// darDeBajaUsuario()
// -->
//
//------------------------------------------------------------------------------------------
    darDeBajaUsuario(json, callback){

      let datos = {
        $idUsuario: json.idUsuario
      }

      let texto = 'DELETE FROM Usuarios WHERE idUsuario=$idUsuario;'

      this.laConexionBD.modificarConPrepared(texto, datos, callback);
    }
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
// json{idSensor: texto}
// -->
// darDeBajaSensor()
// -->
//
//------------------------------------------------------------------------------------------
    darDeBajaSensor(json, callback){

      let datos = {
        $idSensor: json.idSensor
      }

      let textoSQL = 'DELETE FROM Sensores WHERE idSensor=$idSensor;'

      this.laConexionBD.modificarConPrepared(textoSQL, datos, callback); //consultar
    }
}
