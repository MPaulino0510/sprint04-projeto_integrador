const API_CARRINHO = "http://localhost:3000/carrinho";
const API_COMPRA = "http://localhost:3000/compra";

const itensCarrossel = document.querySelectorAll("#track > .card");
const btnEsquerda = document.getElementById("prevBtn");
const btnDireita = document.getElementById("nextBtn");
const botoesAdicionar = document.querySelectorAll(".btn-add");
const contadorCarrinho = document.getElementById("contadorCarrinho");

const idCliente = Number(localStorage.getItem("id_cliente"));

let indiceAtual = 0;
let temporizador;

function atualizarCarrossel() {
  itensCarrossel.forEach((item, index) => {
    if (index === indiceAtual) {
      item.classList.add("ativa");
    } else {
      item.classList.remove("ativa");
    }
  });
}

function proximoCard() {
  indiceAtual++;
  if (indiceAtual >= itensCarrossel.length) {
    indiceAtual = 0;
  }
  atualizarCarrossel();
  reiniciarTemporizador();
}

function cardAnterior() {
  indiceAtual--;
  if (indiceAtual < 0) {
    indiceAtual = itensCarrossel.length - 1;
  }
  atualizarCarrossel();
  reiniciarTemporizador();
}

function reiniciarTemporizador() {
  clearTimeout(temporizador);
  temporizador = setTimeout(proximoCard, 8000);
}

btnDireita.addEventListener("click", proximoCard);
btnEsquerda.addEventListener("click", cardAnterior);

atualizarCarrossel();
reiniciarTemporizador();

async function obterOuCriarCarrinho() {
  const resposta = await fetch(API_CARRINHO);
  if (!resposta.ok) {
    throw new Error("Erro ao buscar carrinho no servidor.");
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

async function atualizarContador() {
  if (!contadorCarrinho || !idCliente) return;

  try {
    const respCarrinhos = await fetch(API_CARRINHO);
    const carrinhos = await respCarrinhos.json();
    const aberto = carrinhos.find(
      (c) => c.id_cliente === idCliente && c.status_carrinho === "Aberto"
    );

    if (!aberto) {
      contadorCarrinho.textContent = "0";
      return;
    }

    const respCompras = await fetch(API_COMPRA);
    const compras = await respCompras.json();
    const itensDoCliente = compras.filter(
      (item) => item.id_carrinho === aberto.id_carrinho
    );

    const total = itensDoCliente.reduce((soma, item) => soma + Number(item.quantidade), 0);
    contadorCarrinho.textContent = total;
  } catch (erro) {
    console.error("Erro ao atualizar contador do carrinho:", erro);
  }
}

botoesAdicionar.forEach((botao) => {
  botao.addEventListener("click", async () => {
    if (!idCliente) {
      alert("Faça login antes de adicionar produtos ao carrinho.");
      window.location.href = "../../index.html";
      return;
    }

    const nome = botao.dataset.nome;
    const categoria = botao.dataset.categoria || "Geral";
    const preco = Number(botao.dataset.preco);

    try {
      botao.disabled = true;

      const carrinho = await obterOuCriarCarrinho();

      const respCompras = await fetch(API_COMPRA);
      const compras = await respCompras.json();
      const itemExistente = compras.find(
        (item) =>
          item.id_carrinho === carrinho.id_carrinho &&
          item.nome_produto === nome
      );

      if (itemExistente) {
        const respPut = await fetch(`${API_COMPRA}/${itemExistente.id_compra}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome_produto: itemExistente.nome_produto,
            categoria: itemExistente.categoria,
            quantidade: Number(itemExistente.quantidade) + 1,
            preco_unitario: Number(itemExistente.preco_unitario),
            id_carrinho: carrinho.id_carrinho
          })
        });

        if (!respPut.ok) {
          throw new Error("Não foi possível atualizar a quantidade no carrinho.");
        }
      } else {
        const respPost = await fetch(API_COMPRA, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome_produto: nome,
            categoria: categoria,
            quantidade: 1,
            preco_unitario: preco,
            id_carrinho: carrinho.id_carrinho
          })
        });

        const dadosPost = await respPost.json();
        if (!respPost.ok) {
          throw new Error(dadosPost.erro || "Não foi possível adicionar o produto.");
        }
      }

      await atualizarContador();
      alert(`"${nome}" adicionado ao carrinho!`);
    } catch (erro) {
      alert(erro.message);
    } finally {
      botao.disabled = false;
    }
  });
});

atualizarContador();