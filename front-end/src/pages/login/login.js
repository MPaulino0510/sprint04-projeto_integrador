const form = document.getElementById("form-login");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const resposta = await fetch("http://localhost:3000/login/entrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || "E-mail ou senha inválidos.");
      return;
    }

    localStorage.setItem("token", dados.token);
    localStorage.setItem("id_login", dados.id_login);
    localStorage.setItem("id_cliente", dados.id_cliente);

    window.location.href = "../../index.html";
  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
  }
});