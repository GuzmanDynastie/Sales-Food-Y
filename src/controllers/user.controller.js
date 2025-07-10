import { UserModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";

export class UserController {
  /**
   * Obtiene todos los usuarios segun el estado.
   * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getAllUsers(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const users = await UserModel.getUsers(status);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  /**
   * Controlador para obtener un usuario por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getUserById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const user = await UserModel.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  /**
   * Controlador para crear un nuevo usuario con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createUser(req, res) {
    try {
      const { name, last_name, phone, email, password } = req.body;

      if (!name || !last_name || !phone || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await UserModel.createUser({
        name,
        last_name,
        phone,
        email,
        password: hashedPassword,
      });

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      if (error.message.includes("UNIQUE constraint failed: users.email")) {
        return res.status(409).json({ error: "Email is already registered" });
      }

      res.status(500).json({ error: "Failed to create new user" });
    }
  }

  /**
   * Controlador para actualizar un usuario.
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async updateUser(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const { name, last_name, phone, email, password, status } = req.body;
      if (
        !name ||
        !last_name ||
        !phone ||
        !email ||
        !password ||
        !["active", "inactive"].includes(status)
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const updatedUser = await UserModel.updateUser(id, {
        name,
        last_name,
        phone,
        email,
        password,
        status,
      });
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: "Failed to update the user" });
    }
  }

  /**
   * Controlador para eliminar logicamente un usuario (cambia su estado a "inactive").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async deleteUser(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const deletedUser = await UserModel.softDeleteUser(id);
      if (!deletedUser) {
        return res
          .status(404)
          .json({ error: "User not found or already inactive" });
      }
      res
        .status(200)
        .json({ message: "User soft delete successfully", user: deletedUser });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete the product" });
    }
  }

  /**
   * Controlador para iniciar sesion verificando correo electronico y contrasena.
   * Valida las credenciales del usuario y, si son correctas, retorna los datos publicos del usuario
   * para que puedan ser usados en configuraciones o personalizacion del perfil.
   *
   * @param {import('express').Request} req - Objeto de solicitud HTTP con los campos `email` y `password` en el body.
   * @param {import('express').Response} res - Objeto de respuesta HTTP que devuelve:
   *   - 200 con mensaje de exito y datos publicos del usuario (sin contrasena)
   *   - 400 si faltan campos requeridos
   *   - 404 si el usuario no existe
   *   - 401 si las credenciales son invalidas
   *   - 500 en caso de error del servidor
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const userData = {
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        status: user.status,
      };

      res.status(200).json({ message: "Login successful", userData });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  }
}
