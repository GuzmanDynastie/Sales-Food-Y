import { SalesModel } from "../models/sale.model.js";
import { Validators } from "../utils/validators.js";

export class SalesController {
  /**
   * Obtiene todos las ventas segun el estado.
   * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getAllSales(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "cancelled"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const sales = await SalesModel.getSales(status);
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  }

  /**
   * Controlador para obtener una venta por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getSaleById(req, res) {
    try {
      const id = Numbert(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const sale = await SalesModel.getSaleById(id);
      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }

      res.status(200).json(sale);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sale" });
    }
  }

  /**
   * Controlador para crear una nueva venta con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createSale(req, res) {
    try {
      const { product_id, user_id, origin_id, quantity } = req.body;
      if (
        !Validators.isPositiveNumber(product_id) ||
        !Validators.isPositiveNumber(user_id) ||
        !Validators.isPositiveNumber(origin_id) ||
        !Validators.isPositiveNumber(quantity)
      ) {
        return res
          .status(400)
          .json({
            error:
              "product_id, user_id, origin_id and quantity must be positive numbers.",
          });
      }

      const newSale = await SalesModel.createSale({
        product_id,
        user_id,
        origin_id,
        quantity,
      });
      res
        .status(201)
        .json({ message: "Sale created successfully", sale: newSale });
    } catch (error) {
      res.status(500).json({ error: "Failed to create sale" });
    }
  }

  /**
   * Controlador para eliminar logicamente una venta (cambia su estado a "cancelled").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async cancelSale(req, res) {
    try {
      const id = Numbert(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const { reason } = req.body;

      const cancelledSale = await SalesModel.softCancelSale(id, reason);
      if (!cancelledSale) {
        return res
          .status(404)
          .json({ error: "Sale not found or already inactive" });
      }

      res
        .status(200)
        .json({ message: "Sale cancelled successfully", sale: cancelledSale });
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel sale" });
    }
  }
}
