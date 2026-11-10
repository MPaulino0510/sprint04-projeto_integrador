import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db.js";
import clienteRoute from "./src/routes/clienteRoutes.js";
import loginRoute from "./src/routes/loginRoute.js"
import cadastroRoute from "./src/routes/cadastroRoute.js"
import tratarErro from "./src/middlewares/tratarErro.js";

const app = express();
const PORTA = Number(process.env.PORTA || 3000);

app.use(cors());
app.use(express.json());

app.use("/cliente", clienteRoute);
app.use("/login", loginRoute);
app.use("/cadastro", cadastroRoute);

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