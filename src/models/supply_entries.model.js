import { master } from "../db/connection.js";

export class SupplyEntriesModel {
  /**
   * Obtiene entradas de insumos segun filtro de estado.
   * - `active` para entrads de insumos activos,
   * - `inactive` para entradas de insumos inactivos,
   * - `undefined` o sin paramentros para todas las entradas de insumos.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de entradas de insumos.
   */
  static async getSupplyEntries(statusFilter) {
    let query = `SELECT * FROM supply_entries`;
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
   * Obtiene la entrada de insumos por su ID (solo activos).
   * @param {number|string} id - ID de la entrada de insumos.
   * @returns {Promise<Object|undefined>} - Promesa con la entrada de insumos o `undefined` si no existe.
   */
  static async getSupplyEntryById(id) {
    const result = await master.query(
      `SELECT * FROM supply_entries WHERE id = $1 AND status = 'active'`,
      [id]
    );

    return result.rows[0];
  }

  /**
   * Crea un nueva entrada de insumo con estado 'active' por defecto.
   * @param {Object} supplyEntry - Objeto con los datos del insumo.
   * @param {number} supplyEntry.supply_id - ID del insumo relacionado (referencia a la tabla `supplies`).
   * @param {number} supplyEntry.quantity - Cantidad de insumo recibido (puede ser kilos, litros, unidades, etc. segun su unidad).
   * @param {number} supplyEntry.total_price - Precio total pagado por esta entrada de insumo.
   * @param {number} supplyEntry.unit_cost - Costo unitario del insumo (precio por unidad).
   * @param {string} supplyEntry.date - Fecha en la que se registro la entrada del insumo (formato ISO o `YYYY-MM-DD`).
   * @returns {Promise<Object>} - Promesa que resuelve cuando el insumo creada.
   */
  static async createSupplyEntry(supplyEntry) {
    try {
      const { supply_id, quantity, total_price, unit_cost, date } = supplyEntry;
      const result = await master.query(
        `INSERT INTO supply_entries (supply_id, quantity, total_price, unit_cost, date) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [supply_id, quantity, total_price, unit_cost, date]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza una entrada de insumo por ID.
   * @param {number} id - ID de la entrada de insumo a actualizar.
   * @param {Object} supplyEntry - Objeto con los datos del insumo.
   * @param {number} supplyEntry.supply_id - ID del insumo relacionado (referencia a la tabla `supplies`).
   * @param {number} supplyEntry.quantity - Cantidad de insumo recibido (puede ser kilos, litros, unidades, etc. segun su unidad).
   * @param {number} supplyEntry.total_price - Precio total pagado por esta entrada de insumo.
   * @param {number} supplyEntry.unit_cost - Costo unitario del insumo (precio por unidad).
   * @param {string} supplyEntry.date - Fecha en la que se registro la entrada del insumo (formato ISO o `YYYY-MM-DD`).
   * @param {string} [supplyEntry.status] - Estado del insumo ('active' o 'inactive'). Opcional
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el insumo es actualizado o `null` si no se encontró el ID proporcionado.
   */
  static async updateSupplyEntry(id, supplyEntry) {
    try {
      const { supply_id, quantity, total_price, unit_cost, date, status } =
        supplyEntry;
      const result = await master.query(
        `UPDATE supply_entries SET supply_id = $1, quantity = $2, total_price = $3, unit_cost = $4, date = $5, status = $6 WHERE id = $7 RETURNING *`,
        [supply_id, quantity, total_price, unit_cost, date, status, id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca una entrada de insumo como inactivo (eliminacion logica) por su ID.
   * @param {number} id - ID de la entrada de insumo a desactivar.
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el insumo se marca como inactivo o `null` si no se encontró el ID proporcionado.
   */
  static async softDeleteSupplyEntry(id) {
    try {
      const result = await master.query(
        `UPDATE supply_entries SET status = 'inactive', cancelled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}
