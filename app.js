'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// configurar cabeceras http

// carga de rutas base
app.use('/api', user_routes);


// exportamos el modulo
module.exports = app;