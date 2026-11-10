import { Router } from "express";
import * as cadastroController from "../controllers/cadastroControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", cadastroController.listar);
router.get("/:id", validarId, cadastroController.buscarPorId);
router.post("/", cadastroController.criar);
router.put("/:id", validarId, cadastroController.atualizar);
router.delete("/:id", validarId, cadastroController.excluir);

export default router;