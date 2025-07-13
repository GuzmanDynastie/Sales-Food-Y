import { RecipesModel } from "../models/recipe.model.js";
import { Validators } from "../utils/validators.js";

export class RecipesController {
  static async getRecipes(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;

      const recipes = await RecipesModel.getRecipes(status);
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  }

  static async getRecipeById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }

      const recipe = await RecipesModel.getRecipeById(id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipe" });
    }
  }

  static async createRecipe(req, res) {
    try {
      const { product_id, supply_id, quantity_per_unit } = req.body;
      if (
        !Validators.isPositiveNumber(product_id) ||
        !Validators.isPositiveNumber(supply_id) ||
        !Validators.isPositiveNumber(quantity_per_unit)
      ) {
        return res.status(400).json({
          error:
            "Missing fields or product_id, supply_id, and quantity_per_unit must be a number",
        });
      }

      const newRecipe = await RecipesModel.createRecipe({
        product_id,
        supply_id,
        quantity_per_unit,
      });
      res
        .status(201)
        .json({ message: "Recipe created successfully", recipe: newRecipe });
    } catch (error) {
      res.status(500).json({ error: "Failed to create recipe" });
    }
  }

  static async updateRecipe(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const { product_id, supply_id, quantity_per_unit, status } = req.body;
      if (
        !Validators.isPositiveNumber(product_id) ||
        !Validators.isPositiveNumber(supply_id) ||
        !Validators.isPositiveNumber(quantity_per_unit) ||
        !Validators.isValidStatus(status)
      ) {
        return res.status(400).json({
          error:
            "Missing or invalid fields: product_id, supply_id, quantity_per_unit must be positive numbers.",
        });
      }

      const updatedRecipe = await RecipesModel.updateRecipe(id, {
        product_id,
        supply_id,
        quantity_per_unit,
        status,
      });
      if (!updatedRecipe) {
        return res
          .status(404)
          .json({ error: "Recipe not found or already inactive" });
      }
      res.status(200).json({
        message: "Recipe updated successfully",
        recipe: updatedRecipe,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update recipe" });
    }
  }

  static async deleteRecipe(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }

      const deletedRecipe = await RecipesModel.softDeleteRecipe(id);
      if (!deletedRecipe) {
        return res
          .status(404)
          .json({ error: "Recipe not found or already inactive" });
      }
      res.status(200).json({
        message: "Recipe deleted successfully",
        recipe: deletedRecipe,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete recipe" });
    }
  }
}
