import express from "express";
import { OriginController } from "../controllers/origin.controller.js";

const router = express.Router();

/**
 * @route GET /api/origins
 * @desc Obtener todos los origenes (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/origins", OriginController.getOrigins);

/**
 * @route GET /api/origins/:id
 * @desc Obtener un origen por su ID (solo activos)
 * @access Publico
 */
router.get("/api/origins/:id", OriginController.getOriginById);

/**
 * @route POST /api/origins
 * @desc Crear un nuevo origen
 * @access Publico
 */
router.post("/api/origins", OriginController.createOrigin);

/**
 * @route PUT /api/origins/:id
 * @desc Actualizar un origen por su ID
 * @access Publico
 */
router.put("/api/origins/:id", OriginController.updateOrigin);

/**
 * @route DELETE /api/origins/:id
 * @desc Eliminar logicamente un origen por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/origins/:id", OriginController.deleteOrigin);

export default router;
