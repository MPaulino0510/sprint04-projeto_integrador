import * as enderecoModel from "../models/enderecoModel.js";
import * as clienteModel from "../models/clienteModel.js";
import { textoValido } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await enderecoModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await enderecoModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Campos de endereço não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const {cidade, cep, complemento, id_cliente, estado, bairro, numero, logradouro} = req.body ?? {};

        if (!textoValido(cidade, 50) || !textoValido(cep, 9) || !id_cliente || !textoValido(estado, 2) || !textoValido(bairro, 100) || !textoValido(numero, 20) || !textoValido(logradouro, 150) ) {
            return res.status(400).json({ 
               erro: "Informe cidade, cep, complemento, id_cliente, estado, bairro, numero, logradouro" 
            });
        }

        const clienteExiste = await clienteModel.buscarPorId(id_cliente);
        if (clienteExiste.length === 0) {
            return res.status(400).json({ erro: "O cliente informado não existe" });
        }

        const enderecoExistente = await enderecoModel.buscarPorClienteId(id_cliente);
        if (enderecoExistente.length > 0) {
            return res.status(400).json({ erro: "Este cliente já possui um endereço cadastrado" });
        }

        const dados = { 
            cidade: cidade.trim(), 
            cep: cep.trim(), 
            complemento: complemento ? complemento.trim() : null,
            id_cliente: Number(id_cliente),
            estado: estado.trim(),
            bairro: bairro.trim(),
            numero: numero.trim(),
            logradouro: logradouro.trim()
        };

        const resultado = await enderecoModel.criar(dados);
        return res.status(201).json({
            mensagem: "Endereço cadastrado com sucesso",
            id: resultado.insertId
        });
    } catch (erro) {
        return next(erro);
    }
}

export async function atualizar(req, res, next) {
    try {
        const id = req.params.id;
        const {cidade, cep, complemento, id_cliente, estado, bairro, numero, logradouro} = req.body ?? {};

        if (!textoValido(cidade, 50) || !textoValido(cep, 9) || !id_cliente || !textoValido(estado, 2) || !textoValido(bairro, 100) || !textoValido(numero, 20) || !textoValido(logradouro, 150) ) {
            return res.status(400).json({ 
                erro: "Informe cidade, cep, complemento, id_cliente, estado, bairro, numero, logradouro" 
            });
        }

        const registros = await enderecoModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "endereco não encontrado" });
        }

        const dados = { 
            cidade: cidade.trim(), 
            cep: cep.trim(), 
            complemento: complemento ? complemento.trim() : null,
            id_cliente: Number(id_cliente),
            estado: estado.trim(),
            bairro: bairro.trim(),
            numero: numero.trim(),
            logradouro: logradouro.trim()
        };

        await enderecoModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Endereço atualizado com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await enderecoModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "endereco não encontrado" });
        }
        return res.status(200).json({ mensagem: "Endereço excluído com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}