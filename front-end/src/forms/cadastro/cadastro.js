console.log("cadastro.js funcionando!");

const API_CLIENTE = "http://localhost:3000/cliente";
const API_LOGIN = "http://localhost:3000/login";

const mensagem = document.getElementById("mensagem");
const formulario = document.getElementById("formCadastro");
const btnCadastrar = document.getElementById("btnCadastrar");

const campoNome = document.getElementById("nome");
const campoCpfCnpj = document.getElementById("cpf_cnpj");
const campoTelefone = document.getElementById("telefone");
const campoTipoCultura = document.getElementById("tipo_cultura");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const cpf_cnpj = campoCpfCnpj.value.trim();
    const telefone = campoTelefone.value.trim();
    const tipo_cultura = campoTipoCultura.value.trim() || "Geral";
    const email = campoEmail.value.trim();
    const senha = campoSenha.value.trim();

    if (!nome || !cpf_cnpj || !telefone || !email || !senha) {
        mensagem.textContent = "Preencha todos os campos obrigatórios.";
        return;
    }

    if (telefone.length > 15) {
        mensagem.textContent = "O telefone deve ter no máximo 15 caracteres.";
        return;
    }

    try {
        mensagem.textContent = "Cadastrando...";
        btnCadastrar.disabled = true;

        const respostaCliente = await fetch(API_CLIENTE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                cpf_cnpj,
                telefone,
                tipo_cultura
            })
        });

        const dadosCliente = await respostaCliente.json();

        if (!respostaCliente.ok) {
            throw new Error(dadosCliente.erro || "Não foi possível cadastrar os dados do cliente.");
        }

        const id_cliente = dadosCliente.id;

        const respostaLogin = await fetch(API_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha,
                id_cliente
            })
        });

        const dadosLogin = await respostaLogin.json();

        if (!respostaLogin.ok) {
            await fetch(`${API_CLIENTE}/${id_cliente}`, { method: "DELETE" });
            throw new Error(dadosLogin.erro || "Não foi possível cadastrar o e-mail e senha.");
        }

        mensagem.textContent = "Cadastro realizado com sucesso! Redirecionando...";
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        mensagem.textContent = error.message;
    } finally {
        btnCadastrar.disabled = false;
    }
});