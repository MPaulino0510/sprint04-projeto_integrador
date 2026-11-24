# Projeto Integrador — AgriTech Solutions (API REST e Plataforma Web)

**Turma:** DS1B  
**Equipe:** Brenda Andrade, Miguel Silva e Victória Dantas

## 1. Objetivo

Desenvolver e executar uma aplicação web full-stack com API REST utilizando **Node.js, Express e MySQL/MariaDB**, implementando as quatro operações básicas de um CRUD completo, autenticação segura e integração com front-end:

* **CREATE (POST):** cadastrar clientes, logins, endereços, carrinhos, itens de compra, vendas, notas fiscais e solicitações de consultoria.
* **READ (GET):** consultar registros gerais ou buscar por identificador (`:id`).
* **UPDATE (PUT):** atualizar dados cadastrais, credenciais, endereços, quantidades e status de pedidos.
* **DELETE (DELETE):** excluir registros e remover itens do carrinho ou conta.

O banco de dados relacional do sistema é composto por 8 tabelas principais: `cliente`, `login`, `endereco`, `carrinho_de_compra`, `compra`, `venda`, `nota_fiscal` e `consulta`.

## 2. Tecnologias utilizadas

* **Node.js** — ambiente de execução JavaScript no servidor.
* **Express (v5)** — framework para criação de servidores HTTP e rotas REST.
* **MySQL / MariaDB** — sistema gerenciador de banco de dados relacional.
* **MySQL2 (`mysql2/promise`)** — biblioteca de conexão assíncrona com pool de conexões.
* **CORS** — middleware que permite requisições entre o front-end e o back-end.
* **dotenv** — carregamento de variáveis de ambiente a partir do arquivo `.env`.
* **bcrypt** — criptografia (hash) e comparação segura de senhas.
* **jsonwebtoken (JWT)** — geração e validação de tokens de autenticação.
* **HTML5, CSS3 e JavaScript (ES6+)** — construção das interfaces do front-end.
* **Bruno (OpenCollection)** — cliente de API utilizado para testar os endpoints via arquivos `.yml`.

## 3. Pré-requisitos

Antes de começar, instale os seguintes programas:

1. **Node.js (versão LTS):** https://nodejs.org/
2. **MySQL ou MariaDB:** https://mariadb.org/
3. **Visual Studio Code:** https://code.visualstudio.com/
4. **Bruno (ou Postman/Insomnia):** https://www.usebruno.com/

Para verificar se o Node.js e o npm estão instalados corretamente, abra o terminal e execute:

```bash
node -v
npm -v
```

Se aparecerem os números das versões, a instalação foi realizada com sucesso.

## 4. Estrutura do projeto

A organização dos diretórios e arquivos do projeto segue a arquitetura em camadas:

```text
sprint04-projeto_integrador-main/
│
├── config/
│   └── db.js                      # Configuração do pool de conexão com o banco
│
├── front-end/
│   └── src/
│       ├── index.html             # Página inicial institucional
│       ├── app.js                 # Controle global de sessão e navegação
│       ├── style.css              # Estilos globais
│       └── pages/
│           ├── landing/           # Catálogo de produtos e adição ao carrinho
│           ├── login/             # Telas de login e cadastro de clientes
│           ├── cart/              # Carrinho de compras e checkout
│           └── painel/            # Painel do cliente e solicitação de consultoria
│
├── Projeto Integrador/            # Coleção de testes da API (Bruno .yml)
│
├── src/
│   ├── controllers/               # Regras de negócio e respostas HTTP
│   ├── middlewares/               # Autenticação JWT, validação de ID e erros
│   ├── models/                    # Queries SQL parametrizadas
│   ├── routes/                    # Definição dos endpoints da API
│   └── utils/                     # Funções auxiliares de validação de dados
│
├── .env                           # Variáveis de ambiente (não versionado)
├── .gitignore                     # Arquivos e pastas ignorados pelo Git
├── db.sql                         # Script SQL de criação do banco e tabelas
├── package.json                   # Dependências e scripts do projeto
├── package-lock.json              # Controle exato das versões instaladas
├── README.md                      # Documentação do projeto
└── server.js                      # Arquivo principal de inicialização do Express
```

### Função de cada pasta e arquivo

