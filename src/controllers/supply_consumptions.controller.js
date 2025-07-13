import { SupplyConsumptionsModel } from "../models/supply_consumptions.model.js";
import { Validators } from "../utils/validators.js";

export class SupplyConsumptionsController {
  /**
   * Obtiene todos los consumos de insumos segun el estado.
   * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getSupplyConsumptions(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const supplyConsumptions =
        await SupplyConsumptionsModel.getSupplyConsumptions(status);
      res.status(200).json(supplyConsumptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supply consumptions" });
    }
  }

  /**
   * Controlador para obtener un consumo de insumo por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getSupplyConsumptionById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }

      const supplyConsumption =
        await SupplyConsumptionsModel.getSupplyConsumptionById(id);
      if (!supplyConsumption) {
        return res.status(404).json({ error: "Supply consumption not found" });
      }

      res.status(200).json(supplyConsumption);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supply consumption" });
    }
  }

  /**
   * Controlador para crear un nuevo consumo de insumo con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createSupplyConsumption(req, res) {
    try {
      const { supply_id, quantity, reason } = req.body;
      if (
        !Validators.isPositiveNumber(supply_id) ||
        !Validators.isPositiveNumber(quantity) ||
        !Validators.isNonEmptyString(reason)
      ) {
        return res.status(400).json({
          error:
            "Supply ID and quantity must be positive numbers, and reason must be a non-empty string.",
        });
      }

      const newSupplyConsumption =
        await SupplyConsumptionsModel.createSupplyConsumption({
          supply_id,
          quantity,
          reason,
        });
      res.status(201).json({
        message: "Supply consumption created successfully",
        supplyConsumption: newSupplyConsumption,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create supply consumptions" });
    }
  }

  /**
   * Controlador para actualizar un consumo de insumo.
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async updateSupplyConsumption(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const { supply_id, quantity, reason, status } = req.body;
      if (
        !Validators.isPositiveNumber(supply_id) ||
        !Validators.isPositiveNumber(quantity) ||
        !Validators.isNonEmptyString(reason) ||
        !Validators.isValidStatus(status)
      ) {
        return res.status(400).json({
          error:
            "supply_id and quantity must be positive numbers, reason must be a non-empty string, and status must contain a valid status.",
        });
      }

      const updatedSupplyConsumption =
        await SupplyConsumptionsModel.updateSupplyConsumption(id, {
          supply_id,
          quantity,
          reason,
          status,
        });
      if (!updatedSupplyConsumption) {
        return res
          .status(404)
          .json({ error: "Supply consumption not found or already inactive" });
      }

      res.status(200).json({
        message: "Supply consumption updated successfully",
        supplyConsumption: updatedSupplyConsumption,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update supply consumptions" });
    }
  }

  /**
   * Controlador para eliminar logicamente un consumo de insumo (cambia su estado a "inactive").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async deleteSupplyConsumption(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }

      const deletedSupplyConsumption =
        await SupplyConsumptionsModel.softDeleteSupplyConsumption(id);
      if (!deletedSupplyConsumption) {
        return res
          .status(404)
          .json({ error: "Supply consumption not found or already inactive" });
      }

      res.status(200).json({
        message: "Supply consumption deleted successfully",
        supplyConsumption: deletedSupplyConsumption,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete supply consumptions" });
    }
  }
}
