import { Router } from "express";
import * as carrinhoControllers from "../controllers/carrinho_de_compraControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", carrinhoControllers.listar);
router.get("/:id", validarId, carrinhoControllers.buscarPorId);
router.post("/", carrinhoControllers.criar);
router.put("/:id", validarId, carrinhoControllers.atualizar);
router.delete("/:id", validarId, carrinhoControllers.excluir);

export default router;