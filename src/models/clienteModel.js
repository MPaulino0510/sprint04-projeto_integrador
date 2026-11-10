import db from "../../db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM cliente");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query("SELECT * FROM cliente WHERE id_cliente = ?", [id]);
    return linhas;
}

export async function criar(dados) {
    const sql = "INSERT INTO cliente (nome, cpf_cnpj, telefone, tipo_cultura) VALUES (?, ?, ?, ?)";
    const valores = [dados.nome, dados.cpf_cnpj, dados.telefone, dados.tipo_cultura];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = "UPDATE cliente SET nome = ?, cpf_cnpj = ?, telefone = ?, tipo_cultura = ? WHERE id_cliente = ?";
    const valores = [dados.nome, dados.cpf_cnpj, dados.telefone, dados.tipo_cultura, id];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);
    return resultado;
}