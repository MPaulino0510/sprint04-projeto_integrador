const API_CARRINHO = "http://localhost:3000/carrinho";
const API_COMPRA = "http://localhost:3000/compra";
const API_VENDA = "http://localhost:3000/venda";
const API_ENDERECO = "http://localhost:3000/endereco";

const listaItens = document.getElementById("listaItens");
const totalItensEl = document.getElementById("totalItens");
const valorTotalEl = document.getElementById("valorTotal");
const campoPagamento = document.getElementById("forma_pagamento");
const btnFinalizar = document.getElementById("btnFinalizar");
const mensagem = document.getElementById("mensagem");

const campoCep = document.getElementById("cep");
const statusCep = document.getElementById("statusCep");
const campoEstado = document.getElementById("estado");
const campoLogradouro = document.getElementById("logradouro");
const campoNumero = document.getElementById("numero");
const campoComplemento = document.getElementById("complemento");
const campoBairro = document.getElementById("bairro");
const campoCidade = document.getElementById("cidade");

const idCliente = Number(localStorage.getItem("id_cliente"));

let carrinhoAtual = null;
let itensDoCarrinho = [];
let idEnderecoAtual = null;

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function aplicarMascaraCep(valor) {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 8);
    if (apenasNumeros.length > 5) {
        return `${apenasNumeros.slice(0, 5)}-${apenasNumeros.slice(5)}`;
    }
    return apenasNumeros;
}

async function buscarCep(cepDigitado) {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
        statusCep.textContent = "Buscando CEP...";
        const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resp.json();

        if (dados.erro) {
            statusCep.textContent = "CEP não encontrado. Preencha manualmente.";
            return;
        }

        campoLogradouro.value = dados.logradouro || "";
        campoBairro.value = dados.bairro || "";
        campoCidade.value = dados.localidade || "";
        campoEstado.value = (dados.uf || "").toUpperCase();
        statusCep.textContent = "Endereço encontrado!";

        campoNumero.focus();
    } catch (erro) {
        statusCep.textContent = "Não foi possível consultar o CEP.";
    }
}

campoCep.addEventListener("input", (e) => {
    e.target.value = aplicarMascaraCep(e.target.value);
    const cepLimpo = e.target.value.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
        buscarCep(cepLimpo);
    } else {
        statusCep.textContent = "";
    }
});

campoEstado.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 2);
});

async function carregarEnderecoCliente() {
    try {
        const resp = await fetch(API_ENDERECO);
        if (!resp.ok) return;

        const enderecos = await resp.json();
        const enderecoCliente = enderecos.find((e) => e.id_cliente === idCliente);

        if (enderecoCliente) {
            idEnderecoAtual = enderecoCliente.id_endereco;
            campoCep.value = aplicarMascaraCep(enderecoCliente.cep || "");
            campoEstado.value = (enderecoCliente.estado || "").toUpperCase();
            campoLogradouro.value = enderecoCliente.logradouro || "";
            campoNumero.value = enderecoCliente.numero || "";
            campoComplemento.value = enderecoCliente.complemento || "";
            campoBairro.value = enderecoCliente.bairro || "";
            campoCidade.value = enderecoCliente.cidade || "";
        }
    } catch (erro) {
        console.error("Erro ao buscar endereço do cliente:", erro);
    }
}

function validarESalvarDadosEndereco() {
    const cep = aplicarMascaraCep(campoCep.value.trim());
    const estado = campoEstado.value.trim().toUpperCase();
    const logradouro = campoLogradouro.value.trim();
    const numero = Number(campoNumero.value);
    const complemento = campoComplemento.value.trim();
    const bairro = campoBairro.value.trim();
    const cidade = campoCidade.value.trim();

    if (cep.replace(/\D/g, "").length !== 8) {
        throw new Error("Informe um CEP válido com 8 dígitos.");
    }
    if (!logradouro) {
        throw new Error("Informe o logradouro (rua/avenida) para entrega.");
    }
    if (isNaN(numero) || numero <= 0) {
        throw new Error("Informe um número de endereço válido (maior que 0).");
    }
    if (!bairro) {
        throw new Error("Informe o bairro para entrega.");
    }
    if (!cidade) {
        throw new Error("Informe a cidade para entrega.");
    }
    if (estado.length !== 2) {
        throw new Error("Informe a sigla do estado (UF) com 2 letras.");
    }

    return {
        cep,
        estado,
        logradouro,
        numero,
        complemento: complemento || null,
        bairro,
        cidade,
        id_cliente: idCliente
    };
}

async function salvarOuAtualizarEndereco(dadosEndereco) {
    const url = idEnderecoAtual ? `${API_ENDERECO}/${idEnderecoAtual}` : API_ENDERECO;
    const metodo = idEnderecoAtual ? "PUT" : "POST";

    const resp = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEndereco)
    });

    const dados = await resp.json();
    if (!resp.ok) {
        throw new Error(dados.erro || "Erro ao salvar o endereço de entrega.");
    }

    if (!idEnderecoAtual && dados.id) {
        idEnderecoAtual = dados.id;
    }
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
        const dadosEndereco = validarESalvarDadosEndereco();

        btnFinalizar.disabled = true;
        mensagem.textContent = "Salvando endereço e finalizando pedido...";

        // 1. Salva ou atualiza o endereço do cliente
        await salvarOuAtualizarEndereco(dadosEndereco);

        // 2. Registra a venda
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

        // 3. Finaliza o carrinho atual
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
            window.location.href = "../../index.html";
        }, 1800);
    } catch (erro) {
        mensagem.textContent = erro.message;
        btnFinalizar.disabled = false;
    }
});

async function iniciar() {
    if (!idCliente) {
        listaItens.innerHTML = `
            <div class="vazio">
                <p>Faça login para acessar seu carrinho de compras.</p>
                <a href="../login/login.html" class="botao-principal">Ir para o Login</a>
            </div>
        `;
        btnFinalizar.disabled = true;
        return;
    }

    try {
        carrinhoAtual = await obterOuCriarCarrinho();
        await Promise.all([carregarItens(), carregarEnderecoCliente()]);
    } catch (erro) {
        mensagem.textContent = erro.message;
    }
}

iniciar();