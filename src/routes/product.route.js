import express from "express";
import { ProductController } from "../controllers/product.controller.js";

const router = express.Router();

/**
 * @route GET /api/product
 * @desc Obtener todos los productos (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/product", ProductController.getAllProducts);

/**
 * @route GET /api/product/:id
 * @desc Obtener un producto por su ID (solo activos)
 * @access Publico
 */
router.get("/api/product/:id", ProductController.getProductById);

/**
 * @route POST /api/product
 * @desc Crear un nuevo producto
 * @access Publico
 */
router.post("/api/product", ProductController.createProduct);

/**
 * @route PUT /api/product/:id
 * @desc Actualizar un producto por su ID
 * @access Publico
 */
router.put("/api/product/:id", ProductController.updateProduct);

/**
 * @route DELETE /api/product/:id
 * @desc Eliminar logicamente un producto por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/product/:id", ProductController.deleteProduct);

export default router;
