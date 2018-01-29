'use strict'

function pruebas(req, res) {
    res.status(200).send({
        menssage: 'Probando controlador uruario'
    });
}

module.exports = {
    pruebas
};