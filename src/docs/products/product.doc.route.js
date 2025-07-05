export const productDocs = {
  "/api/product": {
    get: {
      summary: "Obtener todos los productos",
      description:
        "Retorna todos los productos, filtrados opcionalmente por estado (`active`, `inactive`).",
      tags: ["Productos"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra productos por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de productos",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Salsa Roja" },
                    type_id: { type: "integer", example: 2 },
                    presentation_id: { type: "integer", example: 1 },
                    price: { type: "number", example: 45.5 },
                    status: { type: "string", example: "active" },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener productos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch products",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear un nuevo producto",
      description: "Crea un producto con estado `activo` por defecto.",
      tags: ["Productos"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "type_id", "presentation_id", "price"],
              properties: {
                name: { type: "string", example: "Salsa Verde" },
                type_id: { type: "integer", example: 1 },
                presentation_id: { type: "integer", example: 2 },
                price: { type: "number", example: 39.9 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Producto creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product created successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Faltan campos requeridos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Missing required fields" },
                },
              },
            },
          },
        },
        500: {
          description: "Error en el servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to create product",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/product/{id}": {
    get: {
      summary: "Obtener un producto por su ID (solo activos)",
      description:
        "Retorna un producto en estado `activo` según el ID proporcionado.",
      tags: ["Productos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del producto",
        },
      ],
      responses: {
        200: {
          description: "Producto encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Salsa Roja" },
                  type_id: { type: "integer", example: 2 },
                  presentation_id: { type: "integer", example: 1 },
                  price: { type: "number", example: 45.5 },
                  status: { type: "string", example: "active" },
                },
              },
            },
          },
        },
        404: {
          description: "Producto no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Product doesn't exist" },
                },
              },
            },
          },
        },
        500: {
          description: "Error del servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Failed to fetch product" },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar un producto por su ID",
      description: "Actualiza los datos de un producto (`activo` o `inactivo`).",
      tags: ["Productos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del producto",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "name",
                "type_id",
                "presentation_id",
                "price",
                "status",
              ],
              properties: {
                name: { type: "string", example: "Salsa Verde" },
                type_id: { type: "integer", example: 1 },
                presentation_id: { type: "integer", example: 2 },
                price: { type: "number", example: 39.9 },
                status: {
                  type: "string",
                  enum: ["active", "inactive"],
                  example: "active",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Producto actualizado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product updated successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Datos incompletos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Missing required fields" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al actualizar producto",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update product",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente un producto (soft delete)",
      description: "Cambia el estado del producto a `inactive`.",
      tags: ["Productos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del producto",
        },
      ],
      responses: {
        200: {
          description: "Producto eliminado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Product soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Producto no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Product doesn't exist" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar producto",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete product",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // Puedes agregar más rutas aquí...
};
