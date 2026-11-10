import { Router } from "express";
import * as notaFiscalControllers from "../controllers/nota_fiscalControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", notaFiscalControllers.listar);
router.get("/:id", validarId, notaFiscalControllers.buscarPorId);
router.post("/", notaFiscalControllers.criar);
router.put("/:id", validarId, notaFiscalControllers.atualizar);
router.delete("/:id", validarId, notaFiscalControllers.excluir);

export default router;