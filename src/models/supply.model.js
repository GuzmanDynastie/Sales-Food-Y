import { master } from "../db/connection.js";

export class SupplyModel {
  /**
   * Obtiene insumos segun filtro de estado.
   * - `active` para insumos activos,
   * - `inactive` para insumos inactivos,
   * - `undefined` o sin paramentros para todas los insumos.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de insumos.
   */
  static async getSupplies(statusFilter) {
    let query = `SELECT * FROM supplies`;
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
   * Obtiene el insumo por su ID (solo activos).
   * @param {number|string} id - ID del insumo.
   * @returns {Promise<Object|undefined>} - Promesa con el insumo o `undefined` si no existe.
   */
  static async getSupplyById(id) {
    const result = await master.query(
      `SELECT * FROM supplies WHERE id = $1 AND status = 'active'`,
      [id]
    );

    return result.rows[0];
  }

  /**
   * Crea un nuevo insumo con estado 'active' por defecto.
   * @param {Object} supply - Objeto con los datos del insumo.
   * @param {string} supply.name - Nombre del insumo.
   * @param {number} supply.unit - Unidad del insumo registrado.
   * @returns {Promise<Object>} - Promesa que resuelve cuando el insumo esta creado.
   */
  static async createSupply(supply) {
    try {
      const { name, unit } = supply;
      const result = await master.query(
        `INSERT INTO supplies (name, unit) VALUES ($1, $2) RETURNING *`,
        [name, unit]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un insumo por ID.
   * @param {number} id - ID del insumo a actualizar.
   * @param {Object} supply - Objeto con los datos del insumo.
   * @param {string} supply.name - Nombre del insumo.
   * @param {number} supply.unit - Unidad del insumo.
   * @param {string} [supply.status] - Estado del insumo ('active' o 'inactive'). Opcional
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el insumo es actualizado o `null` si no se encontró el ID proporcionado.
   */
  static async updateSupply(id, supply) {
    try {
      const { name, unit, status } = supply;
      const result = await master.query(
        `UPDATE supplies SET name = $1, unit = $2, status = $3 WHERE id = $4 RETURNING *`,
        [name, unit, status, id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca un insumo como inactivo (eliminacion logica) por su ID.
   * @param {number} id - ID del insumo a desactivar.
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el insumo se marca como inactivo o `null` si no se encontró el ID proporcionado.
   */
  static async softDeleteSupply(id) {
    try {
      const result = await master.query(
        `UPDATE supplies SET status = 'inactive', cancelled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}
