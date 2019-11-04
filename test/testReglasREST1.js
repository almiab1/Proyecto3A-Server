// ........................................................
// mainTest1.js
// ........................................................
var request = require('request')
var assert = require('assert')
// ........................................................
// ........................................................
const IP_PUERTO = "http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe("Test 1", function() {
  // ....................................................
  // ....................................................
  it("probar GET /getUltimaMedida", function() {
    request.get({
        url: IP_PUERTO + "/getUltimaMedida",
        headers: {
          'User-Agent': 'Brian'
        }
      },
      function(err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        var solucion = JSON.parse(carga)

        assert.equal(solucion[0].idMedida, 10)
        assert.equal(solucion[0].valorMedido, 7)
        assert.equal(solucion[0].idUsuario, "a@gmail.com")
      } // callback
    ) // .get
  }) // it
}) // describe
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
