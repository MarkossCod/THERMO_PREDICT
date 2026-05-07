/* =========================
   ELEMENTOS HTML
========================= */

const tempValor = document.getElementById("tempValor");
const riscoValor = document.getElementById("riscoValor");
const portaValor = document.getElementById("portaValor");
const statusValor = document.getElementById("statusValor");

const alertaBox = document.getElementById("alertaBox");

const predicaoTexto = document.getElementById("predicaoTexto");

const listaAlertas = document.getElementById("listaAlertas");

const cardTemp = document.querySelector(".temp");
const cardRisco = document.querySelector(".risco");
const cardPorta = document.querySelector(".porta");
const cardStatus = document.querySelector(".status");

/* =========================
   DADOS
========================= */

const temperaturas = [];
const horarios = [];

let tempoPortaAberta = 0;

/* =========================
   GRÁFICO
========================= */

const ctx = document.getElementById("graficoTemp");

const graficoTemp = new Chart(ctx, {

    type: "line",

    data: {

        labels: horarios,

        datasets: [{

            label: "Temperatura °C",

            data: temperaturas,

            borderWidth: 3,

            tension: 0.4,

            fill: false

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false

    }

});

/* =========================
   HISTÓRICO
========================= */

function adicionarHistorico(horario, temperatura, porta, status) {

    const linha = document.createElement("tr");

    linha.innerHTML = `
    
        <td>${horario}</td>
        
        <td>${temperatura}°C</td>
        
        <td>${porta}</td>
        
        <td class="${status}">
            ${status === "status-ok"
                ? "Normal"
                : status === "status-alerta"
                    ? "Alerta"
                    : "Crítico"}
        </td>
    
    `;

    listaAlertas.prepend(linha);

}

/* =========================
   CONECTANDO
========================= */

function mostrarConectando() {

    alertaBox.className =
        "alerta alerta-conectando";

    alertaBox.innerHTML =
        "🔄 Fazendo conexão com o servidor...";

}

/* =========================
   ONLINE
========================= */

function sistemaOnline(temp, porta) {

    cardTemp.classList.remove("offline", "neutro");
    cardRisco.classList.remove("offline", "neutro");
    cardPorta.classList.remove("offline", "neutro");
    cardStatus.classList.remove("offline", "neutro");

    statusValor.innerHTML = "Online";

    tempValor.innerHTML = `${temp.toFixed(1)} °C`;

    portaValor.innerHTML = porta;

    alertaBox.className = "alerta alerta-baixo";

    alertaBox.innerHTML =
        "✔ Sistema operando normalmente.";

}

/* =========================
   OFFLINE
========================= */

function sistemaOffline() {

    cardTemp.classList.add("offline");
    cardRisco.classList.add("offline");
    cardPorta.classList.add("offline");
    cardStatus.classList.add("offline");

    tempValor.innerHTML = "--";
    riscoValor.innerHTML = "--";
    portaValor.innerHTML = "--";

    statusValor.innerHTML = "Offline";

    alertaBox.className =
        "alerta alerta-alto";

    alertaBox.innerHTML =
        "❌ Sistema sem comunicação.";

    predicaoTexto.innerHTML = `
    
        <div class="ia-bloco erro">
            Sensor térmico offline.
        </div>
    
    `;

}

/* =========================
   IA
========================= */

function gerarPredicao(temp, porta) {

    let html = "";

    /* SENSOR */

    html += `
    
        <div class="ia-bloco">
            🟢 Sensor térmico operando normalmente.
        </div>
    
    `;

    /* TEMPERATURA */

    if (temp >= 2 && temp <= 7) {

        riscoValor.innerHTML = "Baixo";

        html += `
        
            <div class="ia-bloco">
                🟢 Temperatura dentro da faixa ideal.
            </div>
        
        `;

    }

    else if (temp > 7) {

        riscoValor.innerHTML = "Alto";

        html += `
        
            <div class="ia-bloco alerta">
                🔴 Temperatura acima do limite recomendado.
            </div>
        
        `;

    }

    else {

        riscoValor.innerHTML = "Médio";

        html += `
        
            <div class="ia-bloco alerta">
                🟠 Temperatura abaixo do recomendado.
            </div>
        
        `;

    }

    /* TENDÊNCIA */

    if (temperaturas.length >= 2) {

        const ultima =
            temperaturas[temperaturas.length - 1];

        const anterior =
            temperaturas[temperaturas.length - 2];

        if (ultima > anterior) {

            html += `
            
                <div class="ia-bloco alerta">
                    📈 Tendência de aumento detectada.
                </div>
            
            `;

        }

        else {

            html += `
            
                <div class="ia-bloco">
                    📊 Temperatura estável.
                </div>
            
            `;

        }

    }

    /* PORTA */

    if (porta === "Aberta") {

        tempoPortaAberta += 5;

        html += `
        
            <div class="ia-bloco alerta">
                🚪 Porta aberta aumentando troca térmica.
            </div>
        
        `;

        if (temp > 7) {

            const perda =
                Math.min(
                    ((temp - 7) * 15)
                    + tempoPortaAberta,
                    100
                );

            html += `
            
                <div class="ia-bloco critico">
                    ⚠ Mantendo a porta aberta, existe risco de perda de ${perda.toFixed(0)}% da eficácia das vacinas.
                </div>
            
            `;

        }

    }

    else {

        tempoPortaAberta = 0;

    }

    predicaoTexto.innerHTML = html;

}

/* =========================
   DADOS
========================= */

function gerarDados() {

    mostrarConectando();

    setTimeout(() => {

        const online =
            Math.random() > 0.2;

        if (!online) {

            sistemaOffline();

            return;

        }

        let temperatura =
            Number(
                (Math.random() * 5 + 2).toFixed(1)
            );

        if (Math.random() > 0.8) {

            temperatura =
                Number(
                    (Math.random() * 5 + 8).toFixed(1)
                );

        }

        const porta =
            Math.random() > 0.7
                ? "Aberta"
                : "Fechada";

        sistemaOnline(temperatura, porta);

        gerarPredicao(temperatura, porta);

        const horario =
            new Date().toLocaleTimeString();

        temperaturas.push(temperatura);

        horarios.push(horario);

        if (temperaturas.length > 10) {

            temperaturas.shift();
            horarios.shift();

        }

        graficoTemp.update();

        /* STATUS */

        let status = "status-ok";

        if (temperatura > 7) {

            status = "status-critico";

        }

        else if (temperatura < 2) {

            status = "status-alerta";

        }

        adicionarHistorico(
            horario,
            temperatura,
            porta,
            status
        );

    }, 1500);

}

/* =========================
   EXECUÇÃO
========================= */

gerarDados();

setInterval(gerarDados, 5000);