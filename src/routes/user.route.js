import express from "express";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @route GET /api/user
 * @desc Obtener todos los usuarios (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/user", UserController.getAllUsers);

/**
 * @route GET /api/user/:id
 * @desc Obtener un user por su ID (solo activos)
 * @access Publico
 */
router.get("/api/user/:id", UserController.getUserById);

/**
 * @route POST /api/user
 * @desc Crear un nuevo user
 * @access Publico
 */
router.post("/api/user", UserController.createUser);

/**
 * @route PUT /api/user/:id
 * @desc Actualizar un user por su ID
 * @access Publico
 */
router.put("/api/user/:id", UserController.updateUser);

/**
 * @route DELETE /api/user/:id
 * @desc Eliminar logicamente un user por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/user:id", UserController.deleteUser);

/**
 * @route POST /api/login
 * @desc Autentica el usuario validando sus credenciales (`email` y `password`)
 * @access Publico
 */
router.post("/api/login", UserController.loginUser);

export default router;
