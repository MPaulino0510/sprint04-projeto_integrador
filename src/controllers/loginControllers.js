import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as clienteModel from "../models/clienteModel.js";
import * as loginModel from "../models/loginModel.js";
import { textoValido, validacaoEmail } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await loginModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (id !== req.usuario.id_login) {
            return res.status(403).json({ erro: "Você não tem permissão para visualizar este login." });
        }

        const resultado = await loginModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Login não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const { email, senha, id_cliente } = req.body ?? {};
        
        if (!textoValido(email, 100) || !textoValido(senha, 100) || !id_cliente) {
            return res.status(400).json({ 
                erro: "Informe email (até 100 caracteres), senha (até 100 caracteres) e id_cliente obrigatoriamente." 
            });
        }

        if (validacaoEmail(email) === false) {
            return res.status(400).json({
                erro: "Informe o email corretamente."
            });
        }

        const clienteExiste = await clienteModel.buscarPorId(id_cliente);
        if (clienteExiste.length === 0) {
            return res.status(400).json({ erro: "O cliente informado não existe" });
        }

        const senhaHash = await bcrypt.hash(senha.trim(), 10);

        const dados = { 
            email: email.trim(), 
            senha: senhaHash, 
            id_cliente: Number(id_cliente)
        };

        const resultado = await loginModel.criar(dados);
        return res.status(201).json({
            mensagem: "Login cadastrado com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function autenticar(req, res, next) {
    try {
        const { email, senha } = req.body ?? {};

        if (!email || !senha) {
            return res.status(400).json({ erro: "Informe email e senha." });
        }

        const resultado = await loginModel.buscarPorEmail(email.trim());
        if (resultado.length === 0) {
            return res.status(401).json({ erro: "Email ou senha incorretos." });
        }

        const usuario = resultado[0];
        const senhaValida = await bcrypt.compare(senha.trim(), usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ erro: "Email ou senha incorretos." });
        }

        const token = jwt.sign(
            {
                id_login: usuario.id_login,
                id_cliente: usuario.id_cliente,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "4h" }
        );

        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            token,
            id_login: usuario.id_login,
            id_cliente: usuario.id_cliente
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (id !== req.usuario.id_login) {
            return res.status(403).json({ erro: "Você só tem permissão para alterar o seu próprio login." });
        }

        const { email, senha, id_cliente } = req.body ?? {};

        if (!textoValido(email, 100) || !textoValido(senha, 100) || !id_cliente) {
            return res.status(400).json({ 
                erro: "Informe email (até 100 caracteres), senha (até 100 caracteres) e id_cliente." 
            });
        }
        if (validacaoEmail(email) === false) {
            return res.status(400).json({
                erro: "Informe o email corretamente."
            });
        }

        const registros = await loginModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Login não encontrado" });
        }

        const senhaHash = await bcrypt.hash(senha.trim(), 10);

        const dados = { 
            email: email.trim(), 
            senha: senhaHash, 
            id_cliente: Number(id_cliente)
        };

        await loginModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Login atualizado com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (id !== req.usuario.id_login) {
            return res.status(403).json({ erro: "Você só tem permissão para excluir o seu próprio login." });
        }

        const resultado = await loginModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Login não encontrado" });
        }
        return res.status(200).json({ mensagem: "Login excluído com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}