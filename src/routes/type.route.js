import express from "express";
import { TypesController } from "../controllers/type.controller.js";

const router = express.Router();

/**
 * @route GET /api/type
 * @desc Obtener todos los tipos (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/type", TypesController.getTypes);

/**
 * @route GET /api/type/:id
 * @desc Obtener un tipo por su ID (solo activos)
 * @access Publico
 */
router.get("/api/type/:id", TypesController.getTypeById);

/**
 * @route POST /api/type
 * @desc Crear un nuevo tipo
 * @access Publico
 */
router.post("/api/type", TypesController.createType);

/**
 * @route PUT /api/type/:id
 * @desc Actualizar un tipo por su ID
 * @access Publico
 */
router.put("/api/type/:id", TypesController.updateType);

/**
 * @route DELETE /api/type/:id
 * @desc Eliminar logicamente un tipo por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/type/:id", TypesController.deleteType);

export default router;
