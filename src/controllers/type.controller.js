import { TypesModel } from "../models/type.model.js";

export class TypesController {
  /**
   * Obtiene todos los tipos segun el estado.
   * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getTypes(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const types = await TypesModel.getTypes(status);
      res.status(200).json(types);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch types" });
    }
  }

  /**
   * Controlador para obtener un tipo por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getTypeById(req, res) {
    try {
      const id = req.params.id;
      const type = await TypesModel.getTypeById(id);
      if (!type) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(type);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch type" });
    }
  }

  /**
   * Controlador para crear un nuevo tipo con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createType(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Missing required field" });
      }
      const newType = await TypesModel.createType({ name });
      res
        .status(200)
        .json({ message: "Type created successfully", type: newType });
    } catch (error) {
      res.status(500).json({ error: "Failed to create type" });
    }
  }

  /**
   * Controlador para actualizar un tipo.
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async updateType(req, res) {
    try {
      const id = req.params.id;
      const { name, status } = req.body;
      if (!name || !["active", "inactive"].includes(status)) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const updatedType = await TypesModel(id, { name, status });
      if (!updatedType) {
        return res
          .status(404)
          .json({ error: "Type not found or already inactive" });
      }
      res
        .status(200)
        .json({ message: "Product updated successfully", type: updatedType });
    } catch (error) {
      res.status(500).json({ error: "Failed to update type" });
    }
  }

  /**
   * Controlador para eliminar logicamente un tipo (cambia su estado a "inactive").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async deleteType(req, res) {
    try {
      const id = req.params.id;
      const softType = await TypesModel.softDeleteType(id);
      if (!softType) {
        return res
          .status(404)
          .json({ error: "Product not found or already inactive" });
      }

      res
        .status(200)
        .json({ message: "Product soft deleted successfully", type: softType });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete the type" });
    }
  }
}
