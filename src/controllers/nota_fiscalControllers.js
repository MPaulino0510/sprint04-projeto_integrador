import * as notaFiscalModel from "../models/nota_fiscalModel.js";
import * as vendaModel from "../models/vendaModel.js";
import { textoValido } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await notaFiscalModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await notaFiscalModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Nota Fiscal não encontrada" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const { numero_nf, chave_acesso, id_venda } = req.body ?? {};

        const idVendaNum = Number(id_venda);

        if (!textoValido(numero_nf, 50) || !textoValido(chave_acesso, 44) || !idVendaNum) {
            return res.status(400).json({ 
                erro: "Informe numero_nf (até 50), chave_acesso (até 44) e id_venda válidos." 
            });
        }

        const vendaExiste = await vendaModel.buscarPorId(idVendaNum);
        if (vendaExiste.length === 0) {
            return res.status(400).json({ erro: "A venda informada não existe" });
        }

        const dados = { 
            numero_nf: numero_nf.trim(), 
            chave_acesso: chave_acesso.trim(), 
            id_venda: idVendaNum 
        };

        const resultado = await notaFiscalModel.criar(dados);
        return res.status(201).json({
            mensagem: "Nota Fiscal gerada com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const id = req.params.id;
        const { numero_nf, chave_acesso, id_venda } = req.body ?? {};

        const idVendaNum = Number(id_venda);

        if (!textoValido(numero_nf, 50) || !textoValido(chave_acesso, 44) || !idVendaNum) {
            return res.status(400).json({ 
                erro: "Informe numero_nf (até 50), chave_acesso (até 44) e id_venda válidos." 
            });
        }

        const registros = await notaFiscalModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Nota Fiscal não encontrada" });
        }

        const dados = { 
            numero_nf: numero_nf.trim(), 
            chave_acesso: chave_acesso.trim(), 
            id_venda: idVendaNum 
        };

        await notaFiscalModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Nota Fiscal atualizada com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await notaFiscalModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Nota Fiscal não encontrada" });
        }
        return res.status(200).json({ mensagem: "Nota Fiscal excluída com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}