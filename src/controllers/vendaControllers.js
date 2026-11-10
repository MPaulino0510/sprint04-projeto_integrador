import * as vendaModel from "../models/vendaModel.js";
import * as carrinhoModel from "../models/carrinho_de_compraModel.js";
import { textoValido } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await vendaModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await vendaModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Venda não encontrada" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const { data_venda, valor_total, forma_pagamento, status_pagamento, status_entrega, id_carrinho } = req.body ?? {};

        const valor = Number(valor_total);
        const idCarrinhoNum = Number(id_carrinho);

        if (
            isNaN(valor) || valor <= 0 ||
            !textoValido(forma_pagamento, 50) ||
            !textoValido(status_pagamento, 50) ||
            !textoValido(status_entrega, 50) ||
            !idCarrinhoNum
        ) {
            return res.status(400).json({ 
                erro: "Informe valor_total (> 0), forma_pagamento, status_pagamento, status_entrega e id_carrinho válidos." 
            });
        }

        const carrinhoExiste = await carrinhoModel.buscarPorId(idCarrinhoNum);
        if (carrinhoExiste.length === 0) {
            return res.status(400).json({ erro: "O carrinho informado não existe" });
        }

        const dados = { 
            data_venda: data_venda || new Date(),
            valor_total: valor,
            forma_pagamento: forma_pagamento.trim(),
            status_pagamento: status_pagamento.trim(),
            status_entrega: status_entrega.trim(),
            id_carrinho: idCarrinhoNum 
        };

        const resultado = await vendaModel.criar(dados);
        return res.status(201).json({
            mensagem: "Venda realizada com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const id = req.params.id;
        const { data_venda, valor_total, forma_pagamento, status_pagamento, status_entrega, id_carrinho } = req.body ?? {};

        const valor = Number(valor_total);
        const idCarrinhoNum = Number(id_carrinho);

        if (
            isNaN(valor) || valor <= 0 ||
            !textoValido(forma_pagamento, 50) ||
            !textoValido(status_pagamento, 50) ||
            !textoValido(status_entrega, 50) ||
            !idCarrinhoNum
        ) {
            return res.status(400).json({ 
                erro: "Informe valor_total (> 0), forma_pagamento, status_pagamento, status_entrega e id_carrinho válidos." 
            });
        }

        const registros = await vendaModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Venda não encontrada" });
        }

        const dados = { 
            data_venda: data_venda || registros[0].data_venda,
            valor_total: valor,
            forma_pagamento: forma_pagamento.trim(),
            status_pagamento: status_pagamento.trim(),
            status_entrega: status_entrega.trim(),
            id_carrinho: idCarrinhoNum 
        };

        await vendaModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Venda atualizada com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await vendaModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Venda não encontrada" });
        }
        return res.status(200).json({ mensagem: "Venda excluída com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}