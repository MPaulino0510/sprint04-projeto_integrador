const itensCarrossel = document.querySelectorAll("#track > .card");
const btnEsquerda = document.getElementById("prevBtn");
const btnDireita = document.getElementById("nextBtn");

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