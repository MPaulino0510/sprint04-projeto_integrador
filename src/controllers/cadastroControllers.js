import * as cadastroModel from "../models/cadastroModel.js";
import * as clienteModel from "../models/clienteModel.js";
import { textoValido } from "../utils/validacoes.js";

export async function listar(req, res, next) {
    try {
        const resultado = await cadastroModel.listar();
        return res.status(200).json(resultado);
    } catch (erro) {
        return next(erro);
    }
}

export async function buscarPorId(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await cadastroModel.buscarPorId(id);
        if (resultado.length === 0) {
            return res.status(404).json({ erro: "Cadastro de endereço não encontrado" });
        }
        return res.status(200).json(resultado[0]);
    } catch (erro) {
        return next(erro);
    }
}

export async function criar(req, res, next) {
    try {
        const { endereco, cidade, cep, complemento, id_cliente } = req.body ?? {};

        if (!textoValido(endereco, 150) || !textoValido(cidade, 50) || !textoValido(cep, 9) || !id_cliente) {
            return res.status(400).json({ 
                erro: "Informe endereco (até 150), cidade (até 50), cep (até 9) e id_cliente obrigatoriamente." 
            });
        }

        const clienteExiste = await clienteModel.buscarPorId(id_cliente);
        if (clienteExiste.length === 0) {
            return res.status(400).json({ erro: "O cliente informado não existe" });
        }

        const cadastroExistente = await cadastroModel.buscarPorClienteId(id_cliente);
        if (cadastroExistente.length > 0) {
            return res.status(400).json({ erro: "Este cliente já possui um endereço cadastrado" });
        }

        const dados = { 
            endereco: endereco.trim(), 
            cidade: cidade.trim(), 
            cep: cep.trim(), 
            complemento: complemento ? complemento.trim() : null,
            id_cliente: Number(id_cliente)
        };

        const resultado = await cadastroModel.criar(dados);
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
        const { endereco, cidade, cep, complemento, id_cliente } = req.body ?? {};

        if (!textoValido(endereco, 150) || !textoValido(cidade, 50) || !textoValido(cep, 9) || !id_cliente) {
            return res.status(400).json({ 
                erro: "Informe endereco (até 150), cidade (até 50), cep (até 9) e id_cliente." 
            });
        }

        const registros = await cadastroModel.buscarPorId(id);
        if (registros.length === 0) {
            return res.status(404).json({ erro: "Cadastro não encontrado" });
        }

        const dados = { 
            endereco: endereco.trim(), 
            cidade: cidade.trim(), 
            cep: cep.trim(), 
            complemento: complemento ? complemento.trim() : null,
            id_cliente: Number(id_cliente)
        };

        await cadastroModel.atualizar(id, dados);
        return res.status(200).json({ mensagem: "Endereço atualizado com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}

export async function excluir(req, res, next) {
    try {
        const id = req.params.id;
        const resultado = await cadastroModel.excluir(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: "Cadastro não encontrado" });
        }
        return res.status(200).json({ mensagem: "Endereço excluído com sucesso" });
    } catch (erro) {
        return next(erro);
    }
}