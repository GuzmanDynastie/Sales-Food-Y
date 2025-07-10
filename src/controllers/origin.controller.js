import { OriginModel } from "../models/origin.model.js";

export class OriginController {
  /**
   * Obtiene todos los origenes segun el estado.
   * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getOrigins(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const origins = await OriginModel.getOrigins(status);
      res.status(200).json(origins);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch origins" });
    }
  }

  /**
   * Controlador para obtener un origen por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getOriginById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)){
        return res.status(400).json({error: "ID must be a number"});
      }
      const origin = await OriginModel.getOriginById(id);
      if (!origin) {
        return res.status(404).json({ error: "Origin not found" });
      }

      res.status(200).json(origin);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch origin" });
    }
  }

  /**
   * Controlador para crear un nuevo origen con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createOrigin(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Missing required field" });
      }

      const newOrigin = await OriginModel.createOrigin({ name });
      return res
        .status(201)
        .json({ message: "Origin created successfully", origin: newOrigin });
    } catch (error) {
      res.status(500).json({ error: "Failed to create origin" });
    }
  }

  /**
   * Controlador para actualizar un origen.
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async updateOrigin(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)){
        return res.status(400).json({error: "ID must be a number"});
      }
      const { name, status } = req.body;
      if (!name || !["active", "inactive"].includes(status)) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const updatedOrigin = await OriginModel.updateOrigin(id, {
        name,
        status,
      });
      if (!updatedOrigin) {
        return res
          .status(404)
          .json({ error: "Origin not found or already inactive" });
      }
      res.status(200).json({
        message: "Origin updated successfully",
        origin: updatedOrigin,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update origin" });
    }
  }

  /**
   * Controlador para eliminar logicamente un origen (cambia su estado a "inactive").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async deleteOrigin(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)){
        return res.status(400).json({error: "ID must be a number"});
      }
      const deletedOrigin = await OriginModel.softDeleteOrigin(id);
      if (!deletedOrigin) {
        return res
          .status(404)
          .json({ error: "Origin not found or already inactive" });
      }

      res.status(200).json({
        message: "Origin deleted successfully",
        origin: deletedOrigin,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete origin" });
    }
  }
}
