import { master } from "../db/connection.js";

export class OriginModel {
  /**
   * Obtiene origenes segun filtro de estado.
   * - `active` para origenes activos,
   * - `inactive` para origenes inactivos,
   * - `undefined` o sin paramentros para todos los origenes.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de origenes.
   */
  static async getOrigins(statusFilter) {
    let query = `SELECT * FROM origins`;
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
   * Obtiene el origen por su ID (solo activos).
   * @param {number|string} id - ID del origen.
   * @returns {Promise<Object|undefined>} - Promesa con el origen o `undefined` si no existe.
   */
  static async getOriginById(id) {
    const result = await master.query(
      `SELECT * FROM origins WHERE id = $1 AND status = 'active'`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Crea un nuevo origen con estado 'active' por defecto.
   * @param {Object} origin - Objeto con los datos del origen.
   * @param {string} origin.name - Nombre del origen.
   * @returns {Promise<void>} - Promesa que resuelve cuando el origen esta creado.
   */
  static async createOrigin(origin) {
    const { name } = origin;
    try {
      const result = await master.query(
        `INSERT INTO origins (name) VALUES ($1) RETURNING *`,
        [name]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un origen por ID.
   * @param {number} id - ID del origen a actualizar.
   * @param {Object} origin - Objeto con los datos del origen.
   * @param {string} origin.name - Nombre del origen.
   * @param {string} [origin.status] - Estado del origen ('active' o 'inactive'). Opcional
   * @returns {Promise<void>} - Promesa que resuelve cuando el origen es actualizado.
   */
  static async updateOrigin(id, origin) {
    const { name, status } = origin;
    try {
      const result = await master.query(
        `UPDATE origins SET name = $1, status = $2 WHERE id = $3 RETURNING *`,
        [name, status, id]
      );
      if (result.rowCount === 0) return null;
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca un origen como inactivo (eliminacion logica) por su ID.
   * @param {number} id - ID del origen a desactivar.
   * @returns {Promise<void>} - Promesa que resuelve cuando el origen se marca como inactivo.
   */
  static async softDeleteOrigin(id) {
    try {
      const result = await master.query(
        `UPDATE origins set status = 'inactive' WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rowCount === 0) return null;
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}
