'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists' });

api.get('/artist/:id', md_auth.enasureAuth , ArtistController.getArtist);
api.post('/artist', md_auth.enasureAuth , ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.enasureAuth , ArtistController.getArtists);
api.put('/artist/:id', md_auth.enasureAuth , ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.enasureAuth , ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.enasureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;