import { Router } from "express";
import * as loginControllers from "../controllers/loginControllers.js";
import validarId from "../middlewares/validarId.js";
import { autenticarToken } from "../middlewares/autenticarToken.js";

const router = Router();

router.post("/", loginControllers.criar);
router.post("/entrar", loginControllers.autenticar);

router.get("/", autenticarToken, loginControllers.listar);
router.get("/:id", autenticarToken, validarId, loginControllers.buscarPorId);
router.put("/:id", autenticarToken, validarId, loginControllers.atualizar);
router.delete("/:id", autenticarToken, validarId, loginControllers.excluir);

export default router;