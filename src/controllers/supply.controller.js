import { SupplyModel } from "../models/supply.model.js";

export class SupplyController {
  static async getSupplies(req, res) {
    /**
     * Obtiene todos los insumos segun el estado.
     * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
     * @param {import('express').Request} req - Objeto de solicitud HTTP.
     * @param {import('express').Response} res - Objeto de respuesta HTTP.
     * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
     */
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const supplies = await SupplyModel.getSupplies(status);
      res.status(200).json(supplies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supplies" });
    }
  }

  /**
   * Controlador para obtener un insumo por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getSupplyById(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const supply = await SupplyModel.getSupplyById(id);
      if (!supply) {
        return res.status(404).json({ error: "Supply not found" });
      }

      res.status(200).json(supply);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch supply" });
    }
  }

  /**
   * Controlador para crear un nuevo insumo con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createSupply(req, res) {
    try {
      const { name, unit } = req.body;
      if (!name || !unit) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newSupply = await SupplyModel.createSupply({ name, unit });
      res
        .status(201)
        .json({ message: "Supply created successfully", supply: newSupply });
    } catch (error) {
      res.status(500).json({ error: "Failed to create supply" });
    }
  }

  /**
   * Controlador para actualizar un insumo.
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async updateSupply(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json("ID must be a number");
      }
      const { name, unit, status } = req.body;
      if (!name || !unit || !["active", "inactive"].includes(status)) {
        return res.status(400).json({ error: "Missing or invalid fields" });
      }

      const updatedSupply = await SupplyModel.updateSupply(id, {
        name,
        unit,
        status,
      });
      if (!updatedSupply) {
        return res.status(404).json({ error: "Supply not found" });
      }

      res.status(200).json({
        message: "Supply updated successfully",
        supply: updatedSupply,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update supply" });
    }
  }

  /**
   * Controlador para eliminar logicamente un insumo (cambia su estado a "inactive").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async deleteSupply(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }

      const deletedSupply = await SupplyModel.softDeleteSupply(id);
      if (!deletedSupply) {
        return res.status(404).json({ error: "Supply not found" });
      }

      res.status(200).json({
        message: "Supply deleted successfully",
        supply: deletedSupply,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete supply" });
    }
  }
}
