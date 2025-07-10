import express from "express";
import { SupplyController } from "../controllers/supply.controller.js";

const router = express.Router();

/**
 * @route GET /api/supplies
 * @desc Obtener todos los insumos (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/supplies", SupplyController.getSupplies);

/**
 * @route GET /api/supplies/:id
 * @desc Obtener un insumos por su ID (solo activos)
 * @access Publico
 */
router.get("/api/supplies/:id", SupplyController.getSupplyById);

/**
 * @route POST /api/supplies
 * @desc Crear un nuevo insumos
 * @access Publico
 */
router.post("/api/supplies", SupplyController.createSupply);

/**
 * @route PUT /api/supplies/:id
 * @desc Actualizar un insumos por su ID
 * @access Publico
 */
router.put("/api/supplies/:id", SupplyController.updateSupply);

/**
 * @route DELETE /api/supplies/:id
 * @desc Eliminar logicamente un insumos por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/supplies/:id", SupplyController.deleteSupply);

export default router;