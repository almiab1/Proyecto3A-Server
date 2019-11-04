// ........................................................
// mainTest2.js
// ........................................................
var request = require('request')
var assert = require('assert')
// ........................................................
// ........................................................
const IP_PUERTO = "http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe("Test 2", function(){
  // ....................................................
  // ....................................................
  it("probar GET /getAllMedidas", function(hecho) {
    request.get({
        url: IP_PUERTO + "/getAllMedidas",
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
        assert.equal(solucion[8].idUsuario, "a@gmail.com")
        hecho()
      } // callback
    ) // .get
  }) // it
})
