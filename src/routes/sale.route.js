import express from "express";
import { SalesController } from "../controllers/sale.controller.js";

const router = express.Router();

/**
 * @route GET /api/sales
 * @desc Obtener todos las ventas (filtradas por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/sales", SalesController.getAllSales);

/**
 * @route GET /api/sales/:id
 * @desc Obtener una venta por su ID (solo activos)
 * @access Publico
 */
router.get("/api/sales/:id", SalesController.getSaleById);

/**
 * @route POST /api/sales
 * @desc Crear una nueva venta
 * @access Publico
 */
router.post("/api/sales", SalesController.createSale);

/**
 * @route DELETE /api/sales/:id
 * @desc Eliminar logicamente una venta por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/sales/:id", SalesController.cancelSale);

export default router;