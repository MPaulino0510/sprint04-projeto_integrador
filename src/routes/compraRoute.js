import { Router } from "express";
import * as compraControllers from "../controllers/compraControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", compraControllers.listar);
router.get("/:id", validarId, compraControllers.buscarPorId);
router.post("/", compraControllers.criar);
router.put("/:id", validarId, compraControllers.atualizar);
router.delete("/:id", validarId, compraControllers.excluir);

export default router;