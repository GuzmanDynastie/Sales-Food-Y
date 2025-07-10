import { master } from "../db/connection.js";

export class PresentationModel {
  /**
   * Obtiene presentaciones segun filtro de estado.
   * - `active` para presentaciones activos,
   * - `inactive` para presentaciones inactivos,
   * - `undefined` o sin paramentros para todos los presentaciones.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de presentaciones.
   */
  static async getPresentations(statusFilter) {
    let query = `SELECT * FROM presentations`;
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
   * Obtiene la presentacion por su ID (solo activos).
   * @param {number|string} id - ID de la presentacion.
   * @returns {Promise<Object|undefined>} - Promesa con el tipo o `undefined` si no existe.
   */
  static async getPresentationById(id) {
    const result = await master.query(
      `SELECT * FROM presentations WHERE id = $1 AND status = 'active'`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Crea una nueva presentacion con estado 'active' por defecto.
   * @param {Object} presentation - Objeto con los datos de la presentacion.
   * @param {string} presentation.description - Descripcion de la presentacion.
   * @returns {Promise<void>} - Promesa que resuelve cuando la presentacion esta creada.
   */
  static async createPresentation(presentation) {
    const { description } = presentation;
    try {
      const result = await master.query(
        `INSERT INTO presentations (description) VALUES ($1) RETURNING *`,
        [description]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza una presentacion por ID.
   * @param {number} id - ID de la presentacion a actualizar.
   * @param {Object} presentation - Objeto con los datos de la presentacion.
   * @param {string} presentation.description - Nombre de la presentacion.
   * @param {string} [presentation.status] - Estado de la presentacion ('active' o 'inactive'). Opcional
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando la presentacion es actualizada o `null` si no se encontró el ID proporcionado.
   */
  static async updatePresentation(id, presentation) {
    const { description, status } = presentation;
    try {
      const result = await master.query(
        `UPDATE presentations SET description = $1, status = $2 WHERE id = $3 RETURNING *`,
        [description, status, id]
      );
      if (result.rowCount === 0) return null;
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca una presentacion como inactiva (eliminacion logica) por su ID.
   * @param {number} id - ID de la presentacion a desactivar.
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando la presentacion se marca como inactiva o `null` si no se encontró el ID proporcionado.
   */
  static async softDeletePresentation(id) {
    try {
      const result = await master.query(
        `UPDATE presentations SET status = 'inactive' WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rowCount === 0) return null;
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}
