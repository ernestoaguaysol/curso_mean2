'use strict'

var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;
    
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err) {
            res.status(500).send({ message: 'error en la peticion'});
        } else {
            if (!album) {
                res.status(404).send({ message: 'el album no existe'});
            } else {
                res.status(200).send({ album });
            }
        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'error al guardar el album'});
        } else {
            if (!albumStored) {
                res.status(404).send({ message: 'el album no se guardó'});
            } else {
                res.status(200).send({ message: albumStored});
            }
        }
    });
}

function getAlbums(req, res) {
    
    var artistId = req.params.artist;

    if (!artistId) {
        // sacar todos los albums de la DB
        var find = Album.find({}).sort('title');
    } else {
        // sacar solo los albums del artista
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion'});
        } else {
            if (!albums) {
                res.status(404).send({ message: 'no hay albums'});
            } else {
                return res.status(200).send({ albums });
            }
            
        }
    }); 
}


function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion'});
        } else {
            if (!albumUpdated) {
                res.status(404).send({ message: 'el album no se ha actualizado'});
            } else {
                res.status(200).send({ album: albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId,(err, albumRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar album'});            
        } else {
            if (!albumRemoved) {
                res.status(404).send({ message: 'el album no existe'});
            } else {

                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al eliminar la canción'});            
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({ message: 'la canción no existe'});
                        } else {
                            res.status(200).send({ album: albumRemoved});                                        
                        }
                    }
                });                            
            }
        }
    });
}

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido..';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1].toLocaleLowerCase();

        if (file_ext == 'jpg' || file_ext == 'png' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'error al actualizar imagen'});
                }else {
                    if (!albumUpdated) {
                        res.status(404).send({ message: 'no se ha podido actualizar el usuario'});                
                    } else {
                        res.status(200).send({ album: albumUpdated });            
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
    var path_file = './uploads/albums/'+imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ menssage: 'No existe la imagen...'});
        }
    });
}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}