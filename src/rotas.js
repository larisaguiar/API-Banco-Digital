const express = require('express');

const { listarContas, criarConta, atualizarConta, deletarConta, exibirSaldo, exibirExtrato} = require('./controladores/contas');

const { depositar, sacar, transferir } = require('./controladores/transacoes');

const rotas =  express();

rotas.get('/contas', listarContas);

rotas.post('/contas', criarConta);

rotas.put('/contas/:numeroConta/usuario', atualizarConta);

rotas.delete('/contas/:numeroConta', deletarConta);

rotas.get('/contas/saldo', exibirSaldo);

rotas.get('/contas/extrato', exibirExtrato);

rotas.post('/transacoes/depositar', depositar);

rotas.post('/transacoes/sacar', sacar);

rotas.post('/transacoes/transferir', transferir);

module.exports = rotas;

