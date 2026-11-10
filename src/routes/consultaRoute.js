import { Router } from "express";
import * as consultaController from "../controllers/consultaControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", consultaController.listar);

router.get("/:id", validarId, consultaController.buscarPorId);

router.post("/", consultaController.criar);

router.put("/:id", validarId, consultaController.atualizar);

router.delete("/:id", validarId, consultaController.excluir);

export default router;