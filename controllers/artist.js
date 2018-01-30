'use strict'

var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err) {
            res.status(500).send({ message: 'error en la peticion'});
        } else {
            if (!artist) {
                res.status(404).send({ message: 'el artista no existe'});
            } else {
                res.status(200).send({ artist });
            }
        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'error al guardar el artista'});
        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'el artista no se guardó'});
            } else {
                res.status(200).send({ message: artistStored});
            }
        }
    });
}

function getArtists(req, res) {
    
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    var itemPerPage = 3;

    Artist.find().sort('name').paginate(page, itemPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion'});
            
        } else {
            if (!artists) {
                res.status(404).send({ message: 'no hay artistas'});
                
            } else {
                return res.status(200).send({ 
                    total_items: total,
                    artists: artists
                });
            
            }
            
        }
    }); 
}

function updateArtist(req, res) {
    
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion'});
        } else {
            if (!artistUpdated) {
                res.status(404).send({ message: 'el artista no se ha actualizado'});
            } else {
                res.status(200).send({ artist: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar artista'});            
        } else {
            if (!artistRemoved) {
                res.status(404).send({ message: 'el artista no ha sido eliminado'});            
            } else {
                
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
                                        res.status(200).send({ artist: artistRemoved});                                        
                                    }
                                }
                            });                            
                        }
                    }
                });
            }
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist
}