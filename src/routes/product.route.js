import express from "express";
import { ProductController } from "../controllers/product.controller.js";

const router = express.Router();

/**
 * @route GET /api/products
 * @desc Obtener todos los productos (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/products", ProductController.getAllProducts);

/**
 * @route GET /api/products/:id
 * @desc Obtener un producto por su ID (solo activos)
 * @access Publico
 */
router.get("/api/products/:id", ProductController.getProductById);

/**
 * @route POST /api/products
 * @desc Crear un nuevo producto
 * @access Publico
 */
router.post("/api/products", ProductController.createProduct);

/**
 * @route PUT /api/products/:id
 * @desc Actualizar un producto por su ID
 * @access Publico
 */
router.put("/api/products/:id", ProductController.updateProduct);

/**
 * @route DELETE /api/products/:id
 * @desc Eliminar logicamente un producto por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/products/:id", ProductController.deleteProduct);

export default router;
