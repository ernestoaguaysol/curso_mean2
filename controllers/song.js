'use strict'

var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;
    
    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err) {
            res.status(500).send({ message: 'error en la peticion'});
        } else {
            if (!song) {
                res.status(404).send({ message: 'la canción no existe'});
            } else {
                res.status(200).send({ song });
            }
        }
    });
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: 'error al guardar el canción'});
        } else {
            if (!songStored) {
                res.status(404).send({ message: 'la canción no se guardó'});
            } else {
                res.status(200).send({ message: songStored});
            }
        }
    });
}

function getSongs(req, res) {
    
    var albumId = req.params.album;

    if (!albumId) {
        // sacar todos las canciones de la DB
        var find = Song.find({}).sort('number');
    } else {
        // sacar solo las canciónes del album
        var find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion'});
        } else {
            if (!songs) {
                res.status(404).send({ message: 'no hay canciones'});
            } else {
                return res.status(200).send({ songs });
            }
            
        }
    }); 
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion'});
        } else {
            if (!songUpdated) {
                res.status(404).send({ message: 'la canción no se ha actualizado'});
            } else {
                res.status(200).send({ song: songUpdated});
            }
        }
    });
}

function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId,(err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar canción'});            
        } else {
            if (!songRemoved) {
                res.status(404).send({ message: 'la canción no existe'});
            } else {
                res.status(200).send({ song: songRemoved});                            
            }
        }
    });
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No subido..';

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        
        if (file_ext == 'mp3' || file_ext == 'ogg') {

            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (err) {
                    res.status(500).send({ message: 'error al actualizar canción'});
                }else {
                    if (!songUpdated) {
                        res.status(404).send({ message: 'no se ha podido actualizar la canción'});                
                    } else {
                        res.status(200).send({ song: songUpdated });            
                    }
                }
            });
        } else {
            res.status(200).send({ message: 'extencion de canción no válida'})
        }

        
    } else {
        res.status(200).send({ message: 'No ha subido ningun fichero de audio...'})
    }
}

function getSongFile(req, res) {

    var songFile = req.params.songFile;
    var path_file = './uploads/songs/'+songFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ menssage: 'No existe fichero de audio...'});
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}