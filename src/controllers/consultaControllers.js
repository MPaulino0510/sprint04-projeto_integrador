import * as consultaModel from "../models/consultaModel.js";
import * as clienteModel from "../models/clienteModel.js";
import { textoValido } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await consultaModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await consultaModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Consulta não encontrada" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const { descricao_tecnica, status_consulta, id_cliente } = req.body ?? {};

        const idClienteNum = Number(id_cliente);

        if (!textoValido(descricao_tecnica, 255) || !textoValido(status_consulta, 50) || !idClienteNum) {
            return res.status(400).json({ 
                erro: "Informe descricao_tecnica, status_consulta e id_cliente válidos." 
            });
        }

        const clienteExiste = await clienteModel.buscarPorId(idClienteNum);
        if (clienteExiste.length === 0) {
            return res.status(400).json({ erro: "O cliente informado não existe" });
        }

        const dados = { 
            descricao_tecnica: descricao_tecnica.trim(), 
            status_consulta: status_consulta.trim(), 
            id_cliente: idClienteNum 
        };

        const resultado = await consultaModel.criar(dados);
        return res.status(201).json({
            mensagem: "Consulta cadastrada com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const id = req.params.id;
        const { descricao_tecnica, status_consulta, id_cliente } = req.body ?? {};

        const idClienteNum = Number(id_cliente);

        if (!textoValido(descricao_tecnica, 255) || !textoValido(status_consulta, 50) || !idClienteNum) {
            return res.status(400).json({ 
                erro: "Informe descricao_tecnica, status_consulta e id_cliente válidos." 
            });
        }

        const registros = await consultaModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Consulta não encontrada" });
        }

        const dados = { 
            descricao_tecnica: descricao_tecnica.trim(), 
            status_consulta: status_consulta.trim(), 
            id_cliente: idClienteNum 
        };

        await consultaModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Consulta atualizada com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await consultaModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Consulta não encontrada" });
        }
        return res.status(200).json({ mensagem: "Consulta excluída com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}