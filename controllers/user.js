'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

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

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'error en la petición'});
        } else {
            if (!user) {
                res.status(404).send({ message: 'el usuario no existe'});                
            } else {
                // comprobar contraseña
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        // devolver los datos del usuario logueado
                        if (params.gethash) {
                            // devolver en token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user) 
                            });
                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({ message: 'el usuario no ha podido loguearse'});                
                    }
                })
            }
        }
    })
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'error al actualizar el usuario'});
        }else {
            if (!userUpdated) {
                res.status(404).send({ message: 'no se ha podido actualizar el usuario'});                
            } else {
                res.status(200).send({ user: userUpdated });            
            }
        }

    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLocaleLowerCase();

        if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'error al actualizar el usuario'});
                }else {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'no se ha podido actualizar el usuario'});                
                    } else {
                        res.status(200).send({ image: file_name, user: userUpdated });            
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'extencion de imagen no válida'})
        }

        console.log(file_split);
    } else {
        res.status(200).send({ message: 'No ha subido ningula imagen...'})
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/'+imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ menssage: 'No existe la imagen...'});
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};