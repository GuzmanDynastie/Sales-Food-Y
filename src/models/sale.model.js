import { master } from "../db/connection.js";

export class SalesModel {
  /**
   * Obtiene ventas segun filtro de estado.
   * - `active` para ventas activas,
   * - `inactive` para ventas inactivas,
   * - `undefined` o sin paramentros para todas las ventas.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de ventas.
   */
  static async getSales(statusFilter) {
    let query = `SELECT * FROM sales`;
    const params = [];

    const validStatuses = ["active", "cancelled"];
    if (validStatuses.includes(statusFilter)) {
      query += ` WHERE status = $1`;
      params.push(statusFilter);
    }

    const result = await master.query(query, params);
    return result.rows;
  }

  /**
   * Obtiene la venta por su ID (solo activos).
   * @param {number|string} id - ID de la venta.
   * @returns {Promise<Object|undefined>} - Promesa con la venta o `undefined` si no existe.
   */
  static async getSaleById(id) {
    const result = await master.query(`SELECT * FROM sales WHERE id = $1 AND status = 'active'`, [
      id,
    ]);
    return result.rows[0];
  }

  /**
   * Crea una nueva venta con estado 'active' por defecto.
   * @param {Object} sale - Objeto con los datos de la venta.
   * @param {Number} sale.product_id - ID del producto vendido.
   * @param {Number} sale.user_id - ID del usuario que registra la venta.
   * @param {Number} sale.origin_id - ID del origen de la venta (ej. carniceria, directo, etc.).
   * @param {Number} sale.quantity - Cantidad de productos vendidos.
   * @returns {Promise<void>} - Promesa que resuelve cuando la venta esta creada.
   */
  static async createSale(sale) {
    const { product_id, user_id, origin_id, quantity } = sale;
    try {
      const result = await master.query(
        `INSERT INTO sales (product_id, user_id, origin_id, quantity) VALUES ($1, $2, $3, $4) RETURNING *`,
        [product_id, user_id, origin_id, quantity]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancela logicamente la venta por su ID.
   * @param {number|string} id - ID de la venta.
   * @param {string} [reason] - Motivo opcional de la cancelacion (se almacena en la columna `reason`).
   * @returns {Promise<Object|null>} - Promesa que se resualve cuando la venta ha sido cancelada o `null` si no se encontró el ID proporcionado.
   */
  static async softCancelSale(id, reason) {
    try {
      const result = await master.query(
        `UPDATE sales SET status = 'cancelled', reason = $1, cancelled_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [reason, id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}
