const express = require('express');
const {listarContas, listarContaId, criarConta}= require('./controladores/contas')

const rotas =  express();

rotas.get('/contas',listarContas);

rotas.get('/contas/:id', listarContaId);

rotas.post('/contas', criarConta)

module.exports = rotas;

