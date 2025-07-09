import { PresentationModel } from "../models/presentation.model.js";

export class PresentationController {
  /**
   * Obtiene todos las presentaciones segun el estado.
   * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getPresentations(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const presentations = await PresentationModel.getPresentations(status);
      res.status(200).json(presentations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch presentations" });
    }
  }

  /**
   * Controlador para obtener una presentacion por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getPresentationById(req, res) {
    try {
      const id = req.params.id;
      const presentation = await PresentationModel.getPresentationById(id);
      if (!presentation) {
        return res.status(404).json({ error: "Presentation not found" });
      }

      res.status(200).json(presentation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch presentation" });
    }
  }

  /**
   * Controlador para crear una nueva presentacion con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createPresentation(req, res) {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Missing required field" });
      }

      const newPresentation = await PresentationModel.createPresentation({
        description,
      });
      res.status(200).json({
        message: "Presentation created successfully",
        presentation: newPresentation,
      });
    } catch (error) {
      res.status(500).json({ error: "Failet to create presentation" });
    }
  }

  /**
   * Controlador para actualizar una presentacion.
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async updatePresentation(req, res) {
    try {
      const id = req.params.id;
      const { description, status } = req.body;
      if (!description || !["active", "inactive"].includes(status)) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const updatedPresentation = await PresentationModel.updatePresentation(
        id,
        { description, status }
      );
      if (!updatedPresentation) {
        return res
          .status(404)
          .json({ error: "Presentation not found or already inactive" });
      }

      res.status(200).json({
        message: "Presentation updated successfully",
        presentation: updatedPresentation,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update presentation" });
    }
  }

  /**
   * Controlador para eliminar logicamente una presentacion (cambia su estado a "inactive").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async deletePresentation(req, res) {
    try {
      const id = req.params.id;
      const deletedPresentation =
        await PresentationModel.softDeletePresentation(id);
      if (!deletedPresentation) {
        return res
          .status(404)
          .json({ error: "Presentation not found or already inactive" });
      }

      res.status(200).json({
        message: "Presentation deleted successfully",
        presentation: deletedPresentation,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete presentation" });
    }
  }
}
