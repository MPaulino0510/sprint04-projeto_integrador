import * as carrinhoModel from "../models/carrinho_de_compraModel.js";
import * as clienteModel from "../models/clienteModel.js";
import { textoValido } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await carrinhoModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await carrinhoModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Carrinho não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const { status_carrinho, data_criacao, id_cliente } = req.body ?? {};

        if (!textoValido(status_carrinho, 50) || !id_cliente) {
            return res.status(400).json({ 
                erro: "Informe status_carrinho (até 50 caracteres) e id_cliente obrigatoriamente." 
            });
        }

        const idClienteNum = Number(id_cliente);
        const clienteExiste = await clienteModel.buscarPorId(idClienteNum);
        if (clienteExiste.length === 0) {
            return res.status(400).json({ erro: "O cliente informado não existe" });
        }

        const dados = { 
            status_carrinho: status_carrinho.trim(), 
            data_criacao: data_criacao || new Date(), 
            id_cliente: idClienteNum 
        };

        const resultado = await carrinhoModel.criar(dados);
        return res.status(201).json({
            mensagem: "Carrinho criado com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const id = req.params.id;
        const { status_carrinho, data_criacao, id_cliente } = req.body ?? {};

        if (!textoValido(status_carrinho, 50) || !id_cliente) {
            return res.status(400).json({ 
                erro: "Informe status_carrinho e id_cliente válidos." 
            });
        }

        const registros = await carrinhoModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Carrinho não encontrado" });
        }

        const dados = { 
            status_carrinho: status_carrinho.trim(), 
            data_criacao: data_criacao || registros[0].data_criacao, 
            id_cliente: Number(id_cliente) 
        };

        await carrinhoModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Carrinho atualizado com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await carrinhoModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Carrinho não encontrado" });
        }
        return res.status(200).json({ mensagem: "Carrinho excluído com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}