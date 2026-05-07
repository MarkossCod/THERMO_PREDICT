const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// =========================
// ESTADO DO SISTEMA
// =========================
let dados = {
    temperatura: 5,
    porta: false
};

let historico = [];

// =========================
// SIMULAÇÃO REALISTA
// =========================
setInterval(() => {

    // Variação suave
    let variacao = (Math.random() * 0.6 - 0.3);

    // Porta influencia MUITO
    if (dados.porta) {
        variacao += 0.8;
    }

    dados.temperatura += variacao;

    // Limites físicos
    if (dados.temperatura < 1) dados.temperatura = 1;
    if (dados.temperatura > 12) dados.temperatura = 12;

    // Porta abre com menor frequência
    dados.porta = Math.random() > 0.85;

    historico.push({
        temperatura: dados.temperatura,
        porta: dados.porta,
        data: new Date()
    });

    if (historico.length > 30) historico.shift();

}, 3000);

// =========================
// ROTAS
// =========================
app.get('/dados', (req, res) => {
    res.json(dados);
});

app.get('/historico', (req, res) => {
    res.json(historico);
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});