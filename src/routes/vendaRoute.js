import { Router } from "express";
import * as vendaControllers from "../controllers/vendaControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", vendaControllers.listar);
router.get("/:id", validarId, vendaControllers.buscarPorId);
router.post("/", vendaControllers.criar);
router.put("/:id", validarId, vendaControllers.atualizar);
router.delete("/:id", validarId, vendaControllers.excluir);

export default router;