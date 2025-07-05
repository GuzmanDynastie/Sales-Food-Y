import { turso } from "../db/connection.js";
import { hashPassword, comparePassword } from "../utils/password.js";

export class UserModel {
  /**
   * Obtiene usuarios segun filtro de estado.
   * - `true` para activos,
   * - `false` para inactivos,
   * - `undefined` o sin paramentros para todos.
   *
   * @param {boolean} [statusFilter] - Filtro opcional de estados.
   * @returns {Promise<Array>} Lista de usuarios.
   */
  static async getUsers(statusFilter) {
    let query = `SELECT * FROM users`;
    const params = [];

    if (statusFilter === true) {
      query += ` WHERE status = true`;
    } else if (statusFilter === false) {
      query += ` WHERE status = false`;
    }

    const result = await turso.execute(query, params);
    return result.rows;
  }

  /**
   * Obtiene el usuario por su ID (solo activos).
   * @param {number|string} id - ID del usuario.
   * @returns {Promise<Object|undefined>} - Promesa con el usuario o `undefined` si no existe.
   */
  static async getUserById(id) {
    const result = await turso.execute(
      `SELECT * FROM users WHERE id = ? AND status = 'active'`,
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
    const { name, last_name, phone, email, password } = user;
    try {
      await turso.execute(
        `INSERT INTO users (name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)`,
        [name, last_name, phone, email, password]
      );
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
   * @returns {Promise<void>} - Promesa que resuelve cuando el usuario esta creado.
   */
  static async updateUser(id, user) {
    const { name, last_name, phone, email, password } = user;
    await turso.execute(
      `UPDATE users SET name = ?, last_name = ?, phone = ?, email = ?, password = ? WHERE id = ?`,
      [name, last_name, phone, email, password, id]
    );
  }

  /**
   * Marca un usuario como ianctivo (eliminacion logica) por su ID.
   * @param {number} id - ID del usuario a desactivar.
   * @returns {Promise<void>} - Promesa que resuelve cuando el usuario se marca como inactivo.
   */
  static async softDeleteUser(id) {
    await turso.execute(`UPDATE users SET status = 'ianctive' WHERE id = ?`, [
      id,
    ]);
  }

  /**
   * Obtiene un usario por su email.
   * @param {string} email - Correo electronico del usuario a consultar.
   * @returns {Promise<Object|undefined>} - Promesa que resuelve con el objeto del usario o `undefined` si no existe.
   */
  static async getUserByEmail(email) {
    const result = turso.execute(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    return (await result).rows[0];
  }
}
