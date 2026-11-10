import db from "../../db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM compra");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query("SELECT * FROM compra WHERE id_compra = ?", [id]);
    return linhas;
}

export async function criar(dados) {
    const sql = "INSERT INTO compra (nome_produto, categoria, quantidade, preco_unitario, id_carrinho) VALUES (?, ?, ?, ?, ?)";
    const valores = [dados.nome_produto, dados.categoria, dados.quantidade, dados.preco_unitario, dados.id_carrinho];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = "UPDATE compra SET nome_produto =?, categoria =?, quantidade =?, preco_unitario =?, id_carrinho =? WHERE id_compra = ?";
    const valores = [dados.nome_produto, dados.categoria, dados.quantidade, dados.preco_unitario, dados.id_compra, id];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query("DELETE FROM compra WHERE id_compra = ?", [id]);
    return resultado;
}