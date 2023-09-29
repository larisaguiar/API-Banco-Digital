const {contas} = require('../dados/bancodedados');

let idProximaConta = 1;

const listarContas = (req, res)=>{
    return res.json(contas);
}

const listarContaId = (req, res) =>{
   const idRequest = Number(req.params.id);

   if (isNaN(idRequest)) {
    return res.status(400).json({mensagem: "O id informado não é um número válido."});
   }
   const conta = contas.find(conta => conta.id === idRequest);

   if (!conta) {
    return res.status(404).json({mensagem: "A conta não foi encontrada."});
   }
   return res.json(conta);
}


    const criarConta = (req, res) => {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
        const camposObrigatorios = ['nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'senha'];
      
        for (const campo of camposObrigatorios) {
          if (!req.body[campo]) {
            return res.status(400).json({ mensagem: `O campo ${campo} deve ser informado.` });

          }
        }

        const saldoInicial = 0;

        const novaConta = {
            id: idProximaConta,
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }


      }
      


module.exports = {
    listarContas,
    listarContaId,
    criarConta
}