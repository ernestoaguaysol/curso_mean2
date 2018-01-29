'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function pruebas(req, res) {
    res.status(200).send({
        menssage: 'Probando controlador uruario'
    });
}

function saveUser(req, res) {
    var user = new User();

    var params = req.body;

    console.log( params );

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if(params.password){
        // encriptar y guardar
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            if (user.name && user.surname && user.email) {
                // guargar usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(200).send({ message: 'Error al guardar usuario'});        
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: 'No se ha registrado el usuario'});        
                        } else {
                            res.status(200).send({ user: userStored});                                    
                        }
                    }
                });
            } else {
                res.status(200).send({ message: 'Rellena todos los campos'});
            }
        });
    } else {
        res.status(500).send({ message: 'introduce la contraseña'});
    }

}

module.exports = {
    pruebas,
    saveUser
};