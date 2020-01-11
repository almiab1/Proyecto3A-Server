//------------------------------------------------------------------------------------------
// Logica.js
// Equipo 4
// Brian, Carlos Tortosa, Carlos Canut, Oscar, Alejandro
// copyright
//------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------
//  dependencies
//------------------------------------------------------------------------------------------
const jwt = require('jsonwebtoken')
const jsdom = require('jsdom')
const kriging = require('@sakitam-gis/kriging');
const {
  JSDOM
} = jsdom
//  /dependencies
//------------------------------------------------------------------------------------------
const ConexionBD = require('./ConexionBD');

module.exports = class Logica {
  //------------------------------------------------------------------------------------------

  // En parte privada tenemos:
  //  laConexionDB --> Objeto de la biblioteca de sqlite con los métodos de acceso
  //------------------------------------------------------------------------------------------


  //------------------------------------------------------------------------------------------

  // Constructores
  //------------------------------------------------------------------------------------------

  constructor(nombreBD) {
    this.laConexionBD = new ConexionBD(nombreBD, function(err) {
      console.log("Me conecto a la BD desde la logica");
      if (err) console.error(err);
    });
  } //constructor

  cerrar() {
    this.laConexionBD.cerrar();
  }
  //------------------------------------------------------------------------------------------


  //------------------------------------------------------------------------------------------


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

  //------------------------------------------------------------------------------------------
  // JSON-- > guardarMedida() -- > callback
  //------------------------------------------------------------------------------------------

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


  //------------------------------------------------------------------------------------------
  // void - > borrarUltimaMedida() -- > callback
  //------------------------------------------------------------------------------------------


  borrarUltimaMedida(callback) {
    const maxIdMedida = 'SELECT idMedida FROM Medidas WHERE idMedida=(SELECT MAX(idMedida) FROM Medidas);'
    let idUltimaMedida = '';
    let sql = '';
    this.laConexionBD.consultar(maxIdMedida, (err, row) => {
      if (err) {
        callback(false);
      }
      if (row.length == 0) {
        callback(false);
      }
      if (row.length != 0) {
        idUltimaMedida = row[0].idMedida;
        sql = `DELETE FROM Medidas WHERE idMedida=${idUltimaMedida}`
      }
      this.laConexionBD.modificar(sql, (err) => {
        if (err) {
          callback(false, err);
        } else {
          callback(true, idUltimaMedida);
        }
      });
    });
  }
  //------------------------------------------------------------------------------------------
  // borrarTodasLasMedidas() ->
  //------------------------------------------------------------------------------------------

  borrarTodasLasMedidas(callback) {
    const sql = 'DELETE FROM Medidas;';
    this.laConexionBD.modificar(sql, (err) => {
      if (err) {
        callback(false, err);
      } else {
        callback(true);
      }
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

    let idTipo = parseInt(json.idTipoUsuario, 10)

    let datos = {
      $idUsuario: json.idUsuario,
      $contrasenya: json.contrasenya,
      $idTipoUsuario: idTipo,
      $telefono: json.telefono,
      $nombre: json.nombre
    }

    if (this.elJsonTieneTodosLosCamposRequeridosUsuario(datos)) {
      callback('JSON incompleto', null); //Mal request
      return;
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
      $idUsuario: json.id
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
  cambiarContrasenya(json, callback) {

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
  buscarUsuario(usuario, callback) {

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

    let sql = 'SELECT idUsuario, telefono, nombre FROM Usuarios;'

    this.laConexionBD.consultar(sql, callback)

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
  obtenerPosicionesYTiempoUsuario(usuario, callback) {

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
  calcularDistancia(listaPosiciones) {

    var distanciaTotal = 0;

    for (let i = 0; i < listaPosiciones.length; i++) {
      if (i < listaPosiciones.length - 1) {

        let senoLatitudOrigen = Math.sin((listaPosiciones[i].latitud * 2 * Math.PI) / 360)
        let senoLatitudDestino = Math.sin((listaPosiciones[i + 1].latitud * 2 * Math.PI) / 360)
        let cosenoLatitudOrigen = Math.cos((listaPosiciones[i].latitud * 2 * Math.PI) / 360)
        let cosenoLatitudDestino = Math.cos((listaPosiciones[i + 1].latitud * 2 * Math.PI) / 360)
        let incrementoLongitud = listaPosiciones[i + 1].longitud - listaPosiciones[i].longitud
        let cosenoLongitud = Math.cos((incrementoLongitud * 2 * Math.PI) / 360)

        let multiplicacionSenos = senoLatitudOrigen * senoLatitudDestino
        let multiplicacionCosenos = cosenoLatitudOrigen * cosenoLatitudDestino * cosenoLongitud
        let distanciaAngular = Math.acos(multiplicacionSenos + multiplicacionCosenos) * 360 / (2 * Math.PI)

        let distanciaEnKm = distanciaAngular * 111.11;

        distanciaTotal = Math.round(distanciaTotal + distanciaEnKm)
      } //if
    } //for

    return distanciaTotal
  } //calcularDistancia()
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // listaPosiciones: posicion{tiempo: R}
  // -->
  // calcularActividad()
  // -->
  // resultado: T/F
  //------------------------------------------------------------------------------------------
  calcularActividad(listaTiempos) {

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

    let idSensor = parseInt(json.idSensor, 10)

    let datos = {
      $idUsuario: json.idUsuario,
      $idSensor: idSensor
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

    let idTipo = parseInt(json.idTipoSensor, 10)
    let idSensor = parseInt(json.idSensor, 10)

    let datos = {
      $idSensor: idSensor,
      $idTipoSensor: idTipo
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
    console.log(json);
    let datos = {
      $idSensor: json.id
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
  buscarSensor(sensor, callback) {

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

    let sql = 'SELECT * FROM Sensores;'

    this.laConexionBD.consultar(sql, callback)

  } // getSensores()

  // ---------------------------------------------------
  // Método implementado por Brian Calabuig
  // ->
  // getIdSensores()
  // ->
  // lista [json{idSensor: Int}]
  // ---------------------------------------------------
  async getIdSensores() {

    let sql = 'SELECT idSensor FROM Sensores;'

    return new Promise((resolver, rechazar) => {
      this.laConexionBD.consultar(sql,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })

  } // getSensores()

  // ---------------------------------------------------
  // Método implementado por Brian Calabuig 3-12-19
  // ->
  // dameTodosSensoresConSuUltimaMedida()
  // ->
  // lista [json{idSensor: Int, tiempo:R}]
  // ---------------------------------------------------
  async dameTodosSensoresConSuUltimaMedida() {

    let sql = "SELECT idSensor, max(tiempo) AS tiempo FROM Medidas GROUP BY idSensor ORDER BY idSensor ASC;"

    return new Promise((resolver, rechazar) => {
      this.laConexionBD.consultar(sql,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })

  } //dameTodosSensoresConSuUltimaMedida
  // ---------------------------------------------------
  // Método implementado por Brian Calabuig 3-12-19
  // lista [json{idSensor: Int, tiempo:R}]
  // tiempoLimite:R
  // ->
  // dameListaSensoresInactivos()
  // ->
  // lista [json{idSensor: Int}]
  // ---------------------------------------------------
  async dameListaSensoresInactivos(tiempoLimite, lista) {

    //obtenemos el tiempo actual
    var tiempoActual = new Date().getTime();

    //creamos la lista donde albergaremos el resultado
    var sensoresInactivos = [];

    //creamos el indice de la lista anterior
    var indiceSensoresInactivos = 0;

    //recorremos la lista de la cabecera del método
    for (var i = 0; i < lista.length; i++) {

      //si cumple la condición añadimos el sensor a la lista resultado
      if (lista[i].tiempo + tiempoLimite < tiempoActual) {

        sensoresInactivos[indiceSensoresInactivos] = lista[i].idSensor;

        indiceSensoresInactivos++;

      } //if

    } //for

    //devolvemos la lista resultado
    return sensoresInactivos;

  } // dameListaSensoresInactivos()

  // ---------------------------------------------------
  // Método implementado por Brian Calabuig 6-12-19
  // idSensor: N
  // ->
  // dameUltimaMedidaDeUnSensor()
  // ->
  // lista[json{tiempo:R}]
  // ---------------------------------------------------
  async dameUltimaMedidaDeUnSensor(idSensor) {

    let datos = {
      $idSensor: idSensor
    }

    let sql = "SELECT max(tiempo) AS tiempo FROM Medidas WHERE idSensor=$idSensor;"

    return new Promise((resolver, rechazar) => {
      this.laConexionBD.consultarConPrepared(sql, datos,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })

  } //dameUltimaMedidaDeUnSensor
  // ---------------------------------------------------
  // Método implementado por Brian Calabuig 6-12-19
  // tiempoLimite:R, tiempo:R
  // ->
  // estaInactivoUnSensor()
  // ->
  // T/F
  // ---------------------------------------------------
  async estaInactivoUnSensor(tiempoLimite, tiempo) {

    var tiempoActual = new Date().getTime();

    if (tiempo + tiempoLimite > tiempoActual) {
      return true;
    }
    return false;

  } //estaInactivoUnSensor()
  // ---------------------------------------------------
  // Método implementado por Brian Calabuig 8-12-19
  // idSensor: N
  // ->
  // dameTodasMedidasDeUnSensor()
  // ->
  // lista[{idSensor: N, valorMedido: Z, latitud: R, longitud: R, tiempo: R}]
  // ---------------------------------------------------
  async dameTodasMedidasDeUnSensor(idSensor) {

    let datos = {
      $idSensor: idSensor
    }

    let sql = "SELECT idSensor, valorMedido, latitud, longitud, tiempo FROM Medidas WHERE idSensor=$idSensor;"

    return new Promise((resolver, rechazar) => {
      this.laConexionBD.consultarConPrepared(sql, datos,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })

  } //dameTodasMedidasDeUnSensor
  // ---------------------------------------------------
  // Método implementado por Brian Calabuig 8-12-19
  // ->
  // dameTodasMedidasDeTodosSensores()
  // ->
  // lista[{idSensor: N, valorMedido: Z, latitud: R, longitud: R, tiempo: R}]
  // ---------------------------------------------------
  async dameTodasMedidasDeTodosSensores() {

    let sql = "SELECT idSensor, valorMedido, latitud, longitud, tiempo FROM Medidas;"

    return new Promise((resolver, rechazar) => {
      this.laConexionBD.consultar(sql,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })

  } //dameTodasMedidasDeTodosSensores
  // ---------------------------------------------------
  // Método implementado por Brian Calabuig 8-12-19
  //  lista1[{idSensor: N, valorMedido: Z, latitud: R, longitud: R, tiempo: R}]
  //  lista2[{idSensor: N, valorMedido: Z, latitud: R, longitud: R, tiempo: R}]
  // ->
  // estaDandoMedidasErroneasUnSensor()
  // ->
  // T/F
  // ---------------------------------------------------
  async estaDandoMedidasErroneasUnSensor(lista1, lista2) {

    var bool = false;

    for (var i = 0; i < lista1.length; i++) {

      var contador = 0;

      for (var j = 0; j < lista2.length; j++) {

        var distancia = this.calcularDistanciaEntre2Puntos(lista1[i].latitud, lista1[i].longitud, lista2[j].latitud, lista2[j].longitud)

        if ((lista1[i].idSensor != lista2[j].idSensor) && (lista1[i].tiempo <= lista2[j].tiempo + 1800000 || lista1[i].tiempo >= lista2[j].tiempo - 1800000) &&
          (distancia < 10) && (lista1[i].valorMedido > lista2[j].valorMedido + 10 || lista1[i].valorMedido < lista2[j].valorMedido - 10)) {

          contador++;

        } //if

        if (contador > 3) {

          bool = true;

        } //if

      } //for2

    } //for1

    return bool;

  } //estaDandoMedidasErroneasUnSensor()
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------
  // Método implementado por Brian Calabuig 8-12-19
  // latitud1: R, longitud1: R, latitud2: R, longitud2: R
  // -->
  // calcularDistanciaEntre2Puntos()
  // -->
  // distancia: R
  //------------------------------------------------------------------------------------------
  calcularDistanciaEntre2Puntos(latitud1, longitud1, latitud2, longitud2) {

    let senoLatitudOrigen = Math.sin((latitud1 * 2 * Math.PI) / 360)
    let senoLatitudDestino = Math.sin((latitud2 * 2 * Math.PI) / 360)
    let cosenoLatitudOrigen = Math.cos((latitud1 * 2 * Math.PI) / 360)
    let cosenoLatitudDestino = Math.cos((latitud2 * 2 * Math.PI) / 360)
    let incrementoLongitud = longitud2 - longitud1
    let cosenoLongitud = Math.cos((incrementoLongitud * 2 * Math.PI) / 360)

    let multiplicacionSenos = senoLatitudOrigen * senoLatitudDestino
    let multiplicacionCosenos = cosenoLatitudOrigen * cosenoLatitudDestino * cosenoLongitud
    let distanciaAngular = Math.acos(multiplicacionSenos + multiplicacionCosenos) * 360 / (2 * Math.PI)

    let distanciaEnKm = distanciaAngular * 111.11 * 1000;

    let distanciaTotal = Math.round(distanciaEnKm)

    return distanciaTotal

  } //calcularDistanciaEntre2Puntos()

  //------------------------------------------------------------------------------------------
  // listaSensoresErroneos: [{idSensor: Z}], listaMedidasOficiales: [{hora: texto, valorO3: Z}]
  // -->
  // calibracionPorProximidadEstacionOficial()
  // -->
  //
  //------------------------------------------------------------------------------------------
  calibracionPorProximidadEstacionOficial(lista, listaMedidasOficiales) {

    for (var i = 0; i < lista.length; i++) {

      listaMedidasUnSensor = this.dameTodasMedidasDeUnSensor(lista[i]);

      for (var j = 0; j < listaMedidasUnSensor.length; j++) {

        for (var k = 0; k < listaMedidasOficiales.length; k++) {

          var distancia = this.calcularDistanciaEntre2Puntos(listaMedidasUnSensor[j].latitud, listaMedidasUnSensor[j].longitud, 38.968473, -0.190018)

          if ((listaMedidasOficiales[k].hora === JSON.stringify((listaMedidasUnSensor[j].tiempo).getHours())+":00") && (distancia < 10) &&
              (listaMedidasOficiales[k].o3 + 10 < listaMedidasUnSensor[j].valorMedido || listaMedidasOficiales[k].o3 - 10 > listaMedidasUnSensor[j].valorMedido)) {

            let datos = {
              $valorMedido: listaMedidasOficiales[k].o3
            }

            let sql = "UPDATE Medidas SET valorMedido=$valorMedido;"

            this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);

          }//if
        }//for 3
      }//for2
    }//for1

  } //calibracionPorProximidadEstacionOficial()

  //------------------------------------------------------------------------------------------
  // métodos rutas
  //------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------
  // json{ idUsuario: texto, nombreRuta: texto, tipoRuta: Z, ruta: {lista[lat: R, lng: R]} }
  // ->
  // postRuta()
  // ->
  //
  //------------------------------------------------------------------------------------------
  postRuta(json, callback){

    let tipoRuta = parseInt(json.tipoRuta, 10);

    let datos = {
      $idUsuario: json.idUsuario,
      $nombreRuta: json.nombreRuta,
      $tipoRuta: tipoRuta,
      $ruta: json.ruta
    }

    let textoSQL = "INSERT INTO Rutas (idUsuario, nombreRuta, tipoRuta, ruta) VALUES ($idUsuario, $nombreRuta, $tipoRuta, $ruta);";

    this.laConexionBD.modificarConPrepared(textoSQL, datos, callback);
  }

  // ---------------------------------------------------
  // idUsuario: texto
  // ->
  // getRutasPredefinidas()
  // ->
  // lista [json{ idUsuario: texto, nombreRuta: texto, tipoRuta: Z, ruta: {lista[lat: R, lng: R]} }]
  // ---------------------------------------------------
  async getRutasRealizadas(idUsuario, callback) {

    let datos = {
      $idUsuario: idUsuario
    }

    let sql = "SELECT * FROM Rutas WHERE idUsuario=$idUsuario;"

    this.laConexionBD.consultarConPrepared(sql, datos, callback);

  } //getRutasRealizadas

  // ---------------------------------------------------
  //
  // ->
  // getRutasPredefinidas()
  // ->
  // lista [json{ idUsuario: texto, nombreRuta: texto, tipoRuta: Z, ruta: {lista[lat: R, lng: R]} }]
  // ---------------------------------------------------
  getRutasPredefinidas(callback) {

    let sql = "SELECT * FROM Rutas WHERE tipoRuta=0;"

    this.laConexionBD.consultar(sql, callback)

  } //getRutasPredefinidas

  //----------------------------------------------------------------------------
  //métodos log in
  //----------------------------------------------------------------------------

  // --------------------------------------------------
  //  Carlos Canut
  //  usuario: Text, contrasenya: Text ->
  //  verificarUsuario()
  //  -> json{idUsuario: Text, contrasenya: Text}
  // --------------------------------------------------
  verificarUsuario(usuario, contrasenya, callback) {

    let datos = {
      $idUsuario: usuario,
      $contrasenya: contrasenya
    }

    let textoSQL = 'SELECT * FROM Usuarios WHERE Usuarios.idUsuario=$idUsuario AND Usuarios.contrasenya=$contrasenya;'

    this.laConexionBD.consultarConPrepared(textoSQL, datos, callback);

  } // /verificarUsuario

  // --------------------------------------------------
  //  Carlos Canut
  //  req.headers.authorization ->
  //  autentificarUsuario()
  //  -> OK / error
  // --------------------------------------------------
  async autentificarUsuario(req, res, next) {
    //TO DO comprueba que el jwt se encuentra en el header
    const tokenExistente = req.headers.authorization
    if (!tokenExistente) {
      console.log('Logica.autentificarUsuario: no existe el token.')
      res.status(401).send({
        'Logica.autentificarUsuario': ' no existe el token.'
      })
      return
    }
    //TO DO comprobamos que se trata de un token valido
    try {
      console.log('Logica.autentificarUsuario: procedemos a verificar el token.')
      var verifyOptions = {
        issuer: 'iPolution',
        expiresIn: 60 * 60 * 24
        // aqui puede meterse un algoritmo de encriptación
      }
      var tokenVerificado = jwt.verify(tokenExistente, 'privateKey', verifyOptions)
      console.log('Logica.autentificarUsuario: token verificado, procedemos a ejecutar la ruta.')
      next()
    } catch (error) {
      console.log('Logica.autentificarUsuario: el token no se pudo verificar correctamente.')
      res.status(401).send({
        'Logica.autentificarUsuario': ' el token no pudo verificarse.'
      })
      return
    }
  }

  // --------------------------------------------------
  //  Carlos Canut
  //  idUsuario:Text ->
  //  existeidUsuario()
  //  -> bool
  // --------------------------------------------------
  existeidUsuario(idUsuario) {
    let datos = {
      $idUsuario: idUsuario
    }
    let textoSQL = 'SELECT Usuarios.idUsuario FROM Usuarios WHERE Usuarios.idUsuario=$idUsuario;'
    LogicaDeNegocio.laConexionBD.consultar(textoSQL, (error, result) => {
      if (error) {
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
  comprobarToken(token) {
    new Promise((resolve, reject) => {
      jwt.verify(token, 'canutcodedthis', (error, payload) => {
        if (error) {
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
  checkcontrasenya(idUsuario, contrasenya) {
    let datos = {
      $idUsuario: idUsuario
    }
    let textoSQL = 'SELECT Usuarios.idUsuario, Usuarios.contrasenya FROM Usuarios WHERE idUsuario=$idUsuario;'
    LogicaDeNegocio.laConexionBD.consultarConPrepared(textoSQL, datos, (error, result) => {
      if (error) {
        return false
      } else {
        if (idUsuario == result.idUsuario && contrasenya == result.contrasenya) {
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
  async getMedidasOficialeslol(req, res) {
    // Opciones para JSDOM
    const options = {
      cookieJar: new jsdom.CookieJar() // Habilitar cookies
    };

    // URLs de los datos
    const urlDatosGandia = "http://www.cma.gva.es/cidam/emedio/atmosfera/jsp/pde.jsp?PDE.CONT=912&estacion=5&titulo=46131002-Gandia&provincia=null&municipio=null&red=0&PDE.SOLAPAS.Mostrar=1111";
    const urlDatos = "http://www.cma.gva.es/cidam/emedio/atmosfera/jsp/datos_on_line.jsp";

    (async function() {

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

  // --------------------------------------------------
  //  Carlos Tortosa Micó
  // --------------------------------------------------
  //  -> {ubicaciones[]:Ubicacion
  //  getValoracionCalidadAire()
  //  -> resultado : R / error (via callback)
  // --------------------------------------------------
  getValoracionCalidadAire(json, callback) {
    let that = this;
    let puntosValidos = [];

    let puntosRuta = json.puntosRuta;

    if (!puntosRuta) {
      callback('No se ha proporcionado waypoints', null);
      return;
    }


    //Obtengo un modelo matemático ('variograma') para predecir que cantidad de O3 habrá en un sitio
    // según las medidas de la BD
    this.interpolarPorKriging(function(err, variograma) {
      if (err) {
        callback(err, null);
        return;
      }

      // Relleno el array de puntosRuta con los puntos que son validos
      for (const punto of puntosRuta) {

        if (punto.latitud && punto.longitud) {
          puntosValidos.push(punto);
        } //if

      } //for

      let media = that.calcularMediaCalidadAire(puntosValidos, variograma) * 2; //Para compararlo más facil con los estándares de la OMS en ug/m3

      switch (true) {
        case (media <= 90):
          callback(null, 1);
          break;

        case (media > 90 && media <= 110):
          callback(null, 2);
          break;
        case (media > 110):
          callback(null, 3);
          break;

        default:
          callback(null, 0);
          break;
      } //switch

    }); //interpolarPorKriging


  } //calidadDelAireMediaRespirada


  // --------------------------------------------------
  //  Carlos Tortosa Micó
  // --------------------------------------------------
  //  -> Ubicacion {longitud:R, latitud:R}
  //  interpolarPorKriging()
  //  -> resultado : variograma , horas:R/ error (via callback)
  // --------------------------------------------------
  interpolarPorKriging(callback) {

    let sql = 'SELECT longitud,latitud,valorMedido,idTipoMedida, tiempo FROM Medidas ORDER BY tiempo DESC LIMIT 50;';
    this.laConexionBD.consultar(sql, function(err, res) {
      if (err) {
        callback(err, null)
        return;
      }

      let x = [];
      let y = [];
      let valores = [];

      let lat = 39.024053;
      let lon = -0.241725;

      //Con este bucle creo un 'grid' de valores 0 en un cuadrante que engloba gandia
      while (lon <= -0.153030 && lat >= 38.913943) {
        lon += 0.00025;
        lat -= 0.00025;

        x.push(lon);
        y.push(lat);
        valores.push(0.0);
      }

      for (const medida of res) {
        //Compruebo  que la medida es de Ozono y tiene los campos necesarios
        if (medida.idTipoMedida === 1 && medida.latitud && medida.longitud && medida.valorMedido) {

          x.push(medida.longitud);
          y.push(medida.latitud);
          valores.push(medida.valorMedido);

        }
      }


      // "Entreno" la libreria con los parámetros de Ozono que he obtenido de la BD
      let variograma = kriging.train(valores, x, y, 'spherical', 0, 100);

      callback(null, variograma);
    }); //consultar



  } //kriging


  // --------------------------------------------------
  //  Carlos Tortosa Micó
  // --------------------------------------------------
  //  -> Ubicaciones[] {longitud:R, latitud:R} , variograma: Variogram (Libreria kriging)
  //  calcularMediaCalidadAire()
  //  -> resultado : R
  // --------------------------------------------------
  calcularMediaCalidadAire() {
    let acumulador = 0;
    if (arguments.length == 2) {
      let ubicaciones = arguments[0];
      let variograma = arguments[1];
      for (const ubi of ubicaciones) {
        acumulador += kriging.predict(ubi.longitud, ubi.latitud, variograma);
      }

      return (acumulador / ubicaciones.length);
    }

    //Si llega hasta aqui el método ha sido llamado por la función para camioneros
    //El usuario no proporciona datos de ubicacion porque ya las tengo en la BD

    let dataCamiones = arguments[0];

    for (const data of dataCamiones) {
      acumulador += data.valorMedido;
    }

    return acumulador / dataCamiones.length;


  } //calcularMediaCalidadAire
  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------


  // --------------------------------------------------
  //  Carlos Tortosa Micó
  // --------------------------------------------------
  //  -> {horaInicio:int, horaFinal:int, idUsuario:string}
  //  getValoracionCalidadAireJornada()
  //  -> resultado : R
  // --------------------------------------------------
  getValoracionCalidadAireJornada(json, callback) {
    let that = this; //Establezco contexto para acceder a métodos propios después

    //Comprobaciones genéricas de que tengo lo que me hace falta
    if (!json.horaInicio || !json.horaFinal) {
      callback('Asegurate que proporciones un intervalo de tiempo', null);
      return;
    }

    if (!json.idUsuario) {
      callback('Asegurate que proporcionas la id del usuario', null);
      return;
    }

    //Preparo la consulta a la BD
    // Necesito los valores que midió el usuario dentro del intervalo de tiempo que me dan
    let sql = "SELECT valorMedido FROM Medidas WHERE idTipoMedida = 1 AND idUsuario = '" + json.idUsuario +
      "' AND tiempo BETWEEN " + json.horaInicio + " AND " + json.horaFinal + ";";

    this.laConexionBD.consultar(sql, function(err, valoresBD) {
      if (err) {
        callback(err, null);
        return;
      } else {

        if (valoresBD.length == 0) {

          // Se ha decidido que si no hay niguna medida en la BD que cumpla los requisitos
          // simplemente devuelvo vacio, que lo gestione el de movil
          callback(null, []);
          return;
        }

        let media = Math.floor(that.calcularMediaCalidadAire(valoresBD) * 2); //Lo paso a ug/m3

        /*
          Vuelvo a tener en cuenta las recomendaciones de la OMS para disernir la gravedad de la medicion
          en cuanto a peligrosidad para la salud

          media <= 90 ug/m3/h --> Exposicion reducida
            90 < media <= 110  --> Exposicion media
            110 < media  --> Exposicion alta
        */

        switch (true) {
          case (media <= 90):
            callback(null, 1);
            break;

          case (media > 90 && media <= 110):
            callback(null, 2);
            break;
          case (media > 110):
            callback(null, 3);
            break;

          default:
            callback(null, 0);
            break;
        } //switch

      }
    })

  }

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------

  // --------------------------------------------------
  //  Carlos Tortosa Micó
  // --------------------------------------------------
  //      fecha: N-- >
  //    getMedidasDeIntervaloConcreto()
  //    <--[medidas]
  //---------------------------------------------------

  getMedidasDeIntervaloConcreto(json, callback) {
    let that = this;

    if (!json.fecha || !json.ventanaDeHoras) {
      callback('Recuerda adjuntar la fecha y ventana de horas', null);
      return;
    }

    if (json.fecha < 0 || json.ventanaDeHoras < 0) {
      callback('Ambas propiedades deben ser mayor que 0', null);
    }

    let intervalo = {
      extremoAnterior: json.fecha - ((json.ventanaDeHoras / 2) * 3600 * 1000),
      extremoPosterior: json.fecha + ((json.ventanaDeHoras / 2) * 3600 * 1000)
    }

    let sql = "SELECT valorMedido, latitud, longitud, tiempo from Medidas WHERE tiempo BETWEEN " + intervalo.extremoAnterior +
      " AND " + intervalo.extremoPosterior + ";";


    this.laConexionBD.consultar(sql, function(err, res) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res);
      }
    });


  }

  //------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------


} //() clase Logica
