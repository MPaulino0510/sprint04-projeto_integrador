import db from "../../db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM consulta");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query("SELECT * FROM consulta WHERE id_consulta = ?", [id]);
    return linhas;
}

export async function criar(dados) {
    const sql = "INSERT INTO consulta (descricao_tecnica, status_consulta, id_cliente) VALUES (?, ?, ?)";
    const valores = [dados.descricao_tecnica, dados.status_consulta, dados.id_cliente];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = "UPDATE consulta SET descricao_tecnica =?, status_consulta =?, id_cliente =? WHERE id_consulta = ?";
    const valores = [dados.descricao_tecnica, dados. id];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query("DELETE FROM consulta WHERE id_consulta = ?", [id]);
    return resultado;
}