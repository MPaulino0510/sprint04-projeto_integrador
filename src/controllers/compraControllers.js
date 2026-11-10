import * as compraModel from "../models/compraModel.js";
import * as carrinhoModel from "../models/carrinho_de_compraModel.js";
import { textoValido } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await compraModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await compraModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Item de compra não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const { nome_produto, categoria, quantidade, preco_unitario, id_carrinho } = req.body ?? {};

        const qtd = Number(quantidade);
        const preco = Number(preco_unitario);
        const idCarrinhoNum = Number(id_carrinho);

        if (!textoValido(nome_produto, 100) || !textoValido(categoria, 50) || isNaN(qtd) || qtd <= 0 || isNaN(preco) || preco <= 0 || !idCarrinhoNum) {
            return res.status(400).json({ 
                erro: "Informe nome_produto (até 100), categoria (até 50), quantidade (> 0), preco_unitario (> 0) e id_carrinho válidos." 
            });
        }

        const carrinhoExiste = await carrinhoModel.buscarPorId(idCarrinhoNum);
        if (carrinhoExiste.length === 0) {
            return res.status(400).json({ erro: "O carrinho informado não existe" });
        }

        const dados = { 
            nome_produto: nome_produto.trim(), 
            categoria: categoria.trim(), 
            quantidade: qtd, 
            preco_unitario: preco, 
            id_carrinho: idCarrinhoNum 
        };

        const resultado = await compraModel.criar(dados);
        return res.status(201).json({
            mensagem: "Item de compra adicionado com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const id = req.params.id;
        const { nome_produto, categoria, quantidade, preco_unitario, id_carrinho } = req.body ?? {};

        const qtd = Number(quantidade);
        const preco = Number(preco_unitario);
        const idCarrinhoNum = Number(id_carrinho);

        if (!textoValido(nome_produto, 100) || !textoValido(categoria, 50) || isNaN(qtd) || qtd <= 0 || isNaN(preco) || preco <= 0 || !idCarrinhoNum) {
            return res.status(400).json({ 
                erro: "Informe nome_produto (até 100), categoria (até 50), quantidade (> 0), preco_unitario (> 0) e id_carrinho válidos." 
            });
        }

        const registros = await compraModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Item de compra não encontrado" });
        }

        const dados = { 
            nome_produto: nome_produto.trim(), 
            categoria: categoria.trim(), 
            quantidade: qtd, 
            preco_unitario: preco, 
            id_carrinho: idCarrinhoNum 
        };

        await compraModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Item de compra atualizado com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await compraModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Item de compra não encontrado" });
        }
        return res.status(200).json({ mensagem: "Item de compra excluído com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}