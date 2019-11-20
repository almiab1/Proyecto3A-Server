
// --------------------------------------------------
//  dependencies
// --------------------------------------------------
const jwt = require('jsonwebtoken')
const jsdom = require('jsdom')
const {JSDOM} = jsdom
//  /dependencies
// --------------------------------------------------

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
    this.laConexionBD = new ConexionBD(nombreBD, function(err) {
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

  //----------------------------------------------------------------------------
  //métodos medidas
  //----------------------------------------------------------------------------
  getUltimaMedida(callback) {

    let sql = "SELECT * FROM Medidas ORDER BY tiempo DESC LIMIT 1;";
    //let sql = "SELECT * FROM Medidas WHERE tiempo=(SELECT MAX(tiempo) FROM Medidas);";
    this.laConexionBD.consultar(sql, function(err, rows) {

      if (err) {
        callback(err, null);
        return;
      } //Si salta error no sigo

      if (rows.length == 0 || rows === undefined || rows === null) {
        callback("Sin resultados", null);
        return;
      } //Si no ha encontrado nada tampoco continuo


      callback(null, rows);

    }); //consultar

  } //getUltimaMedida()


  // ---------------------------------------------------
  // Método implementado por Carlos Canut 3-11-19
  // ->
  // getAllMedidas()
  // ->
  // json{idMedida: Z, valorMedido: Z, latitud: R, longitud: R, tiempo: Z, temperatura: Z, humedad: Z, idTipoMedida: Z, idUsuario: texto, idSensor: Z}
  // ---------------------------------------------------
  getAllMedidas(callback) {

    let sql = "SELECT * FROM Medidas ORDER BY tiempo DESC";
    // Realizar una consulta a la base de datos, meter todas las medidas en un objeto y pasarlo por el segundo campo del callback
    this.laConexionBD.consultar(sql, function(err, rows) {

      // Si hay error o está vacio se manda el error
      if (err) {
        callback(err, null);
        return;
      }
      if (rows.length == 0 || rows === undefined || rows === null) {
        callback("Sin resultados", null);
        return;
      } //

      callback(null, rows);
    })
  } // getAllMedidas()

  // ---------------------------------------------------
  // Método implementado por Carlos Canut 3-11-19
  // ->
  // getAllOzono()
  // ->
  // json{idMedida: Z, valorMedido: Z, latitud: R, longitud: R, tiempo: Z}
  // ---------------------------------------------------
  getAllOzono(callback) {

    let sql = "SELECT idMedida, valorMedido, latitud, longitud, tiempo FROM Medidas";
    // Realizar una consulta a la base de datos, meter todas las medidas en un objeto y pasarlo por el segundo campo del callback
    this.laConexionBD.consultar(sql, function(err, rows) {

      // Si hay error o está vacio se manda el error
      if (err) {
        callback(err, null);
        return;
      }
      if (rows.length == 0 || rows === undefined || rows === null) {
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

      $valorMedido: json.valorMedido,
      $tiempo: json.tiempo,
      $latitud: json.latitud,
      $longitud: json.longitud,
      $idUsuario: json.idUsuario,
      $idTipoMedida: json.idTipoMedida,
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

    propiedades.forEach(function(key) {

      //Si uno de los campos no está en el JSON o su valor es null no lo considero bueno
      if (json[key] === undefined || json[key] === null) {
        errCounter++;
      }

    });

    return errCounter === 0;


  } //camposRequeridos


  ////////////////////////////////////
  /*
      void -> borrarUltimaMedida() --> callback
  */

  borrarUltimaMedida(callback) {

    let sql = 'DELETE FROM Medidas WHERE idMedida=(SELECT MAX(idMedida) FROM Medidas);'

    this.laConexionBD.modificar(sql, function(err, res) {
      callback(err, res);
    })

  }

  //----------------------------------------------------------------------------
  //métodos usuario
  //----------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // Métodos implementados por Brian Calabuig
  // 30-10-19
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  // json{idUsuario: texto, contrasenya: texto < 8 char, idTipoUsuario: Z, telefono: texto }
  // -->
  // darDeAltaUsuario()
  // -->
  //
  //------------------------------------------------------------------------------------------
  darDeAltaUsuario(json, callback) {

    if (!this.elJsonTieneTodosLosCamposRequeridosUsuario(json)) {
      callback('JSON incompleto', null); //Mal request
      return;
    }

    let datos = {
      $idUsuario: json.idUsuario,
      $contrasenya: json.contrasenya,
      $idTipoUsuario: json.idTipoUsuario,
      $telefono: json.telefono,
      $nombre: json.nombre
    }

    let textoSQL = 'INSERT INTO Usuarios (idUsuario, contrasenya, idTipoUsuario, telefono, nombre) VALUES ($idUsuario, $contrasenya, $idTipoUsuario, $telefono, $nombre);'

    this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);
  } //()
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  elJsonTieneTodosLosCamposRequeridosUsuario(json) {

    let propiedades = ['idUsuario', 'contrasenya', 'idTipoUsuario', 'telefono', 'nombre'];
    let errCounter = 0;

    propiedades.forEach(function(key) {

      //Si uno de los campos no está en el JSON o su valor es null no lo considero bueno
      if (json[key] === undefined || json[key] === null) {
        errCounter++;
      }

    });

    return errCounter === 0;


  } //camposRequeridosUsuario
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // json{idUsuario: texto}
  // -->
  // darDeBajaUsuario()
  // -->
  //
  //------------------------------------------------------------------------------------------
  darDeBajaUsuario(json, callback) {

    let datos = {
      $idUsuario: json.idUsuario
    }

    let texto = 'DELETE FROM Usuarios WHERE idUsuario=$idUsuario;'

    this.laConexionBD.modificarConPrepared(texto, datos, callback);
  }
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // json{idUsuario: texto, contrasenya: texto}
  // -->
  // cambiarContrasenya()
  // -->
  //
  //------------------------------------------------------------------------------------------
  cambiarContrasenya(json, callback){

    let datos = {
      $idUsuario: json.idUsuario,
      $contrasenya: json.contrasenya
    }

    let textoSQL = 'UPDATE Usuarios SET contrasenya=$contrasenya WHERE idUsuario=$idUsuario;'

    this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);
  }
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // idUsuario: texto
  // -->
  // buscarUsuario()
  // -->
  // json{idUsuario: texto, TipoUsuario: texto, telefono: texto }
  //------------------------------------------------------------------------------------------
  buscarUsuario(usuario, callback){

    let datos = {
      $idUsuario: usuario
    }

    let textoSQL = 'SELECT Usuarios.idUsuario, Usuarios.telefono, Usuarios.nombre, TipoUsuarios.descripcion, SensoresUsuarios.idSensor FROM Usuarios, TipoUsuarios, SensoresUsuarios WHERE Usuarios.idUsuario=$idUsuario AND Usuarios.idTipoUsuario=TipoUsuarios.idTipoUsuario AND SensoresUsuarios.idUsuario=$idUsuario;'

    this.laConexionBD.consultarConPrepared(textoSQL, datos, callback);

  }
  // ---------------------------------------------------
  // Método implementado por Carlos Canut 4-11-19
  // ->
  // getUsuarios()
  // ->
  // json{ idUsuario:Text, telefono:Text , descripcion:Text, idSensor: Int }
  // ---------------------------------------------------
  getUsuarios(callback) {

    let sql = "SELECT Usuarios.idUsuario, Usuarios.telefono, Usuarios.nombre, TipoUsuarios.descripcion, SensoresUsuarios.idSensor FROM Usuarios, TipoUsuarios, SensoresUsuarios WHERE Usuarios.idTipoUsuario = TipoUsuarios.idTipoUsuario AND Usuarios.idUsuario = SensoresUsuarios.idUsuario;"
    // Realizar una consulta a la base de datos, meter todas las medidas en un objeto y pasarlo por el segundo campo del callback
    this.laConexionBD.consultar(sql, function(err, rows) {

      // Si hay error o está vacio se manda el error
      if (err) {
        callback(err, null);
        return;
      }
      if (rows.length == 0 || rows === undefined || rows === null) {
        callback("Sin resultados", null);
        return;
      } //

      callback(null, rows);
    })
  } // getUsuarios()
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // idUsuario: texto
  // -->
  // obtenerPosicionesYTiempoUsuario()
  // -->
  // json{latitud: R, longitud: R, tiempo: R}
  //------------------------------------------------------------------------------------------
  obtenerPosicionesYTiempoUsuario(usuario, callback){

    let datos = {
      $idUsuario: usuario
    }

    let textoSQL = 'SELECT Medidas.latitud, Medidas.longitud, Medidas.tiempo FROM Medidas WHERE idUsuario=$idUsuario;'
  //SELECT Medidas.latitud, Medidas.longitud FROM Medidas WHERE Medidas.tiempo >= datetime('now','-1 day')
    this.laConexionBD.consultarConPrepared(textoSQL, datos, callback);

  }
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // listaPosiciones: posicion{latitud: R, longitud: R}
  // -->
  // calcularDistancia()
  // -->
  // distancia: R
  //------------------------------------------------------------------------------------------
  calcularDistancia(listaPosiciones){

    var distanciaTotal = 0;

    for (let i = 0; i < listaPosiciones.length; i++) {
      if (i < listaPosiciones.length - 1) {

        let senoLatitudOrigen = Math.sin((listaPosiciones[i].latitud * 2 * Math.PI) / 360)
        let senoLatitudDestino = Math.sin((listaPosiciones[i+1].latitud * 2 * Math.PI) / 360)
        let cosenoLatitudOrigen = Math.cos((listaPosiciones[i].latitud * 2 * Math.PI) / 360)
        let cosenoLatitudDestino = Math.cos((listaPosiciones[i+1].latitud * 2 * Math.PI) / 360)
        let incrementoLongitud = listaPosiciones[i+1].longitud - listaPosiciones[i].longitud
        let cosenoLongitud = Math.cos((incrementoLongitud * 2 * Math.PI) / 360)

        let multiplicacionSenos = senoLatitudOrigen * senoLatitudDestino
        let multiplicacionCosenos = cosenoLatitudOrigen * cosenoLatitudDestino * cosenoLongitud
        let distanciaAngular = Math.acos(multiplicacionSenos + multiplicacionCosenos) * 360 / (2*Math.PI)

        let distanciaEnKm = distanciaAngular * 111.11;

        distanciaTotal = Math.round(distanciaTotal + distanciaEnKm)
      }//if
    }//for

    return distanciaTotal
  }//calcularDistancia()
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // listaPosiciones: posicion{tiempo: R}
  // -->
  // calcularActividad()
  // -->
  // resultado: T/F
  //------------------------------------------------------------------------------------------
  calcularActividad(listaTiempos){

    if (listaTiempos.length < 48) {
      return false;
    }

    return true;
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
  asociarSensorAUsuario(json, callback) {

    let datos = {
      $idUsuario: json.idUsuario,
      $idSensor: json.idSensor
    }

    let textoSQL = 'INSERT INTO SensoresUsuarios (idUsuario, idSensor) VALUES ($idUsuario, $idSensor);'

    this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);
  }

  //----------------------------------------------------------------------------
  //métodos sensores
  //----------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // json{idSensor: Z, idTipoSensor: Z}
  // -->
  // darDeAltaSensor()
  // -->
  //
  //------------------------------------------------------------------------------------------
  darDeAltaSensor(json, callback) {

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
  // json{idSensor: texto}
  // -->
  // darDeBajaSensor()
  // -->
  //
  //------------------------------------------------------------------------------------------
  darDeBajaSensor(json, callback) {

    let datos = {
      $idSensor: json.idSensor
    }

    let textoSQL = 'DELETE FROM Sensores WHERE idSensor=$idSensor;'

    this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);
  }


  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------


  //------------------------------------------------------------------------------------------
  // idSensor: Z
  // -->
  // buscarSensor()
  // -->
  // json{idSensor: Z, TipoSensor: texto}
  //------------------------------------------------------------------------------------------
  buscarSensor(sensor, callback){

    let datos = {
      $idSensor: sensor
    }

    let textoSQL = 'SELECT Sensores.idSensor, TipoSensor.descripcion, SensoresUsuarios.idUsuario FROM Sensores, TipoSensor, SensoresUsuarios WHERE Sensores.idSensor=$idSensor AND Sensores.idTipoSensor=TipoSensor.idTipoSensor AND SensoresUsuarios.idSensor=$idSensor;'

    this.laConexionBD.consultarConPrepared(textoSQL, datos, callback);

  }

  // ---------------------------------------------------
  // Método implementado por Carlos Canut 4-11-19
  // ->
  // getSensores()
  // ->
  // json{idSensor: Int, descripcion:Text, idUsuario:Text}
  // ---------------------------------------------------
  getSensores(callback) {

    let sql = "SELECT Sensores.idSensor, TipoSensor.descripcion, SensoresUsuarios.idUsuario FROM Sensores, TipoSensor, SensoresUsuarios WHERE Sensores.idTipoSensor=TipoSensor.idTipoSensor AND SensoresUsuarios.idSensor = Sensores.idSensor;"
    // Realizar una consulta a la base de datos, meter todas las medidas en un objeto y pasarlo por el segundo campo del callback
    this.laConexionBD.consultar(sql, function(err, rows) {

      // Si hay error o está vacio se manda el error
      if (err) {
        callback(err, null);
        return;
      }
      if (rows.length == 0 || rows === undefined || rows === null) {
        callback("Sin resultados", null);
        return;
      } //

      callback(null, rows);
    })
  } // getSensores()



  //----------------------------------------------------------------------------
  //métodos log in
  //----------------------------------------------------------------------------

    // --------------------------------------------------
    //  Carlos Canut
    //  usuario: Text, contrasenya: Text ->
    //  verificarUsuario()
    //  -> json{idUsuario: Text, contrasenya: Text}
    // --------------------------------------------------
    verificarUsuario(usuario ,contrasenya , callback){

      let datos = {
        $idUsuario: usuario,
        $contrasenya: contrasenya
      }

      let textoSQL = 'SELECT Usuarios.idUsuario, Usuarios.contrasenya FROM Usuarios WHERE Usuarios.idUsuario=$idUsuario AND Usuarios.contrasenya=$contrasenya;'

      this.laConexionBD.consultarConPrepared(textoSQL, datos, callback);

    } // /verificarUsuario

    // --------------------------------------------------
    //  Carlos Canut
    //  req.headers.authorization ->
    //  autentificarUsuario()
    //  -> OK / error
    // --------------------------------------------------
    async autentificarUsuario(req, res, next){
      //TO DO comprueba que el jwt se encuentra en el header
      const tokenExistente = req.headers.authorization
      if(!tokenExistente){
        res.status(401).send({message: 'token no encontrado.'})
      }
      console.log(tokenExistente)
      //TO DO comprobamos que se trata de un token valido
      try{
        var verifyOptions = {
          issuer: 'iPolution',
          expiresIn: 60 * 60 * 24
          // aqui puede meterse un algoritmo de encriptación
        }
        var tokenVerificado = jwt.verify(tokenExistente, 'privateKey',verifyOptions)
        console.log({tokenVerificado})
        next()
      } catch(error){
        console.error(error)
        res.status(401).send({error: 'fallo en el sistema'})
      }
    }

    // --------------------------------------------------
    //  Carlos Canut
    //  idUsuario:Text ->
    //  existeidUsuario()
    //  -> bool
    // --------------------------------------------------
    existeidUsuario(idUsuario){
      let datos = {
          $idUsuario: idUsuario
      }
      let textoSQL = 'SELECT Usuarios.idUsuario FROM Usuarios WHERE Usuarios.idUsuario=$idUsuario;'
      LogicaDeNegocio.laConexionBD.consultar(textoSQL,(error,result) =>{
          if(error){
              return false
          } else {
              return true
          }
      });
  } // /existeidUsuario



  // --------------------------------------------------
  //  Carlos Canut
  //  token: jwt ->
  //  comprobarToken()
  //  ->
  // --------------------------------------------------
  comprobarToken (token){
      new Promise((resolve, reject) => {
          jwt.verify(token, 'canutcodedthis', (error, payload) => {
              if(error) {
                  return reject(error)
              }
              resolve(payload)
          })
      })
  } // /comprobarToken()


  // --------------------------------------------------
  //  Carlos Canut
  //  idUsuario: string, contrasenya: string ->
  //  checkcontrasenya()
  //  -> bool
  // --------------------------------------------------
  checkcontrasenya(idUsuario, contrasenya){
      let datos = {
          $idUsuario: idUsuario
      }
      let textoSQL = 'SELECT Usuarios.idUsuario, Usuarios.contrasenya FROM Usuarios WHERE idUsuario=$idUsuario;'
      LogicaDeNegocio.laConexionBD.consultarConPrepared(textoSQL,datos,(error,result) =>{
          if(error){
              return false
          } else {
              if( idUsuario == result.idUsuario && contrasenya == result.contrasenya){
                  return true
              } else {
                  return false
              }
          }
      });
  } // /cheackcontrasenya


  // --------------------------------------------------
  //  ->
  //  getMedidasOficiales()
  //  -> List<json>
  // --------------------------------------------------
  async getMedidasOficialeslol(req, res){
// Opciones para JSDOM
const options = {
  cookieJar: new jsdom.CookieJar() // Habilitar cookies   
 };
 
 // URLs de los datos
 const urlDatosGandia = "http://www.cma.gva.es/cidam/emedio/atmosfera/jsp/pde.jsp?PDE.CONT=912&estacion=5&titulo=46131002-Gandia&provincia=null&municipio=null&red=0&PDE.SOLAPAS.Mostrar=1111";
 const urlDatos = "http://www.cma.gva.es/cidam/emedio/atmosfera/jsp/datos_on_line.jsp";

 (async function () {
 
  // Array donde guardaremos las medidas
  let data = [];
 
  // Primera petición para obtener las cookies
  await JSDOM.fromURL(urlDatosGandia, options);

  // Petición para obtener datos contaminación
  await JSDOM.fromURL(urlDatos, options).then(dom => {
 
  // Tabla de contaminación
  let table = dom.window.document.getElementsByTagName("table")[7];
 
  // Filas de la tabla
  let rows = table.getElementsByTagName("tr");
 
  for (var i = 1; i < rows.length; i++) {   
 
  let measure = {
  hora: rows[i].children[0].innerHTML,
  s02: rows[i].children[1].innerHTML,
  co: rows[i].children[3].innerHTML,
  no: rows[i].children[5].innerHTML,
  no2: rows[i].children[6].innerHTML,
  nox: rows[i].children[8].innerHTML,
  o3: rows[i].children[9].innerHTML  

  }
  // Guardamos objeto en el array de medidas 
  data.push(measure);  
  }
 
  })

  res.json(data) 
  
 }())
  } // /getMedidasOficiales



//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
}//() clase Logica
