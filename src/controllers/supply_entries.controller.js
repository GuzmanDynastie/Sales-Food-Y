import { SupplyEntriesModel } from "../models/supply_entries.model.js";
import { Validators } from "../utils/validators.js";

export class SupplyEntriesController {
  /**
   * Obtiene todos las entradas de insumos segun el estado.
   * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getSupplyEntries(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const supplyEntries = await SupplyEntriesModel.getSupplyEntries(status);
      res.status(200).json(supplyEntries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supply entries" });
    }
  }

  /**
   * Controlador para obtener una entrada de insumo por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getSupplyEntryById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const supplyEntry = await SupplyEntriesModel.getSupplyEntryById(id);
      if (!supplyEntry) {
        return res
          .status(404)
          .json({ error: "Supply entry not found or already inactive" });
      }
      res.status(200).json(supplyEntry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supply entry" });
    }
  }

  /**
   * Controlador para crear una nueva entrada de insumo con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createSupplyEntry(req, res) {
    try {
      const { supply_id, quantity, total_price, unit_cost, date } = req.body;

      if (
        !Validators.isPositiveNumber(supply_id) ||
        !Validators.isPositiveNumber(quantity) ||
        !Validators.isPositiveNumber(total_price) ||
        !Validators.isPositiveNumber(unit_cost) ||
        !Validators.isValidDateString(date)
      ) {
        return res.status(400).json({
          error:
            "supply_id, quantity, total_price, and unit_cost must be positive numbers, date must be a non-empty string",
        });
      }

      const newSupplyEntry = await SupplyEntriesModel.createSupplyEntry({
        supply_id,
        quantity,
        total_price,
        unit_cost,
        date,
      });
      res.status(201).json({
        message: "Supply entry created successfully",
        supplyEntry: newSupplyEntry,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create supply entry" });
    }
  }

  /**
   * Controlador para actualizar una entrada de insumo.
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async updateSupplyEntry(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const { supply_id, quantity, total_price, unit_cost, date, status } =
        req.body;
      if (
        !Validators.isPositiveNumber(supply_id) ||
        !Validators.isPositiveNumber(quantity) ||
        !Validators.isPositiveNumber(total_price) ||
        !Validators.isPositiveNumber(unit_cost) ||
        !Validators.isValidDateString(date) ||
        !Validators.isValidStatus(status)
      ) {
        return res
          .status(400)
          .json({
            error:
              "supply_id, quantity, total_price, and unit_cost must be positive numbers, date must be a non-empty string, and status must contain a valid status.",
          });
      }

      const updatedSupplyEntry = await SupplyEntriesModel.updateSupplyEntry(
        id,
        { supply_id, quantity, total_price, unit_cost, date, status }
      );
      if (!updatedSupplyEntry) {
        return res
          .status(404)
          .json({ error: "Supply Entry not found or already inactive" });
      }

      res.status(200).json({
        message: "Supply entry updated successfully",
        supplyEntry: updatedSupplyEntry,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update supply entry" });
    }
  }

  /**
   * Controlador para eliminar logicamente una entrada de insumo (cambia su estado a "inactive").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async deleteSupplyEntry(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }

      const deletedSupplyEntry = await SupplyEntriesModel.softDeleteSupplyEntry(
        id
      );
      if (!deletedSupplyEntry) {
        return res
          .status(404)
          .json({ error: "Supply entry not found or already inactive" });
      }

      res.status(200).json({
        message: "Supply entry deleted successfully",
        supplyEntry: deletedSupplyEntry,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete supply entry" });
    }
  }
}
