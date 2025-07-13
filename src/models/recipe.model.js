import { master } from "../db/connection.js";

export class RecipesModel {
  /**
   * Obtiene recetas segun filtro de estado.
   * - `active` para recetas activos,
   * - `inactive` para rescetas inactivos,
   * - `undefined` o sin paramentros para todos las recetas.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de recetas.
   */
  static async getRecipes(statusFilter) {
    let query = `SELECT * FROM recipes`;
    const params = [];

    const validStatuses = ["active", "inactive"];
    if (validStatuses.includes(statusFilter)) {
      query += ` WHERE status = $1`;
      params.push(statusFilter);
    }

    const result = await master.query(query, params);
    return result.rows;
  }

  /**
   * Obtiene la receta por su ID (solo activos).
   * @param {number|string} id - ID de la receta.
   * @returns {Promise<Object|undefined>} - Promesa con la receta o `undefined` si no existe.
   */
  static async getRecipeById(id) {
    const result = await master.query(
      `SELECT * FROM recipes WHERE id = $1 AND status = 'active'`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Crea una nueva receta con estado 'active' por defecto.
   * @param {Object} recipe - Objeto con los datos de la receta.
   * @param {number} recipe.product_id - ID del producto (con referencia a la tabla `products`).
   * @param {number} recipe.supply_id - ID del insumo (con referencia a la tabla `supplies`).
   * @param {number} recipe.quantity_per_unit - Cantidad del insumo necesaria por unidad del producto (puede ser gramos,mililitros, etc.).
   * @returns {Promise<void>} - Promesa que resuelve cuando el objeto de receta esta creada.
   */
  static async createRecipe(recipe) {
    try {
      const { product_id, supply_id, quantity_per_unit } = recipe;
      const result = await master.query(
        `INSERT INTO recipes (product_id, supply_id, quantity_per_unit) VALUES ($1, $2, $3) RETURNING *`,
        [product_id, supply_id, quantity_per_unit]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un producto por ID.
   * @param {number} id - ID de la receta a actualizar.
   * @param {Object} recipe - Objeto con los datos de la receta.
   * @param {number} recipe.product_id - ID del producto (con referencia a la tabla `products`).
   * @param {number} recipe.supply_id - ID del insumo (con referencia a la tabla `supplies`).
   * @param {number} recipe.quantity_per_unit - Cantidad del insumo necesaria por unidad del producto (puede ser gramos,mililitros, etc.).
   * @param {string} [recipe.status] - Estado de la receta ('active' o 'inactive'). Opcional
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando la receta es actualizada o `null` si no se encontró el ID proporcionado.
   */
  static async updateRecipe(id, recipe) {
    try {
      const { product_id, supply_id, quantity_per_unit, status } = recipe;
      const result = await master.query(
        `UPDATE recipes SET product_id = $1, supply_id = $2, quantity_per_unit = $3, status = $4 WHERE id = $5 RETURNING *`,
        [product_id, supply_id, quantity_per_unit, status, id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca una receta como inactivo (eliminacion logica) por su ID.
   * @param {number} id - ID de la receta a desactivar.
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando la receta se marca como inactivo o `null` si no se encontró el ID proporcionado.
   */
  static async softDeleteRecipe(id) {
    try {
      const result = await master.query(
        `UPDATE recipes SET status = 'inactive', cancelled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}
