import db from "../../db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM cadastro");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query("SELECT * FROM cadastro WHERE id_cadastro = ?", [id]);
    return linhas;
}

export async function buscarPorClienteId(idCliente) {
    const [linhas] = await db.query("SELECT * FROM cadastro WHERE id_cliente = ?", [idCliente]);
    return linhas;
}

export async function criar(dados) {
    const sql = `
        INSERT INTO cadastro (endereco, cidade, cep, complemento, id_cliente) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const valores = [dados.endereco, dados.cidade, dados.cep, dados.complemento, dados.id_cliente];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = `
        UPDATE cadastro 
        SET endereco = ?, cidade = ?, cep = ?, complemento = ?, id_cliente = ? 
        WHERE id_cadastro = ?
    `;
    const valores = [dados.endereco, dados.cidade, dados.cep, dados.complemento, dados.id_cliente, id];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query("DELETE FROM cadastro WHERE id_cadastro = ?", [id]);
    return resultado;
}