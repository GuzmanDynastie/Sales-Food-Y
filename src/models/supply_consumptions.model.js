import { master } from "../db/connection.js";

export class SupplyConsumptionsModel {
  /**
   * Obtiene consumos de insumos segun filtro de estado.
   * - `active` para consumos de insumos activos,
   * - `inactive` para consumos de insumos inactivos,
   * - `undefined` o sin paramentros para todas los consumos de insumos.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de consumo de insumos.
   */
  static async getSupplyConsumptions(statusFilter) {
    let query = `SELECT * FROM supply_consumptions`;
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
   * Obtiene el consumo de insumos por su ID (solo activos).
   * @param {number|string} id - ID del consumo de insumos.
   * @returns {Promise<Object|undefined>} - Promesa con el consumo de insumos o `undefined` si no existe.
   */
  static async getSupplyConsumptionById(id) {
    const result = await master.query(
      `SELECT * FROM supply_consumptions WHERE id = $1 AND status = 'active'`,
      [id]
    );

    return result.rows[0];
  }

  /**
   * Crea un nuevo consumo de insumo con estado 'active' por defecto.
   * @param {Object} supplyConsumption - Objeto con los datos del consumo de insumo.
   * @param {number} supplyConsumption.supply_id - ID del consumo de insumo relacionado (referencia a la tabla `supplies`).
   * @param {number} supplyConsumption.quantity - Cantidad de consumo de insumo recibido (puede ser kilos, litros, unidades, etc. segun su unidad).
   * @param {string} supplyConsumption.reason - Motivo por el cual se haya aplicado el consumo de insumos (Preparacion salsa, Se rompieron moldes, etc).
   * @returns {Promise<Object>} - Promesa que resuelve cuando el insumo creada.
   */
  static async createSupplyConsumption(supplyConsumption) {
    try {
      const { supply_id, quantity, reason } = supplyConsumption;
      const result = await master.query(
        `INSERT INTO supply_consumptions (supply_id, quantity, reason) VALUES ($1, $2, $3) RETURNING *`,
        [supply_id, quantity, reason]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualiza un consumo de insumo por ID.
   * @param {number} id - ID del consumo de insumo a actualizar.
   * @param {Object} supplyConsumption - Objeto con los datos del consumo de insumo.
   * @param {number} supplyConsumption.supply_id - ID del consumo de insumo relacionado (referencia a la tabla `supplies`).
   * @param {number} supplyConsumption.quantity - Cantidad de consumo de insumo recibido (puede ser kilos, litros, unidades, etc. segun su unidad).
   * @param {number} supplyConsumption.reason - Motivo por el cual se haya aplicado el consumo de insumos (Preparacion salsa, Se rompieron moldes, etc).
   * @param {string} [supplyConsumption.status] - Estado del consumo de insumo ('active' o 'inactive'). Opcional
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el consumo de insumo es actualizado o `null` si no se encontró el ID proporcionado.
   */
  static async updateSupplyConsumption(id, supplyConsumption) {
    try {
      const { supply_id, quantity, reason, status } = supplyConsumption;
      const result = await master.query(
        `UPDATE supply_consumptions SET supply_id = $1, quantity = $2, reason = $3, status = $4 WHERE id = $5 RETURNING *`,
        [supply_id, quantity, reason, status, id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca un cosnumo de insumo como inactivo (eliminacion logica) por su ID.
   * @param {number} id - ID del consumo de insumo a desactivar.
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el consumo de insumo se marca como inactivo o `null` si no se encontró el ID proporcionado.
   */
  static async softDeleteSupplyConsumption(id) {
    try {
      const result = await master.query(
        `UPDATE supply_consumptions SET status = 'inactive' WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}
