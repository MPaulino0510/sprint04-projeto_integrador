import * as clienteModel from "../models/clienteModel.js"
import * as loginModel from "../models/loginModel.js";
import { textoValido } from "../utils/validacoes.js";

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
        const id = req.params.id;
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

        //
        //
        //
        //

        
        if(email.includes)

        //
        //
        //
        //

        const clienteExiste = await clienteModel.buscarPorId(id_cliente);
        if (clienteExiste.length === 0) {
            return res.status(400).json({ erro: "O cliente informado não existe" });
        }

        const dados = { 
            email: email.trim(), 
            senha: senha.trim(), 
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

export async function atualizar(req, res, next) {
    try {
        const id = req.params.id;
        const { email, senha, id_cliente } = req.body ?? {};

        if (!textoValido(email, 100) || !textoValido(senha, 100) || !id_cliente) {
            return res.status(400).json({ 
                erro: "Informe email (até 100 caracteres), senha (até 100 caracteres) e id_cliente." 
            });
        }

        const dados = { 
            email: email.trim(), 
            senha: senha.trim(), 
            id_cliente: Number(id_cliente)
        };

        const registros = await loginModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Login não encontrado" });
        }

        await loginModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Login atualizado com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await loginModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Login não encontrado" });
        }
        return res.status(200).json({ mensagem: "Login excluído com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

