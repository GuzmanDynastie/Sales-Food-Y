import express from "express";
import { PresentationController } from "../controllers/presentation.controller.js"

const router = express.Router();

/**
 * @route GET /api/presentations
 * @desc Obtener todas las presentaciones (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/presentations", PresentationController.getPresentations);

/**
 * @route GET /api/presentations/:id
 * @desc Obtener una presentacion por su ID (solo activos)
 * @access Publico
 */
router.get("/api/presentations/:id", PresentationController.getPresentationById);

/**
 * @route POST /api/presentations
 * @desc Crear una nueva presentacion
 * @access Publico
 */
router.post("/api/presentations", PresentationController.createPresentation);

/**
 * @route PUT /api/presentations/:id
 * @desc Actualizar una presentacion por su ID
 * @access Publico
 */
router.put("/api/presentations/:id", PresentationController.updatePresentation);

/**
 * @route DELETE /api/presentations/:id
 * @desc Eliminar logicamente una presentacion por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/presentations/:id", PresentationController.deletePresentation);

export default router;