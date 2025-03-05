document.addEventListener("DOMContentLoaded", function() {
    const listaAtividades = document.getElementById("atividades");
    const formAdicionar = document.getElementById("form-adicionar");
    const tituloInput = document.getElementById("titulo");
    const descricaoInput = document.getElementById("descricao");
    const usuarioInput = document.getElementById("id-usuario");
    const statusInput = document.getElementById("status");
    const formBuscar = document.getElementById("form-buscar");
    const buscarInput = document.getElementById("buscar-id");
    const resultadoBusca = document.getElementById("resultado-busca");
    
    const API_URL = "https://jsonplaceholder.typicode.com/todos";

    function carregarAtividades() {
        fetch(API_URL)
            .then(response => response.json())
            .then(atividades => {
                listaAtividades.innerHTML = "";
                for (let i = 0; i < atividades.length; i++) {
                    adicionarAtividadeNaLista(atividades[i], listaAtividades);
                }
            })
            .catch(error => console.error("Erro ao carregar atividades:", error));
    }

    function adicionarAtividadeNaLista(atividade, lista) {
        let item = document.createElement("li");
        item.dataset.id = atividade.id;
        item.innerHTML = `
            <span>${atividade.title} - ${atividade.completed ? "✔️" : "❌"}</span>
            <button onclick="editarAtividade(${atividade.id})">Editar</button>
            <button onclick="excluirAtividade(${atividade.id})">Excluir</button>
        `;
        lista.appendChild(item);
    }

    formAdicionar.addEventListener("submit", function(event) {
        event.preventDefault();
        let novaAtividade = {
            title: tituloInput.value,
            body: descricaoInput.value,
            userId: usuarioInput.value,
            completed: statusInput.checked
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaAtividade)
        })
        .then(response => response.json())
        .then(atividade => {
            atividade.id = Math.floor(Math.random() * 1000);
            adicionarAtividadeNaLista(atividade, listaAtividades);
        })
        .catch(error => console.error("Erro ao adicionar atividade:", error));
    });

    formBuscar.addEventListener("submit", function(event) {
        event.preventDefault();
        let userId = buscarInput.value;

        fetch(API_URL)
            .then(response => response.json())
            .then(atividades => {
                resultadoBusca.innerHTML = "";
                let encontrou = false;
                for (let i = 0; i < atividades.length; i++) {
                    if (atividades[i].userId == userId) {
                        adicionarAtividadeNaLista(atividades[i], resultadoBusca);
                        encontrou = true;
                    }
                }
                if (!encontrou) {
                    resultadoBusca.innerHTML = "<li>Nenhuma atividade encontrada para esse usuário.</li>";
                }
            })
            .catch(error => console.error("Erro ao buscar atividades:", error));
    });

    window.editarAtividade = function(id) {
        let novoTitulo = prompt("Novo título da atividade:");
        if (!novoTitulo) return;

        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: novoTitulo, completed: false })
        })
        .then(response => response.json())
        .then(() => {
            let itens = document.querySelectorAll("li");
            for (let i = 0; i < itens.length; i++) {
                if (itens[i].dataset.id == id) {
                    itens[i].querySelector("span").textContent = `${novoTitulo} - ❌`;
                }
            }
        })
        .catch(error => console.error("Erro ao editar atividade:", error));
    };

    window.excluirAtividade = function(id) {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => {
            let itens = document.querySelectorAll("li");
            for (let i = 0; i < itens.length; i++) {
                if (itens[i].dataset.id == id) {
                    itens[i].remove();
                }
            }
        })
        .catch(error => console.error("Erro ao excluir atividade:", error));
    };

    carregarAtividades();
});
