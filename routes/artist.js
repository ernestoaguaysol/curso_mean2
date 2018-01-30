'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/artist/:id', md_auth.enasureAuth , ArtistController.getArtist);
api.post('/artist', md_auth.enasureAuth , ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.enasureAuth , ArtistController.getArtists);
api.put('/artist/:id', md_auth.enasureAuth , ArtistController.updateArtist);

module.exports = api;