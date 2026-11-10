require('dotenv').config();
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT l.id_login, l.email, c.id_cliente, c.nome, c.cpf_cnpj, c.telefone, c.tipo_cultura FROM login l INNER JOIN cliente c ON l.id_cliente = c.id_cliente WHERE l.email = ? AND l.senha = ?',
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      usuario: rows[0]
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        c.id_cliente, c.nome, c.cpf_cnpj, c.telefone, c.tipo_cultura, 
        l.id_login, l.email, 
        cad.id_cadastro, cad.endereco, cad.cidade, cad.cep, cad.complemento
      FROM cliente c
      INNER JOIN login l ON c.id_cliente = l.id_cliente
      LEFT JOIN cadastro cad ON c.id_cliente = cad.id_cliente`
    );

    return res.status(200).json({
      total: rows.length,
      usuarios: rows
    });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ mensagem: 'Erro ao buscar informações do banco de dados.' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  const { 
    nome, cpf_cnpj, telefone, tipo_cultura, email, senha,
    endereco, cidade, cep, complemento
  } = req.body;

  if (!nome || !cpf_cnpj || !telefone || !email || !senha) {
    return res.status(400).json({ 
      mensagem: 'Os campos nome, cpf_cnpj, telefone, email e senha são obrigatórios.' 
    });
  }

  try {
    const [resultCliente] = await db.query(
      'INSERT INTO cliente (nome, cpf_cnpj, telefone, tipo_cultura) VALUES (?, ?, ?, ?)',
      [nome, cpf_cnpj, telefone, tipo_cultura || 'Geral']
    );
    const id_cliente = resultCliente.insertId;

    const [resultLogin] = await db.query(
      'INSERT INTO login (email, senha, id_cliente) VALUES (?, ?, ?)',
      [email, senha, id_cliente]
    );

    if (endereco && cidade && cep) {
      await db.query(
        'INSERT INTO cadastro (endereco, cidade, cep, complemento, id_cliente) VALUES (?, ?, ?, ?, ?)',
        [endereco, cidade, cep, complemento || null, id_cliente]
      );
    }

    return res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: {
        id_cliente,
        id_login: resultLogin.insertId,
        nome,
        cpf_cnpj,
        telefone,
        tipo_cultura: tipo_cultura || 'Geral',
        email
      }
    });

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});