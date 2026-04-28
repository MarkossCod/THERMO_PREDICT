document.addEventListener("DOMContentLoaded", function () {

    iniciarMonitoramento();
    configurarFormulario();
    configurarSuporte();

});

/* =========================
   FORMULÁRIO
========================= */
function configurarFormulario() {

    const form = document.getElementById("formProblema");

    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const chamado = {
            nome: form.nome.value,
            email: form.email.value,
            tipo: form.tipo.value,
            descricao: form.descricao.value,
            data: new Date().toLocaleString()
        };

        let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
        chamados.push(chamado);

        localStorage.setItem("chamados", JSON.stringify(chamados));

        alert("Chamado enviado com sucesso!");

        form.reset();

        setTimeout(() => {
            window.location.href = "suporte.html";
        }, 800);
    });
}

/* =========================
   SUPORTE
========================= */
function configurarSuporte() {

    const lista = document.getElementById("listaChamados");

    if (!lista) return;

    carregarChamados();
}

function carregarChamados() {

    const lista = document.getElementById("listaChamados");
    let chamados = JSON.parse(localStorage.getItem("chamados")) || [];

    if (chamados.length === 0) {
        lista.innerHTML = "<p>Nenhum chamado enviado ainda.</p>";
        return;
    }

    lista.innerHTML = "";

    chamados.slice().reverse().forEach((c) => {
        const item = document.createElement("div");
        item.classList.add("chamado");

        item.innerHTML = `
            <p><strong>Nome:</strong> ${c.nome}</p>
            <p><strong>Email:</strong> ${c.email}</p>
            <p><strong>Tipo:</strong> ${c.tipo}</p>
            <p><strong>Data:</strong> ${c.data}</p>
            <p><strong>Problema:</strong> ${c.descricao}</p>
        `;

        lista.appendChild(item);
    });
}

function limparChamados() {
    if (confirm("Deseja apagar todos os chamados?")) {
        localStorage.removeItem("chamados");
        carregarChamados();
    }
}

/* =========================
   MONITORAMENTO (INDEX)
========================= */
function iniciarMonitoramento() {

    if (!document.getElementById("tempValor")) return;

    function atualizarSistema() {

        const temp = (Math.random() * 10).toFixed(1);
        const portaAberta = Math.random() > 0.7;

        document.getElementById("tempValor").innerText = temp + " °C";
        document.getElementById("portaValor").innerText = portaAberta ? "Aberta" : "Fechada";
        document.getElementById("statusValor").innerText = "Online";

        let risco = "Baixo";
        let alertaTexto = "✔ Sistema operando normalmente.";
        let alertaClasse = "alerta-baixo";

        if (temp > 8 || portaAberta) {
            risco = "Médio";
            alertaTexto = "⚠ Atenção! Verifique a temperatura ou porta.";
            alertaClasse = "alerta-medio";
        }

        if (temp > 10) {
            risco = "Alto";
            alertaTexto = "🚨 Risco crítico! Vacinas podem ser comprometidas.";
            alertaClasse = "alerta-alto";
        }

        document.getElementById("riscoValor").innerText = risco;

        const alertaBox = document.getElementById("alertaBox");
        if (alertaBox) {
            alertaBox.className = "alerta " + alertaClasse;
            alertaBox.innerText = alertaTexto;
        }

        const predicao = document.getElementById("predicaoTexto");
        if (predicao) {
            predicao.innerText =
                risco === "Alto"
                    ? "Alta probabilidade de falha nas próximas horas."
                    : "Sistema estável no momento.";
        }
    }

    setInterval(atualizarSistema, 3000);
    atualizarSistema();
}

/* =========================
   NAVEGAÇÃO
========================= */
function novoChamado() {
    window.location.href = "form.html";
}