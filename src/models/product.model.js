import { master } from "../db/connection.js";

export class ProductModel {
  /**
   * Obtiene productos segun filtro de estado.
   * - `active` para productos activos,
   * - `inactive` para productos inactivos,
   * - `undefined` o sin paramentros para todos los productos.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de productos.
   */
  static async getProducts(statusFilter) {
    let query = `SELECT * FROM products`;
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
   * Obtiene el producto por su ID (solo activos).
   * @param {number|string} id - ID del producto.
   * @returns {Promise<Object|undefined>} - Promesa con el producto o `undefined` si no existe.
   */
  static async getProductById(id) {
    const result = await master.query(
      `SELECT * FROM products WHERE id = $1 AND status = 'active'`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Crea un nuevo producto con estado 'active' por defecto.
   * @param {Object} product - Objeto con los datos del producto.
   * @param {string} product.name - Nombre del producto.
   * @param {number} product.type_id - ID del tipo de producto.
   * @param {number} product.presentation_id - ID de la presentacion.
   * @param {number} product.price - Precio del producto.
   * @returns {Promise<void>} - Promesa que resuelve cuando el producto esta creado.
   */
  static async createProduct(product) {
    const { name, type_id, presentation_id, price } = product;
    const result = await master.query(
      `INSERT INTO products (name, type_id, presentation_id, price) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, type_id, presentation_id, price]
    );
    return result.rows[0];
  }

  /**
   * Actualiza un producto por ID.
   * @param {number} id - ID del producto a actualizar.
   * @param {Object} product - Objeto con los datos del producto.
   * @param {string} product.name - Nombre del producto.
   * @param {number} product.type_id - ID del tipo de producto.
   * @param {number} product.presentation_id - ID de la presentacion.
   * @param {number} product.price - Precio del producto.
   * @param {string} [product.status] - Estado del producto ('active' o 'inactive'). Opcional
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el producto es actualizado o `null` si no se encontró el ID proporcionado.
   */
  static async updateProduct(id, product) {
    try {
      const { name, type_id, presentation_id, price, status } = product;
      const result = await master.query(
        `UPDATE products SET name = $1, type_id = $2, presentation_id = $3, price = $4, status = $5 WHERE id = $6 RETURNING *`,
        [name, type_id, presentation_id, price, status, id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca un producto como inactivo (eliminacion logica) por su ID.
   * @param {number} id - ID del producto a desactivar.
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el producto se marca como inactivo o `null` si no se encontró el ID proporcionado.
   */
  static async softDeleteProduct(id) {
    try {
      const result = await master.query(
        `UPDATE products SET status = 'inactive', cancelled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}
