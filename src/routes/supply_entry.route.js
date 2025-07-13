import express from "express";
import { SupplyEntriesController } from "../controllers/supply_entries.controller.js";

const router = express.Router();

/**
 * @route GET /api/supply-entries
 * @desc Obtener todos las entradas de insumos (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/supply-entries", SupplyEntriesController.getSupplyEntries);

/**
 * @route GET /api/supply-entries/:id
 * @desc Obtener una entrada de insumo por su ID (solo activos)
 * @access Publico
 */
router.get(
  "/api/supply-entries/:id",
  SupplyEntriesController.getSupplyEntryById
);

/**
 * @route POST /api/supply-entries
 * @desc Crear una nueva entrada de insumos
 * @access Publico
 */
router.post("/api/supply-entries", SupplyEntriesController.createSupplyEntry);

/**
 * @route PUT /api/supply-entries/:id
 * @desc Actualizar una entrada de insumo por su ID
 * @access Publico
 */
router.put(
  "/api/supply-entries/:id",
  SupplyEntriesController.updateSupplyEntry
);

/**
 * @route DELETE /api/supply-entries/:id
 * @desc Eliminar logicamente una entrada de insumo por su ID (soft delete)
 * @access Publico
 */
router.delete(
  "/api/supply-entries/:id",
  SupplyEntriesController.deleteSupplyEntry
);

export default router;
