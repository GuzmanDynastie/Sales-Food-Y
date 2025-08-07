import { master } from "../db/connection.js";
import { hashPassword, comparePassword } from "../utils/password.js";

export class UserModel {
  /**
   * Obtiene usuarios segun filtro de estado.
   * - `active` para usuarios activos,
   * - `inactive` para usuarios inactivos,
   * - `undefined` o sin paramentros para todos los usuarios.
   *
   * @param {string|undefined} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de usuarios.
   */
  static async getUsers(statusFilter) {
    let query = `SELECT * FROM users`;
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
   * Obtiene el usuario por su ID (solo activos).
   * @param {number|string} id - ID del usuario.
   * @returns {Promise<Object|undefined>} - Promesa con el usuario o `undefined` si no existe.
   */
  static async getUserById(id) {
    const result = await master.query(
      `SELECT * FROM users WHERE id = $1 AND status = 'active'`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Crea un nuevo usuario con estado 'active' por defecto.
   * @param {Object} usuario - Objeto con los datos del usuario.
   * @param {string} usuario.name - Nombre del usuario.
   * @param {string} usuario.last_name - Apellido del usuario.
   * @param {string} usuario.phone - Telefono del usuario.
   * @param {string} usuario.email - Correo electronico del usuario.
   * @param {string} usuario.password - Contrasena del usuario.
   * @returns {Promise<void>} - Promesa que resuelve cuando el usuario esta creado.
   */
  static async createUser(user) {
    const { name, last_name, phone, email, password, role } = user;
    try {
      const result = await master.query(
        `INSERT INTO users (name, last_name, phone, email, password, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, last_name, phone, email, password, role]
      );
      return result.rows[0];
    } catch (error) {
      if (error.message.includes("UNIQUE contraist failed: users.email")) {
        throw new Error("Email already registered");
      }
      throw error;
    }
  }

  /**
   * Actualiza un usuario por ID.
   * @param {number} id - ID del ususario a actualizar.
   * @param {Object} usuario - Objeto con los datos del usuario.
   * @param {string} usuario.name - Nombre del usuario.
   * @param {string} usuario.last_name - Apellido del usuario.
   * @param {string} usuario.phone - Telefono del usuario.
   * @param {string} usuario.email - Correo electronico del usuario.
   * @param {string} usuario.password - Contrasena del usuario.
   * @param {string} [usuario.status] - Estado del usuario ('active' o 'inactive'). Opcional
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el usuario esta creado o `null` si no se encontró el ID proporcionado.
   */
  static async updateUser(id, user) {
    try {
      const { name, last_name, phone, email, password } = user;
      const result = await master.query(
        `UPDATE users SET name = $1, last_name = $2, phone = $3, email = $4, password = $5 WHERE id = $6 RETURNING *`,
        [name, last_name, phone, email, password, id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Marca un usuario como ianctivo (eliminacion logica) por su ID.
   * @param {number} id - ID del usuario a desactivar.
   * @returns {Promise<Object|null>} - Promesa que resuelve cuando el usuario se marca como inactivo o `null` si no se encontró el ID proporcionado.
   */
  static async softDeleteUser(id) {
    try {
      const result = await master.query(
        `UPDATE users SET status = 'inactive', cancelled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rowCount > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtiene un usario por su email.
   * @param {string} email - Correo electronico del usuario a consultar.
   * @returns {Promise<Object|undefined>} - Promesa que resuelve con el objeto del usario o `undefined` si no existe.
   */
  static async getUserByEmail(email) {
    const result = master.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return (await result).rows[0];
  }
}
