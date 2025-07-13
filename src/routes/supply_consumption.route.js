import express from "express";
import { SupplyConsumptionsController } from "../controllers/supply_consumptions.controller.js";

const router = express.Router();

/**
 * @route GET /api/supply-consumptions
 * @desc Obtener todos los consumos de insumos (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/supply-consumptions", SupplyConsumptionsController.getSupplyConsumptions);

/**
 * @route GET /api/supply-consumptions/:id
 * @desc Obtener un consumo de insumo por su ID (solo activos)
 * @access Publico
 */
router.get(
  "/api/supply-consumptions/:id",
  SupplyConsumptionsController.getSupplyConsumptionById
);

/**
 * @route POST /api/supply-consumptions
 * @desc Crear un nuevo consumo de insumos
 * @access Publico
 */
router.post(
  "/api/supply-consumptions",
  SupplyConsumptionsController.createSupplyConsumption
);

/**
 * @route PUT /api/supply-consumptions/:id
 * @desc Actualizar un consumo de insumo por su ID
 * @access Publico
 */
router.put(
  "/api/supply-consumptions/:id",
  SupplyConsumptionsController.updateSupplyConsumption
);

/**
 * @route DELETE /api/supply-consumptions/:id
 * @desc Eliminar logicamente un consumo de insumo por su ID (soft delete)
 * @access Publico
 */
router.delete(
  "/api/supply-consumptions/:id",
  SupplyConsumptionsController.deleteSupplyConsumption
);

export default router;
