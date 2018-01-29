'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated')

api.get('/probando-controlador', md_auth.enasureAuth , UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.enasureAuth, UserController.updateUser);

module.exports = api;