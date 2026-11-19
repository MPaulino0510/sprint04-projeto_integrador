const form = document.getElementById("form-cadastro");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("nome").value;
  const cpf_cnpj = document.getElementById("cpf_cnpj").value;
  const telefone = document.getElementById("telefone").value;
  const tipo_cultura = document.getElementById("tipo_cultura").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

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