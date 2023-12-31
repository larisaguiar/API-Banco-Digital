const {
    contas,
    saques,
    depositos,
    transferencias,
} = require("../dados/bancodedados");
let id = 1;

const listarContas = (req, res) => {
    return res.status(200).json(contas);
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const camposObrigatorios = [
        "nome",
        "cpf",
        "data_nascimento",
        "telefone",
        "email",
        "senha",
    ];

    for (const campo of camposObrigatorios) {
        if (!req.body[campo]) {
            return res
                .status(400)
                .json({ mensagem: `O campo ${campo} é obrigatório` });
        }
    }

    for (const conta of contas) {
        if (conta.usuario.cpf === cpf || conta.usuario.email === email) {
            return res
                .status(400)
                .json({
                    mensagem: "Já existe uma conta com o CPF ou E-mail informado!",
                });
        }
    }

    const novaConta = {
        numero: id++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        },
    };

    contas.push(novaConta);
    return res.status(201).send();
};

const atualizarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    const camposObrigatorios = [
        "nome",
        "cpf",
        "data_nascimento",
        "telefone",
        "email",
        "senha",
    ];

    for (const campo of camposObrigatorios) {
        if (!req.body[campo]) {
            return res
                .status(400)
                .json({ mensagem: `O campo ${campo} é obrigatório` });
        }
    }

    const numeroDaConta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!numeroDaConta) {
        return res
            .status(404)
            .json({ mensagem: "Número da conta bancária inválido!" });
    }

    if (cpf !== numeroDaConta.usuario.cpf) {
        const cpfExistente = contas.find((conta) => {
            return conta.usuario.cpf === cpf;
        });

        if (cpfExistente) {
            return res
                .status(400)
                .json({ mensagem: "O cpf informado já existe no cadastro!" });
        }
    }

    if (email !== numeroDaConta.usuario.email) {
        const emailExistente = contas.find((conta) => {
            return conta.usuario.email === email;
        });

        if (emailExistente) {
            return res
                .status(400)
                .json({ mensagem: "O e-mail informado já existe no cadastro!" });
        }
    }

    numeroDaConta.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
    };

    return res.status(204).send();
};

const deletarConta = (req, res) => {
    const { numeroConta } = req.params;

    const numeroDaConta = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!numeroDaConta) {
        return res
            .status(404)
            .json({ mensagem: "Número da conta bancária inválido!" });
    }

    if (numeroDaConta.saldo > 0) {
        return res
            .status(403)
            .json({ mensagem: "A conta só pode ser removida se o saldo for zero!" });
    }

    let indiceDoUsuario = contas.indexOf(numeroDaConta);
    contas.splice(indiceDoUsuario, 1);

    return res.status(204).send();
};

const exibirSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res
            .status(400)
            .json({ mensagem: "O número da conta e a senha são obrigatórios!" });
    }

    const numeroDaConta = contas.find((contaBancaria) => {
        return contaBancaria.numero === Number(numero_conta);
    });

    if (!numeroDaConta) {
        return res.status(404).json({ mensagem: "Conta bancária não encontada!" });
    }

    if (numeroDaConta.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }

    res.status(200).json({ saldo: numeroDaConta.saldo });
};

const exibirExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res
            .status(400)
            .json({ mensagem: "O número da conta e a senha são obrigatórios!" });
    }

    const numeroDaConta = contas.find((contaBancaria) => {
        return contaBancaria.numero === Number(numero_conta);
    });

    if (!numeroDaConta) {
        return res.status(404).json({ mensagem: "Conta bancária não encontrada!" });
    }

    if (numeroDaConta.usuario.senha !== senha) {
        return res.status(400).json({ mensagem: "Senha inválida!" });
    }

    const extratoDepositos = depositos.filter((deposito) => {
        return Number(deposito.numero_conta) === Number(numero_conta);
    });

    const extratoSaques = saques.filter((saque) => {
        return Number(saque.numero_conta) === Number(numero_conta);
    });

    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        return Number(transferencia.numero_conta_origem) === Number(numero_conta);
    });

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return Number(transferencia.numero_conta_destino) === Number(numero_conta);
    });

    return res.status(200).json({
        depositos: extratoDepositos,
        saques: extratoSaques,
        transferenciasEnviadas,
        transferenciasRecebidas,
    });
};

module.exports = {
    listarContas,
    criarConta,
    atualizarConta,
    deletarConta,
    exibirSaldo,
    exibirExtrato,
};
