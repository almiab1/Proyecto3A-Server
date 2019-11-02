// ---------------------------------------------------------------------
//
// ConexionBD.js
//
// adaptador para independizar la logica del negocio
// de la BD concreta que se use.
//
// En este caso, usamos Sqlite
//
// Jordi Bataller Mascarell (1º GTI B  2018)
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
var sqlite3 = require( "sqlite3" )

var fs = require( "fs" )

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
class ConexionBD {

	// .................................................................
	//    constructor()
	// -->
	// Error // via callback : function ( error )
	// .................................................................
	constructor( nombreFichero, callback ) {

		this.nombreBaseDeDatos = nombreFichero
		this.laConexion = null

		this.intentarConexion( callback )

	} //

	// .................................................................
	//
	//    f ()
	// -->
	// Error // via callback : function ( error )
	//
	// .................................................................
	intentarConexion( callback ) {

		if ( this.laConexion != null ) {
			return
		}

		//
		//
		//
		var that = this

		this.laConexion = new sqlite3.Database(
			this.nombreBaseDeDatos,
			function( err ) {
				if ( err ) {
					var mensaje = " ConexionBD: error al abrir "
						+ that.nombreBaseDeDatos
						+ " error= "
						+ err

					console.error( mensaje )
					that.laConexion = null
					callback( mensaje )
					return
				} // if

				// else : no error
				console.log( " ConexionBD: conexion abierta con '"
							 + that.nombreBaseDeDatos + "' hora=" + Date.now() )

				callback( null ) // no hay error
			} // funtion( err )
		) //  new sqlite3.Database(

		//
		// habilitar foreign keys en sqlite3
		//
		if ( this.laConexion ) {
			this.laConexion.run( "PRAGMA foreign_keys = ON" )
		}
	}

	// .................................................................
	//
	//    f()
	// -->
	// ConexionABaseDeDatos // via callback( conexion )
	//
	// .................................................................
	getConexion( callback ) {

		if ( this.laConexion != null ) {
			// ya había una conexión: la devuevlo
			callback( this.laConexion )
			return
		}

		//
		// no hay aún conexión, vamos a abrirla
		//
		var that = this
		this.intentarConexion( function( err ) {
			if ( ! err ) {
				callback( that.laConexion )
			} else {
				callback( null )
			}
		})

	} // ()

	// .................................................................
	// .................................................................
	cerrar () {
		this.getConexion( function( conexion ) {
			if ( conexion != null ) {
				conexion.close()
			}
		})
	} // ()

	// .................................................................
	//
	// textoSQL : Texto
	// valores: JSON (clave, valor) // para substitur en textoSQL
	// -->
	//    f()
	// -->
	// Error / Resultado // via callback(err, res)
	//
	// .................................................................
	consultarConPrepared (textoSQL, valores, callback) {
		this.getConexion( function( conexion ) {
			conexion.all (textoSQL, valores, callback)
		})
	} // ()

	// .................................................................
	//
	// textoSQL : Texto
	// -->
	//    f()
	// -->
	// Error / Resultado // via callback(err, res)
	//
	// .................................................................
	modificar (textoSQL, callback) {
		this.getConexion( function( conexion ) {
			conexion.run (textoSQL, callback)
		})
	} // ()

	// .................................................................
	//
	// textoSQL : Texto
	// valores: JSON (clave, valor) // para substitur en textoSQL
	// -->
	//    f()
	// -->
	// Error / Resultado // via callback(err, res)
	//
	// .................................................................
	modificarConPrepared (textoSQL, valores, callback) {
		this.getConexion( function( conexion ) {
			conexion.run (textoSQL, valores, callback)
		})
	} // ()

	// .................................................................
	//
	// textoSQL : Texto
	// -->
	//    f()
	// -->
	// Error / Resultado // via callback(err, res)
	//
	// .................................................................
	consultar (textoSQL, callback) {
		this.getConexion( function( conexion ) {
			conexion.all (textoSQL, callback)
		})
	} // ()
} // class

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
module.exports = ConexionBD

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
