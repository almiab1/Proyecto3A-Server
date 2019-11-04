// ........................................................
// mainTest3.js
// ........................................................
var request = require('request')
var assert = require('assert')
// ........................................................
// ........................................................
const IP_PUERTO = "http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe("Test 3", function(){
  // ....................................................
  // ....................................................
  it("probar GET /getAllOzono", function(hecho) {
    request.get({
        url: IP_PUERTO + "/getAllOzono",
        headers: {
          'User-Agent': 'Brian'
        }
      },
      function(err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?")
        assert.equal(respuesta.statusCode, 200, "¿El código no es 200 (OK)")
        var solucion = JSON.parse(carga)
        //console.log(solucion);
        assert.equal(solucion.length, 9)
        assert.equal(solucion[8].valorMedido, 7)
        hecho()
      } // callback
    ) // .get
  }) // it
})
