const btnIrPainel = document.getElementById("btn-ir-painel");
const btnSair = document.getElementById("btn-sair");

const token = localStorage.getItem("token");
if (token) {
  document.querySelectorAll(".apenas-deslogado").forEach((botao) => {
    botao.style.display = "none";
  });
}

if (btnIrPainel) {
  btnIrPainel.addEventListener("click", () => {
    const tokenAtual = localStorage.getItem("token");

    if (!tokenAtual) {
      alert("Você precisa fazer login para acessar o painel.");
      window.location.href = "pages/login/login.html";
      return;
    }

    window.location.href = "pages/painel/painel.html";
  });
}

if (btnSair) {
  btnSair.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id_login");
    localStorage.removeItem("id_cliente");
    window.location.href = "pages/login/login.html";
  });
}