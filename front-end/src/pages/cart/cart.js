console.log("cart.js funcionando!");

const API_CARRINHO = "http://localhost:3000/carrinho";
const API_COMPRA = "http://localhost:3000/compra";
const API_VENDA = "http://localhost:3000/venda";

const listaItens = document.getElementById("listaItens");
const totalItensEl = document.getElementById("totalItens");
const valorTotalEl = document.getElementById("valorTotal");
const campoPagamento = document.getElementById("forma_pagamento");
const btnFinalizar = document.getElementById("btnFinalizar");
const mensagem = document.getElementById("mensagem");

const idCliente = Number(localStorage.getItem("id_cliente"));

let carrinhoAtual = null;
let itensDoCarrinho = [];

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

async function obterOuCriarCarrinho() {
    const resposta = await fetch(API_CARRINHO);
    if (!resposta.ok) {
        throw new Error("Erro ao buscar carrinhos no servidor.");
    }

    const carrinhos = await resposta.json();
    const aberto = carrinhos.find(
        (c) => c.id_cliente === idCliente && c.status_carrinho === "Aberto"
    );

    if (aberto) {
        return aberto;
    }

    const criarResp = await fetch(API_CARRINHO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status_carrinho: "Aberto",
            id_cliente: idCliente
        })
    });

    const novoCarrinho = await criarResp.json();
    if (!criarResp.ok) {
        throw new Error(novoCarrinho.erro || "Não foi possível criar o carrinho.");
    }

    return {
        id_carrinho: novoCarrinho.id,
        status_carrinho: "Aberto",
        id_cliente: idCliente
    };
}

async function carregarItens() {
    const resposta = await fetch(API_COMPRA);
    if (!resposta.ok) {
        throw new Error("Erro ao carregar os itens do carrinho.");
    }

    const todasCompras = await resposta.json();
    itensDoCarrinho = todasCompras.filter(
        (item) => item.id_carrinho === carrinhoAtual.id_carrinho
    );

    renderizarCarrinho();
}

function renderizarCarrinho() {
    listaItens.innerHTML = "";

    if (itensDoCarrinho.length === 0) {
        listaItens.innerHTML = `<p class="vazio">Seu carrinho está vazio no momento.</p>`;
        totalItensEl.textContent = "0";
        valorTotalEl.textContent = formatarMoeda(0);
        btnFinalizar.disabled = true;
        return;
    }

    btnFinalizar.disabled = false;
    let qtdTotal = 0;
    let somaTotal = 0;

    itensDoCarrinho.forEach((item) => {
        const subtotal = Number(item.preco_unitario) * Number(item.quantidade);
        qtdTotal += Number(item.quantidade);
        somaTotal += subtotal;

        const card = document.createElement("article");
        card.className = "item-card";
        card.innerHTML = `
            <div class="item-info">
                <span class="categoria">${item.categoria}</span>
                <h3>${item.nome_produto}</h3>
                <p class="preco-unit">Unitário: ${formatarMoeda(item.preco_unitario)}</p>
            </div>

            <div class="item-controles">
                <div class="qtd-box">
                    <button type="button" class="btn-qtd" data-acao="diminuir" data-id="${item.id_compra}">-</button>
                    <span>${item.quantidade}</span>
                    <button type="button" class="btn-qtd" data-acao="aumentar" data-id="${item.id_compra}">+</button>
                </div>

                <strong class="subtotal">${formatarMoeda(subtotal)}</strong>

                <button type="button" class="btn-remover" data-id="${item.id_compra}">
                    Remover
                </button>
            </div>
        `;

        listaItens.appendChild(card);
    });

    totalItensEl.textContent = qtdTotal;
    valorTotalEl.textContent = formatarMoeda(somaTotal);
}

listaItens.addEventListener("click", async (evento) => {
    const botao = evento.target.closest("button");
    if (!botao) return;

    const idCompra = Number(botao.dataset.id);
    const item = itensDoCarrinho.find((i) => i.id_compra === idCompra);
    if (!item) return;

    try {
        mensagem.textContent = "";

        if (botao.classList.contains("btn-remover")) {
            const resp = await fetch(`${API_COMPRA}/${idCompra}`, {
                method: "DELETE"
            });
            if (!resp.ok) throw new Error("Não foi possível remover o item.");
            await carregarItens();
            return;
        }

        if (botao.classList.contains("btn-qtd")) {
            const acao = botao.dataset.acao;
            const novaQtd = acao === "aumentar" ? item.quantidade + 1 : item.quantidade - 1;

            if (novaQtd <= 0) {
                const resp = await fetch(`${API_COMPRA}/${idCompra}`, { method: "DELETE" });
                if (!resp.ok) throw new Error("Não foi possível remover o item.");
            } else {
                const resp = await fetch(`${API_COMPRA}/${idCompra}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nome_produto: item.nome_produto,
                        categoria: item.categoria,
                        quantidade: novaQtd,
                        preco_unitario: item.preco_unitario,
                        id_carrinho: item.id_carrinho
                    })
                });
                if (!resp.ok) throw new Error("Não foi possível atualizar a quantidade.");
            }

            await carregarItens();
        }
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
});

btnFinalizar.addEventListener("click", async () => {
    if (itensDoCarrinho.length === 0) return;

    const valorTotal = itensDoCarrinho.reduce(
        (acc, item) => acc + Number(item.preco_unitario) * Number(item.quantidade),
        0
    );

    try {
        btnFinalizar.disabled = true;
        mensagem.textContent = "Finalizando pedido...";

        const respVenda = await fetch(API_VENDA, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                valor_total: valorTotal.toFixed(2),
                forma_pagamento: campoPagamento.value,
                status_pagamento: "Pendente",
                status_entrega: "Em Processamento",
                id_carrinho: carrinhoAtual.id_carrinho
            })
        });

        const dadosVenda = await respVenda.json();
        if (!respVenda.ok) {
            throw new Error(dadosVenda.erro || "Erro ao registrar a venda.");
        }

        const respCarrinho = await fetch(`${API_CARRINHO}/${carrinhoAtual.id_carrinho}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status_carrinho: "Finalizado",
                id_cliente: idCliente
            })
        });

        if (!respCarrinho.ok) {
            throw new Error("Venda registrada, mas houve erro ao encerrar o carrinho.");
        }

        mensagem.textContent = "Compra realizada com sucesso! Redirecionando...";
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1800);
    } catch (erro) {
        mensagem.textContent = erro.message;
        btnFinalizar.disabled = false;
    }
});

async function iniciar() {
    if (!idCliente) {
        mensagem.textContent = "Faça login para acessar seu carrinho de compras.";
        btnFinalizar.disabled = true;
        return;
    }

    try {
        carrinhoAtual = await obterOuCriarCarrinho();
        await carregarItens();
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

iniciar();