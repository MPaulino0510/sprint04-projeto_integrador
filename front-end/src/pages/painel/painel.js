const token = localStorage.getItem("token");
const idLogin = localStorage.getItem("id_login");
const idCliente = localStorage.getItem("id_cliente");

if (!token) {
  window.location.href = "../login/login.html";
}

document.getElementById("btn-sair").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("id_login");
  localStorage.removeItem("id_cliente");
  window.location.href = "../login/login.html";
});

document.getElementById("form-editar").addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = document.getElementById("novo-email").value;
  const senha = document.getElementById("nova-senha").value;

  try {
    const resposta = await fetch(`http://localhost:3000/login/${idLogin}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        email,
        senha,
        id_cliente: Number(idCliente)
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || "Erro ao atualizar.");
      return;
    }

    alert(dados.mensagem);
  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
  }
});