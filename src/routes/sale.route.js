import express from "express";
import { SalesController } from "../controllers/sale.controller.js";

const router = express.Router();

/**
 * @route GET /api/sale
 * @desc Obtener todos las ventas (filtradas por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/sale", SalesController.getAllSales);

/**
 * @route GET /api/sale/:id
 * @desc Obtener una venta por su ID (solo activos)
 * @access Publico
 */
router.get("/api/sale/:id", SalesController.getSaleById);

/**
 * @route POST /api/sale
 * @desc Crear una nueva venta
 * @access Publico
 */
router.post("/api/sale", SalesController.createSale);

/**
 * @route DELETE /api/sale/:id
 * @desc Eliminar logicamente una venta por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/sale/:id", SalesController.cancelSale);

export default router;