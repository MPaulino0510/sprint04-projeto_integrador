import * as clienteModel from "../models/clienteModel.js";
import { textoValido } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await clienteModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await clienteModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const { nome, cpf_cnpj, telefone, tipo_cultura } = req.body ?? {};

        if (!textoValido(nome, 100) || !textoValido(cpf_cnpj, 18) || !textoValido(telefone, 15)) {
            return res.status(400).json({ 
                erro: "Informe nome (até 100), cpf_cnpj (até 18) e telefone (até 15 caracteres)" 
            });
        }

        const dados = { 
            nome: nome.trim(), 
            cpf_cnpj: cpf_cnpj.trim(), 
            telefone: telefone.trim(), 
            tipo_cultura: tipo_cultura ? tipo_cultura.trim() : "Geral" 
        };

        const resultado = await clienteModel.criar(dados);
        return res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const id = req.params.id;
        const { nome, cpf_cnpj, telefone, tipo_cultura } = req.body ?? {};

        if (!textoValido(nome, 100) || !textoValido(cpf_cnpj, 18) || !textoValido(telefone, 15)) {
            return res.status(400).json({ 
                erro: "Informe nome (até 100), cpf_cnpj (até 18) e telefone (até 15 caracteres)" 
            });
        }

        const dados = { 
            nome: nome.trim(), 
            cpf_cnpj: cpf_cnpj.trim(), 
            telefone: telefone.trim(), 
            tipo_cultura: tipo_cultura ? tipo_cultura.trim() : "Geral" 
        };

        const registros = await clienteModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }

        await clienteModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Cliente atualizado com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await clienteModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Cliente não encontrado" });
        }
        return res.status(200).json({ mensagem: "Cliente excluído com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}