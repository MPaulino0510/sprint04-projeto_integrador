import { Router } from "express";
import * as consultaControllers from "../controllers/consultaControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", consultaControllers.listar);
router.get("/:id", validarId, consultaControllers.buscarPorId);
router.post("/", consultaControllers.criar);
router.put("/:id", validarId, consultaControllers.atualizar);
router.delete("/:id", validarId, consultaControllers.excluir);

export default router;