import { PresentationModel } from "../models/presentation.model.js";
import { Validators } from "../utils/validators.js";

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
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
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
      if (!Validators.isNonEmptyString(description)) {
        return res
          .status(400)
          .json({ error: "description must be a non-empty string" });
      }

      const newPresentation = await PresentationModel.createPresentation({
        description,
      });
      res.status(201).json({
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
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const { description, status } = req.body;
      if (
        !Validators.isNonEmptyString(description) ||
        !Validators.isValidStatus(status)
      ) {
        return res
          .status(400)
          .json({
            error:
              "description must be a non-empty string and status must contain a valid status.",
          });
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
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
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
