import express from "express";
import { RecipesController } from "../controllers/recipe.controller.js";

const router = express.Router();

/**
 * @route GET /api/recipes
 * @desc Obtener todos las recetas (filtrados por estado si se pasa el query param `status`)
 * @access Publico
 */
router.get("/api/recipes", RecipesController.getRecipes);

/**
 * @route GET /api/recipes/:id
 * @desc Obtener una receta por su ID (solo activos)
 * @access Publico
 */
router.get("/api/recipes/:id", RecipesController.getRecipeById);

/**
 * @route POST /api/recipes
 * @desc Crear una nueva receta
 * @access Publico
 */
router.post("/api/recipes", RecipesController.createRecipe);

/**
 * @route PUT /api/recipes/:id
 * @desc Actualizar una receta por su ID
 * @access Publico
 */
router.put("/api/recipes/:id", RecipesController.updateRecipe);

/**
 * @route DELETE /api/recipes/:id
 * @desc Eliminar logicamente una receta por su ID (soft delete)
 * @access Publico
 */
router.delete("/api/recipes/:id", RecipesController.deleteRecipe);

export default router;