| Pasta / Arquivo | Responsabilidade |
| :--- | :--- |
| `config/db.js` | Estabelece o pool de conexões com o MySQL/MariaDB usando `mysql2/promise` |
| `src/routes/` | Mapeia os métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`) para os controllers |
| `src/controllers/` | Valida regras de negócio, gera tokens/hashes e monta as respostas JSON |
| `src/models/` | Executa os comandos SQL (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) no banco |
| `src/middlewares/` | Intercepta requisições para validar token JWT (`autenticarToken.js`), IDs (`validarId.js`) e erros (`tratarErro.js`) |
| `src/utils/` | Funções reutilizáveis de validação de e-mail, texto e números (`validacoes.js`) |
| `front-end/` | Interface web modularizada por páginas que consome a API via `fetch` |
| `Projeto Integrador/` | Arquivos `.yml` com requisições prontas para testar a API no Bruno |
| `db.sql` | Script SQL com a estrutura das tabelas do banco de dados |
| `.env` | Armazena credenciais do banco, porta do servidor e chave secreta JWT |
| `package.json` | Lista as dependências e comandos de execução do projeto |
| `server.js` | Configura middlewares globais, registra todas as rotas e inicia o servidor |

## 5. Preparar o projeto

Abra a pasta raiz do projeto (`sprint04-projeto_integrador-main`) no Visual Studio Code.

No terminal integrado do VS Code, execute:

```bash
npm install
```

Esse comando lê o arquivo `package.json` e instala automaticamente todas as dependências necessárias (`express`, `mysql2`, `cors`, `dotenv`, `bcrypt`, `jsonwebtoken`, entre outras) dentro da pasta `node_modules/`.

**Atenção:** não é necessário copiar a pasta `node_modules/` de outro computador, pois ela é recriada automaticamente pelo `npm install`.

## 6. Configurar o banco de dados

Abra o MySQL ou MariaDB utilizando **HeidiSQL, DBeaver, MySQL Workbench** ou o terminal SQL de sua preferência.

1. Abra o arquivo `db.sql` localizado na raiz do projeto.
2. Execute todo o script para criar o banco de dados e as 8 tabelas (`cliente`, `login`, `endereco`, `carrinho_de_compra`, `compra`, `venda`, `nota_fiscal` e `consulta`).

Para confirmar se todas as tabelas foram criadas corretamente, execute:

```sql
SHOW TABLES;
```

Para consultar os registros de clientes após os primeiros cadastros:

```sql
SELECT * FROM cliente;
```

## 7. Configurar o arquivo `.env`

Na raiz do projeto, crie ou edite o arquivo `.env` seguindo o modelo abaixo:

```env
PORTA=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=projeto_integrador
JWT_SECRET=sua_chave_secreta_jwt
```

**Importante:**

* Substitua `DB_PASSWORD` pela senha configurada no seu MySQL/MariaDB. Caso não utilize senha localmente, deixe em branco (`DB_PASSWORD=`).
* Substitua `DB_NAME` pelo nome exato do banco criado no script `db.sql`.
* Defina uma frase secreta forte em `JWT_SECRET` para assinar os tokens de autenticação.
* **Nunca** envie o arquivo `.env` para repositórios públicos no GitHub.

## 8. Entendendo os arquivos principais

### Conexão com o banco (`config/db.js`)

O arquivo `config/db.js` carrega as variáveis do `.env` e cria um **pool de conexões** assíncrono com o banco:

```javascript
require("dotenv").config();
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = db;
```

### Servidor principal (`server.js`)

O `server.js` inicializa o Express, libera o CORS, habilita a leitura de JSON no corpo das requisições, conecta todos os arquivos de rotas e finaliza com o tratamento de rotas inexistentes (`404`) e erros globais:

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Registro das rotas da API (/cliente, /login, /endereco, /carrinho, /compra, /venda, /notafiscal, /consulta)
```

## 9. Executar o projeto

### Back-end (API)

Certifique-se de que o serviço do MySQL/MariaDB esteja ativo. No terminal, dentro da raiz do projeto, execute:

```bash
npm run dev
```

*(Ou, se preferir rodar diretamente com o Node: `node server.js`)*

Resultado esperado no terminal:

```text
Servidor iniciado em http://localhost:3000
```

**Atenção:** mantenha esse terminal aberto enquanto estiver utilizando o sistema. Para encerrar o servidor, pressione `Ctrl + C`.

### Front-end (Interface Web)

1. No Visual Studio Code, instale a extensão **Live Server** (caso ainda não tenha).
2. Navegue até `front-end/src/index.html`.
3. Clique com o botão direito sobre o arquivo e selecione **Open with Live Server**.

## 10. Testar as rotas da API

Você pode importar a pasta `Projeto Integrador/` diretamente no cliente **Bruno** (todos os endpoints já estão configurados nos arquivos `.yml`) ou utilizar o **Postman / Insomnia**.

Endereço base da API:

```text
http://localhost:3000
```

### 1. Verificar status da API (`GET`)

* **URL:** `http://localhost:3000/`
* **Resultado esperado:** mensagem confirmando que a API está em funcionamento.

### 2. Cadastrar um cliente (`POST`)

* **Método:** `POST`
* **URL:** `http://localhost:3000/cliente`
* **Body (JSON):**

```json
{
  "nome": "Carlos Eduardo",
  "cpf_cnpj": "12345678901",
  "telefone": "11999998888"
}
```

* **Resultado esperado (`201 Created`):**

```json
{
  "mensagem": "Cliente cadastrado com sucesso!",
  "id_cliente": 1
}
```

### 3. Criar credencial de login (`POST`)

