const itensCarrossel = document.querySelectorAll("#track > .card");
const btnEsquerda = document.getElementById("prevBtn");
const btnDireita = document.getElementById("nextBtn");
const botoesAdicionar = document.querySelectorAll(".btn-add");
const contadorCarrinho = document.getElementById("contadorCarrinho");

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

function atualizarContador() {
  if (!contadorCarrinho) return;
  const carrinho = JSON.parse(localStorage.getItem("carrinhoAgriTech")) || [];
  const total = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
  contadorCarrinho.textContent = total;
}

botoesAdicionar.forEach((botao) => {
  botao.addEventListener("click", () => {
    const id = Number(botao.dataset.id);
    const nome = botao.dataset.nome;
    const preco = Number(botao.dataset.preco);

    const carrinho = JSON.parse(localStorage.getItem("carrinhoAgriTech")) || [];
    const itemExistente = carrinho.find((item) => item.id === id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({ id, nome, preco, quantidade: 1 });
    }

    localStorage.setItem("carrinhoAgriTech", JSON.stringify(carrinho));
    atualizarContador();
    alert(`"${nome}" adicionado ao carrinho!`);
  });
});

atualizarContador();