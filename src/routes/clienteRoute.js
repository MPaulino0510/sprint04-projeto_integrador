import {Router} from "express";
import * as clienteControllers from "../controllers/clienteControllers.js";
import validarId from "../middlewares/validarId.js";

const router = Router();

router.get("/", clienteControllers.listar );

router.get("/:id", validarId, clienteControllers.buscarPorId );

router.post("/", clienteControllers.criar);

router.put("/:id", validarId, clienteControllers.atualizar);

router.delete("/:id", validarId, clienteControllers.excluir);

export default router;