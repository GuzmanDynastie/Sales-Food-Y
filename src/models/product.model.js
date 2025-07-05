import { turso } from "../db/connection.js";

export class ProductModel {
  /**
   * Obtiene productos segun filtro de estado.
   * - `true` para activos,
   * - `false` para inactivos,
   * - `undefined` o sin paramentros para todos.
   *
   * @param {boolean} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de productos.
   */
  static async getProducts(statusFilter) {
    let query = `SELECT * FROM products`;
    const params = [];

    if (statusFilter === true) {
      query += ` WHERE status = 'active'`;
    } else if (statusFilter === false) {
      query += ` WHERE status = 'inactive'`;
    }

    const result = await turso.execute(query, params);
    return result.rows;
  }

  /**
   * Obtiene el producto por su ID (solo activos).
   * @param {number|string} id - ID del producto.
   * @returns {Promise<Object|undefined>} - Promesa con el producto o `undefined` si no existe.
   */
  static async getProductById(id) {
    const result = await turso.execute(
      `SELECT * FROM products WHERE id = ? AND status = 'active'`,
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
    await turso.execute(
      `INSERT INTO products (name, type_id, presentation_id, price) VALUES (?, ?, ?, ?)`,
      [name, type_id, presentation_id, price]
    );
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
   * @returns {Promise<void>} - Promesa que resuelve cuando el producto es actualizado.
   */
  static async updateProduct(id, product) {
    const { name, type_id, presentation_id, price, status } = product;
    await turso.execute(
      `UPDATE products SET name = ?, type_id = ?, presentation_id = ?, price = ?, status = ? WHERE id = ?`,
      [name, type_id, presentation_id, price, status, id]
    );
  }

  /**
   * Marca un producto como ianctivo (eliminacion logica) por su ID.
   * @param {number} id - ID del producto a desactivar.
   * @returns {Promise<void>} - Promesa que resuelve cuando el producto se marca como inactivo.
   */
  static async softDeleteProduct(id) {
    await turso.execute(
      `UPDATE products SET status = 'inactive' WHERE id = ?`,
      [id]
    );
  }
}
