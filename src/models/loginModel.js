import db from "../../config/db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM login");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query("SELECT * FROM login WHERE id_login = ?", [id]);
    return linhas;
}

export async function criar(dados) {
    const sql = "INSERT INTO login (email, senha, id_cliente) VALUES (?, ?, ?)";
    const valores = [dados.email, dados.senha, dados.id_cliente];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = "UPDATE login SET email = ?, senha = ?, id_cliente = ? WHERE id_login = ?";
    const valores = [dados.email, dados.senha, dados.id_cliente, id];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query("DELETE FROM login WHERE id_login = ?", [id]);
    return resultado;
}