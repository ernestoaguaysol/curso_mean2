'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums' });

api.get('/album/:id', md_auth.enasureAuth , AlbumController.getAlbum);
api.post('/album', md_auth.enasureAuth , AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.enasureAuth , AlbumController.getAlbums);
api.put('/album/:id', md_auth.enasureAuth , AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.enasureAuth , AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.enasureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;