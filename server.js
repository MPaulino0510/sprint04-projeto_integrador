import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/db.js";
import clienteRoute from "./src/routes/clienteRoutes.js";
import loginRoute from "./src/routes/loginRoute.js";
import enderecoRoute from "./src/routes/enderecoRoute.js";
import carrinhoRoute from "./src/routes/carrinho_de_compraRoute.js";
import compraRoute from "./src/routes/compraRoute.js";
import vendaRoute from "./src/routes/vendaRoute.js";
import consultaRoute from "./src/routes/consultaRoute.js";
import notaFiscalRoute from "./src/routes/nota_fiscalRoute.js";

import tratarErro from "./src/middlewares/tratarErro.js";

const app = express();
const PORTA = Number(process.env.PORTA || 3000);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "API do AgriTech funcionando!" });
});

app.use("/cliente", clienteRoute);
app.use("/login", loginRoute);
app.use("/endereco", enderecoRoute);
app.use("/carrinho", carrinhoRoute);
app.use("/compra", compraRoute);
app.use("/venda", vendaRoute);
app.use("/consulta", consultaRoute);
app.use("/notafiscal", notaFiscalRoute);

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});

app.use(tratarErro);

const servidor = app.listen(PORTA, () => {
    console.log(`Servidor iniciado em http://localhost:${PORTA}`);
});

servidor.on("error", (erro) => {
    console.error("Erro ao iniciar servidor:", erro.code || erro.message);
    if (db.end) db.end(() => process.exit(1));
});

/*lembretes:
o preço está em string, mudar para decimal
erro no registro de endereço
erro na edição da compra
*/