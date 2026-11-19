import db from "../../config/db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM carrinho_de_compra");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query("SELECT * FROM carrinho_de_compra WHERE id_carrinho = ?", [id]);
    return linhas;
}

export async function criar(dados) {
    const sql = "INSERT INTO carrinho_de_compra (status_carrinho, data_criacao, id_cliente) VALUES (?, ?, ?)";
    const valores = [dados.status_carrinho, dados.data_criacao, dados.id_cliente];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = "UPDATE carrinho_de_compra SET status_carrinho =?, data_criacao =?, id_cliente =? WHERE id_carrinho = ?";
    const valores = [dados.status_carrinho, dados.data_criacao, dados.id_cliente, id];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query("DELETE FROM carrinho_de_compra WHERE id_carrinho = ?", [id]);
    return resultado;
}