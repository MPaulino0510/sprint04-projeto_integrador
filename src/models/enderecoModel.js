import db from "../../db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM endereco");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query("SELECT * FROM endereco WHERE id_endereco = ?", [id]);
    return linhas;
}

export async function buscarPorClienteId(idCliente) {
    const [linhas] = await db.query("SELECT * FROM endereco WHERE id_cliente = ?", [idCliente]);
    return linhas;
}

export async function criar(dados) {
    const sql = `
        INSERT INTO endereco (cidade, cep, complemento, id_cliente, estado, bairro, numero, logradouro) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const valores = [dados.cidade, dados.cep, dados.complemento, dados.id_cliente, dados.estado, dados.bairro, dados.numero, dados.logradouro];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = `
        UPDATE endereco 
        SET cidade = ?, cep = ?, complemento = ?, id_cliente = ?,  estado = ?, bairro = ?, numero = ?, logradouro = ?
        WHERE id_endereco = ?
    `;
    const valores = [
        dados.cidade,
        dados.cep, 
        dados.complemento, 
        dados.id_cliente, 
        dados.estado, 
        dados.bairro, 
        dados.numero, 
        dados.logradouro,
        id
    ];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query("DELETE FROM endereco WHERE id_endereco = ?", [id]);
    return resultado;
}