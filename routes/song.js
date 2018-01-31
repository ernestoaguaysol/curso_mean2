'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' });

api.get('/song/:id', md_auth.enasureAuth , SongController.getSong);
api.post('/song', md_auth.enasureAuth , SongController.saveSong);
api.get('/songs/:album?', md_auth.enasureAuth , SongController.getSongs);
api.put('/song/:id', md_auth.enasureAuth , SongController.updateSong);
api.delete('/song/:id', md_auth.enasureAuth , SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.enasureAuth, md_upload], SongController.uploadFile);
api.get('/get-file-song/:songFile', SongController.getSongFile);

module.exports = api;