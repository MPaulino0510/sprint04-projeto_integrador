import { Router } from "express";
import * as loginControllers from "../controllers/loginControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", loginControllers.listar);
router.get("/:id", validarId, loginControllers.buscarPorId);
router.post("/", loginControllers.criar);
router.put("/:id", validarId, loginControllers.atualizar);
router.delete("/:id", validarId, loginControllers.excluir);

export default router;