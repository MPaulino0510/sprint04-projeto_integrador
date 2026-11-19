const form = document.getElementById("form-cadastro");
const campoSenha = document.getElementById("senha");
const btnToggleSenha = document.getElementById("btnToggleSenha");

const iconeOlhoAberto = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>`;

const iconeOlhoFechado = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>`;

btnToggleSenha.addEventListener("click", () => {
  const isPassword = campoSenha.type === "password";
  campoSenha.type = isPassword ? "text" : "password";
  btnToggleSenha.innerHTML = isPassword ? iconeOlhoFechado : iconeOlhoAberto;
});

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("nome").value;
  const cpf_cnpj = document.getElementById("cpf_cnpj").value;
  const telefone = document.getElementById("telefone").value;
  const tipo_cultura = document.getElementById("tipo_cultura").value;
  const email = document.getElementById("email").value;
  const senha = campoSenha.value;

  try {
    const respCliente = await fetch("http://localhost:3000/cliente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        cpf_cnpj,
        telefone,
        tipo_cultura: tipo_cultura || "Geral"
      })
    });

    const dadosCliente = await respCliente.json();

    if (!respCliente.ok) {
      alert(dadosCliente.erro || "Erro ao cadastrar dados do cliente.");
      return;
    }

    const novoIdCliente = dadosCliente.id;

    const respLogin = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        senha,
        id_cliente: novoIdCliente
      })
    });

    const dadosLogin = await respLogin.json();

    if (!respLogin.ok) {
      alert(dadosLogin.erro || "Cliente criado, mas houve erro ao criar o login.");
      return;
    }

    alert("Conta criada com sucesso! Agora faça seu login.");
    window.location.href = "login.html";

  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
  }
});