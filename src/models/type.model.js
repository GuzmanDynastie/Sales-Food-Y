import { master } from "../db/connection.js";

export class TypesModel {
  /**
   * Obtiene tipos segun filtro de estado.
   * - `active` para tipos activos,
   * - `inactive` para tipos inactivos,
   * - `undefined` o sin paramentros para todos los tipos.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de tipos.
   */
  static async getTypes(statusFilter) {
    let query = `SELECT * FROM types`;
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
   * Obtiene el tipo por su ID (solo activos).
   * @param {number|string} id - ID del tipo.
   * @returns {Promise<Object|undefined>} - Promesa con el tipo o `undefined` si no existe.
   */
  static async getTypeById(id) {
    const result = await master.query(
      `SELECT * FROM types WHERE id = $1 AND status = 'active'`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Crea un nuevo tipo con estado 'active' por defecto.
   * @param {Object} type - Objeto con los datos del tipo.
   * @param {string} type.name - Nombre del tipo.
   * @returns {Promise<void>} - Promesa que resuelve cuando el tipo esta creado.
   */
  static async createType(type) {
    const { name } = type;
    try {
      const result = await master.query(
        `INSERT INTO types (name) VALUES ($1) RETURNING *`,
        [name]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un tipo por ID.
   * @param {number} id - ID del tipo a actualizar.
   * @param {Object} type - Objeto con los datos del tipo.
   * @param {string} type.name - Nombre del tipo.
   * @param {string} [type.status] - Estado del tipo ('active' o 'inactive'). Opcional
   * @returns {Promise<void>} - Promesa que resuelve cuando el tipo es actualizado.
   */
  static async updateType(id, type) {
    const { name, status } = type;
    try {
      const result = await master.query(
        `UPDATE types SET name = $1, status = $2 WHERE id = $3 RETURNING *`,
        [name, status, id]
      );
      if (result.rowCount === 0) return null;
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca un tipo como inactivo (eliminacion logica) por su ID.
   * @param {number} id - ID del tipo a desactivar.
   * @returns {Promise<void>} - Promesa que resuelve cuando el tipo se marca como inactivo.
   */
  static async softDeleteType(id) {
    try {
      const result = await master.query(
        `UPDATE types SET status = 'inactive' WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rowCount === 0) return null;
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}
