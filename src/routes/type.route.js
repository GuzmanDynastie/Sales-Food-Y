import express from "express";
import { TypesController } from "../controllers/type.controller.js";

const router = express.Router();

/**
 * @route GET /api/types
 * @desc Obtener todos los tipos (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/types", TypesController.getTypes);

/**
 * @route GET /api/types/:id
 * @desc Obtener un tipo por su ID (solo activos)
 * @access Publico
 */
router.get("/api/types/:id", TypesController.getTypeById);

/**
 * @route POST /api/types
 * @desc Crear un nuevo tipo
 * @access Publico
 */
router.post("/api/types", TypesController.createType);

/**
 * @route PUT /api/types/:id
 * @desc Actualizar un tipo por su ID
 * @access Publico
 */
router.put("/api/types/:id", TypesController.updateType);

/**
 * @route DELETE /api/types/:id
 * @desc Eliminar logicamente un tipo por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/types/:id", TypesController.deleteType);

export default router;
