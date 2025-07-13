import { ProductModel } from "../models/product.model.js";
import { Validators } from "../utils/validators.js";

export class ProductController {
  /**
   * Obtiene todos los productos segun el estado.
   * Query param `status` puede ser: "active", "inactive" o no definido (para traer todos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getAllProducts(req, res) {
    try {
      const statusParam = req.query.status;
      const validStatuses = ["active", "inactive"];
      const status = validStatuses.includes(statusParam)
        ? statusParam
        : undefined;
      const products = await ProductModel.getProducts(status);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  /**
   * Controlador para obtener un producto por ID (solo activos).
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async getProductById(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const product = await ProductModel.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  /**
   * Controlador para crear un nuevo producto con status por defecto ("active").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async createProduct(req, res) {
    try {
      const { name, type_id, presentation_id, price } = req.body;
      if (
        !Validators.isNonEmptyString(name) ||
        !Validators.isPositiveNumber(type_id) ||
        !Validators.isPositiveNumber(presentation_id) ||
        !Validators.isPositiveNumber(price)
      ) {
        return res.status(400).json({ error: "name must be a non-empty string, type_id, presentation and price must be positive numbers" });
      }

      const newProduct = await ProductModel.createProduct({
        name,
        type_id,
        presentation_id,
        price,
      });
      res
        .status(201)
        .json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      res.status(500).json({ error: "Failed to create new product" });
    }
  }

  /**
   * Controlador para actualizar un producto.
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async updateProduct(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const { name, type_id, presentation_id, price, status } = req.body;
      if (
        !Validators.isNonEmptyString(name) ||
        !Validators.isPositiveNumber(type_id) ||
        !Validators.isPositiveNumber(presentation_id) ||
        !Validators.isPositiveNumber(price) ||
        !Validators.isValidStatus(status)
      ) {
        return res.status(400).json({ error: "name must be a non-empty string, type_id, presentation and price must be positive numbers, and status must contain a valid status." });
      }

      const updatedProduct = await ProductModel.updateProduct(id, {
        name,
        type_id,
        presentation_id,
        price,
        status,
      });
      if (!updatedProduct) {
        return res
          .status(404)
          .json({ error: "Product not found or already inactive" });
      }
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update the product" });
    }
  }

  /**
   * Controlador para eliminar logicamente un producto (cambia su estado a "inactive").
   * @param {import('express').Request} req - Objeto de solicitud HTTP.
   * @param {import('express').Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} Promesa que se resuelve cuando se envia la respuesta.
   */
  static async deleteProduct(req, res) {
    try {
      const id = Number(req.params.id);
      if (!Validators.isValidNumberID(id)) {
        return res.status(400).json({ error: "ID must be a number" });
      }
      const softProduct = await ProductModel.softDeleteProduct(id);
      if (!softProduct) {
        return res
          .status(404)
          .json({ error: "Product not found or already inactive" });
      }
      res.status(200).json({
        message: "Product soft deleted successfully",
        product: softProduct,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete the product" });
    }
  }
}
