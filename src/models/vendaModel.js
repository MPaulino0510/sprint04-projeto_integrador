import db from "../../config/db.js";

export async function listar() {
    const [linhas] = await db.query("SELECT * FROM venda");
    return linhas;
}

export async function buscarPorId(id) {
    const [linhas] = await db.query(
        "SELECT * FROM venda WHERE id_venda = ?", 
        [id]
    );
    return linhas;
}

export async function criar(dados) {
    const sql = `
        INSERT INTO venda (data_venda, valor_total, forma_pagamento, status_pagamento, status_entrega, id_carrinho) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const valores = [
        dados.data_venda, 
        dados.valor_total, 
        dados.forma_pagamento, 
        dados.status_pagamento, 
        dados.status_entrega, 
        dados.id_carrinho
    ];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function atualizar(id, dados) {
    const sql = `
        UPDATE venda 
        SET data_venda = ?, valor_total = ?, forma_pagamento = ?, status_pagamento = ?, status_entrega = ?, id_carrinho = ? 
        WHERE id_venda = ?
    `;
    const valores = [
        dados.data_venda, 
        dados.valor_total, 
        dados.forma_pagamento, 
        dados.status_pagamento, 
        dados.status_entrega, 
        dados.id_carrinho, 
        id
    ];
    const [resultado] = await db.query(sql, valores);
    return resultado;
}

export async function excluir(id) {
    const [resultado] = await db.query(
        "DELETE FROM venda WHERE id_venda = ?", 
        [id]
    );
    return resultado;
}