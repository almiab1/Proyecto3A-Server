const jwt = require('jsonwebtoken')
const rejects = require('assert')
const resolve = require('dns')


module.exports = class Auth{
    constructor(){
        console.log("Auth working and protecting")
    }


    // --------------------------------------------------
    //  idUsuario:Text ->
    //  existeidUsuario()
    //  -> bool
    // --------------------------------------------------
    existeidUsuario(idUsuario){
        let datos = {
            $idUsuario: idUsuario
        }
        let textoSQL = 'SELECT * FROM Usuarios WHERE idUsuario=$idUsuario;'
        LogicaDeNegocio.laConexionBD.consultarConPrepared(textoSQL,datos,(error,result) =>{
            if(error){
                return false
            } else {
                return result.idUsuario
            }
        });
    } // /existeidUsuario  


    




    // --------------------------------------------------
    //  token: jwt ->
    //  comprobarToken()
    //  -> 
    // --------------------------------------------------
    comprobarToken = token => {
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
    //  signup()
    //  -> res
    // --------------------------------------------------
    signup = async (req, res) => {
        // comprueba que hay idUsuario y contrasenya
        if(!req.body.idUsuario || !req.body.contrasenya){
            return res.status(401).send({message: 'idUsuario and contrasenya required'})
        }

        var idUsuario = req.body.idUsuario
        var contrasenya = req.body.contrasenya

    
        // comprueba que el idUsuario no cuenta con una cuenta ya
        if(this.existeidUsuario(idUsuario)){
            return res.status(401).send({message: 'idUsuario already has an account'})
        }

        // Genera el payload del token
        var tokenData = {
            idUsuario: idUsuario,
            contrasenya: contrasenya
        }
        try {
            // Genera el token
        var token = jwt.sign(tokenData, 'canutcodedthis', {
            expiresIn: 60 * 60 * 24 // 24 horas dura el token
        })
        // Manda el token con idUsuario y pass en payload
        return res.status(201).send({ token })
        } catch(error){
            console.error(error)
            return res.status(401).end()
        }
    }   // /signup


    // -------------------------------------------------- 
    //  signin()
    //  -> res
    // --------------------------------------------------
    signin = async (req, res) => {
        // comprueba que hay idUsuario y contrasenya
        if(!req.body.idUsuario || !req.body.contrasenya){
            return res.status(400).send({message: 'idUsuario and contrasenya required'})
        }
        var idUsuario = req.body.idUsuario
        var contrasenya = req.body.contrasenya

        // Comprueba que existe una cuenta con este idUsuario
        if(!(this.existeidUsuario(idUsuario) == idUsuario)){
            return res.status(401).send({message: "This idUsuario doesn't has an account"})
        }
    
    // comprobar que la pass coincide con el correo
    if(!this.checkcontrasenya(idUsuario,contrasenya)){
       return res.status(401).send({message: 'Not auth'})
    }

    try{
        var tokenData = {
            idUsuario: idUsuario,
            contrasenya: contrasenya
        }
        // se genera el token
        const token = jwt.sign(tokenData,'canutcodedthis',{
            expiresIn: 60 * 60 * 24
        })
    
        // mando el token con idUsuario y pass en payload
        return res.status(200).send({ token })    
    } catch(error){
        console.error(error)
        return res.status(401).end()
    }
    
}   // /signin
}