* **Método:** `POST`
* **URL:** `http://localhost:3000/login`
* **Body (JSON):**

```json
{
  "id_cliente": 1,
  "email": "carlos@agritech.com",
  "senha": "SenhaForte123"
}
```

*(A senha será criptografada automaticamente com `bcrypt` antes de ser salva no banco.)*

### 4. Realizar login e obter o Token JWT (`POST`)

* **Método:** `POST`
* **URL:** `http://localhost:3000/login/entrar`
* **Body (JSON):**

```json
{
  "email": "carlos@agritech.com",
  "senha": "SenhaForte123"
}
```

* **Resultado esperado (`200 OK`):** retorna os dados da sessão e o `token` JWT válido por 4 horas.

### 5. Acessar rota protegida com Token (`GET` / `PUT` / `DELETE`)

Nas rotas protegidas pelo middleware `autenticarToken` (como `GET /login/1` ou `PUT /login/1`), envie o token no cabeçalho (**Headers**):

```text
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

## 11. Resumo das rotas

| Método | Endpoint | Protegida (JWT) | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Não | Verifica se a API está online |
| `GET` | `/cliente` e `/cliente/:id` | Não | Lista todos os clientes ou busca por ID |
| `POST` | `/cliente` | Não | Cadastra um novo cliente |
| `PUT` | `/cliente/:id` | Não | Atualiza os dados de um cliente |
| `DELETE` | `/cliente/:id` | Não | Exclui um cliente |
| `POST` | `/login` | Não | Cadastra e-mail e senha criptografada |
| `POST` | `/login/entrar` | Não | Autentica o usuário e gera o token JWT |
| `GET` | `/login` e `/login/:id` | Sim (`/:id`) | Consulta credenciais de login |
| `PUT` | `/login/:id` | Sim | Atualiza e-mail ou senha do próprio usuário |
| `DELETE` | `/login/:id` | Sim | Remove o login do próprio usuário |
| `CRUD` | `/endereco` e `/endereco/:id` | Não | Gerencia endereços vinculados ao cliente |
| `CRUD` | `/carrinho` e `/carrinho/:id` | Não | Gerencia carrinhos de compra |
| `CRUD` | `/compra` e `/compra/:id` | Não | Gerencia itens adicionados ao carrinho |
| `CRUD` | `/venda` e `/venda/:id` | Não | Registra e consulta pedidos finalizados |
| `CRUD` | `/notafiscal` e `/notafiscal/:id` | Não | Emite e consulta notas fiscais |
| `CRUD` | `/consulta` e `/consulta/:id` | Não | Registra e acompanha consultorias agronômicas |

## 12. Possíveis erros e soluções

**Erro: `Cannot find module 'express'` (ou `bcrypt`, `jsonwebtoken`, `mysql2`)**

* **Causa:** as dependências ainda não foram instaladas.
* **Solução:** execute `npm install` no terminal da raiz do projeto.

**Erro: `ECONNREFUSED`**

* **Causa:** o serviço do MySQL/MariaDB está desligado ou rodando em outra porta.
* **Solução:** inicie o serviço do banco de dados no seu computador e confira o `DB_HOST` no `.env`.

**Erro: `Access denied for user 'root'`**

* **Causa:** usuário ou senha incorretos no `.env`.
* **Solução:** verifique os valores de `DB_USER` e `DB_PASSWORD` no arquivo `.env`.

**Erro: `Unknown database '...'` ou `Table '...' doesn't exist`**

* **Causa:** o banco de dados ou as tabelas ainda não foram criados.
* **Solução:** abra o arquivo `db.sql` e execute todos os comandos SQL no seu SGBD.

**Erro: `EADDRINUSE: address already in use :::3000`**

* **Causa:** já existe outro processo rodando na porta `3000`.
* **Solução:** encerre o processo antigo ou altere o valor de `PORTA` no arquivo `.env` e reinicie o servidor.

**Erro: `401 Acesso negado` ou `403 Token inválido ou expirado`**

* **Causa:** tentativa de acessar rota protegida sem enviar o token JWT, com token expirado (após 4h) ou com `JWT_SECRET` ausente no `.env`.
* **Solução:** faça login novamente em `POST /login/entrar`, copie o novo token e envie no header `Authorization: Bearer <token>`.

## 13. Considerações finais

Com a estrutura deste projeto, aplicamos na prática:

* Arquitetura em camadas no back-end (`Routes` → `Controllers` → `Models`).
* Uso de middlewares para autenticação JWT, validação de parâmetros e tratamento centralizado de erros.
* Criptografia de senhas com `bcrypt` e proteção contra *SQL Injection* com queries parametrizadas.
* Comunicação assíncrona entre front-end modularizado e API REST.
* Documentação e testes automatizados de endpoints com coleções `.yml` no Bruno.

## 14. Equipe de desenvolvimento

Projeto desenvolvido pelos alunos da **Turma DS1B**:

* **Brenda Andrade**
* **Miguel Silva**
* **Victória Dantas**