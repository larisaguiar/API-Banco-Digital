const {contas, saques, depositos, transferencias} = require('../dados/bancodedados');
const { verificaDados } = require('../intermediarios');

const depositar = (req, res)=>{
    const {numero_conta, valor} = req.body;
    
    if (!numero_conta || !valor || valor <= 0) {
        return res.status(400).json({ mensagem: 'Número da conta e o valor  são obrigatórios!' });
    }

    const conta = encontrarConta(numero_conta);

    if (!conta) {
        return res.status(404).json({ mensagem: 'Número da conta não encontrado!' });
    }

    realizarOperacao(conta, valor);

    const registroDeposito = {
        data: new Date().toLocaleString(),
        numero_conta,
        valor,
    };

    depositos.push(registroDeposito);

    return res.status(204).send();
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    verificaDados(numero_conta, valor, senha);

    const resultadoVerificacao = verificarContaSenhaSaldo(numero_conta, valor, senha);

    if (resultadoVerificacao) {
        return res.status(resultadoVerificacao.status).json({ mensagem: resultadoVerificacao.mensagem });
    }

    const conta = encontrarConta(numero_conta);
    realizarSaque(conta, valor);

    const registroSaque = {
        data: new Date().toLocaleString(),
        numero_conta,
        valor,
    };

    saques.push(registroSaque);
    res.status(201).send();
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios!' });
    }

    const contaOrigem = encontrarConta(numero_conta_origem);
    const contaDestino = encontrarConta(numero_conta_destino);

    if (!contaOrigem || !contaDestino) {
        return res.status(404).json({ mensagem: 'Número da conta de origem ou destino inválido!' });
    }

    verificaDados(numero_conta_origem, valor, senha);

    const resultadoVerificacao = verificarContaSenhaSaldo(numero_conta_origem, valor, senha);

    if (resultadoVerificacao) {
        return res.status(resultadoVerificacao.status).json({ mensagem: resultadoVerificacao.mensagem });
    }

    realizarSaque(contaOrigem, valor);
    realizarOperacao(contaDestino, valor);

    const registroTransferencia = {
        data: new Date().toLocaleString(),
        numero_conta_origem,
        numero_conta_destino,
        valor,
        senha,
    };

    transferencias.push(registroTransferencia);
    res.status(201).send();
};

//utils
const encontrarConta = (numero_conta) => {
    return contas.find((conta) => conta.numero === Number(numero_conta));
};

const validarSenha = (conta, senha) => {
    return conta.usuario.senha === senha;
};

const realizarOperacao = (conta, valor) => {
    conta.saldo += valor;
};

const realizarSaque = (conta, valor) => {
    conta.saldo -= valor;
};

const verificarContaSenhaSaldo = (numero_conta, valor, senha) => {
    const conta = encontrarConta(numero_conta);

    if (!conta) {
        return { status: 404, mensagem: 'Conta não encontrada!' };
    }

    if (!validarSenha(conta, senha)) {
        return { status: 400, mensagem: 'Senha inválida!' };
    }

    if (conta.saldo < valor) {
        return { status: 403, mensagem: 'Saldo insuficiente!' };
    }

    return;
};



module.exports = {
    depositar,
    sacar,
    transferir
};