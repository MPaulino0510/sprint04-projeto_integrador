import db from "../../db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM nota_fiscal");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query(
        "SELECT * FROM nota_fiscal WHERE id_nota_fiscal = ?", 
        [id]
    );
    return linhas;
}

export async function criar(dados) {
    const sql = `
        INSERT INTO nota_fiscal (numero_nf, chave_acesso, id_venda) 
        VALUES (?, ?, ?)
    `;
    const valores = [dados.numero_nf, dados.chave_acesso, dados.id_venda];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = `
        UPDATE nota_fiscal 
        SET numero_nf = ?, chave_acesso = ?, id_venda = ? 
        WHERE id_nota_fiscal = ?
    `;
    const valores = [dados.numero_nf, dados.chave_acesso, dados.id_venda, id];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query(
        "DELETE FROM nota_fiscal WHERE id_nota_fiscal = ?", 
        [id]
    );
    return resultado;
}