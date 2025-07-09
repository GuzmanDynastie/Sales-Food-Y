import { format } from "morgan";

export const saleDocs = {
  "/api/sales": {
    get: {
      summary: "Obtener todas las ventas",
      description:
        "Retorna todos las ventas, filtradas opcionalmente por estado (`active`, `cancelled`).",
      tags: ["Ventas"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "cancelled"],
          },
          required: false,
          description: "Filtra usuarios por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de ventas",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    product_id: { type: "integer", example: 2 },
                    user_id: { type: "integer", example: 1 },
                    origin: { type: "integer", example: 3 },
                    quantity: { type: "integer", example: 5 },
                    date: {
                      type: "string",
                      format: "date-time",
                      example: "2025-07-06T15:45:00Z",
                    },
                    status: { type: "string", example: "active" },
                    cancelled: {
                      type: "string",
                      format: "date-time",
                      nullable: true,
                      example: null,
                    },
                    reason: { type: "string", nullable: true, example: null },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener las ventas",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch sales",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear una nueva venta",
      description: "Crea una venta con estado `activo` por defecto.",
      tags: ["Ventas"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["product_id", "user_id", "origin_id", "quantity"],
              properties: {
                product_id: { type: "integer", example: 1 },
                user_id: { type: "integer", example: 2 },
                origin: { type: "integer", example: 1 },
                quantity: { type: "integer", example: 10 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Venta creada exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Sale created successfully",
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
                    example: "Failed to create sale",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/sales/{id}": {
    get: {
      summary: "Obtener una venta por su ID (solo activos)",
      description:
        "Retorna una venta en estado `activo` según el ID proporcionado.",
      tags: ["Ventas"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la venta",
        },
      ],
      responses: {
        200: {
          description: "Venta encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  product_id: { type: "integer", example: 2 },
                  user_id: { type: "integer", example: 1 },
                  origin: { type: "integer", example: 3 },
                  quantity: { type: "integer", example: 5 },
                  date: {
                    type: "string",
                    format: "date-time",
                    example: "2025-07-06T15:45:00Z",
                  },
                  status: { type: "string", example: "active" },
                  cancelled: {
                    type: "string",
                    format: "date-time",
                    nullable: true,
                    example: null,
                  },
                  reason: { type: "string", nullable: true, example: null },
                },
              },
            },
          },
        },
        404: {
          description: "Venta no encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Sale not found" },
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
                  error: { type: "string", example: "Failed to fetch sale" },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente una venta (soft delete)",
      description: "Cambia el estado de la venta a `cancelled`.",
      tags: ["Ventas"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la venta",
        },
      ],
      responses: {
        200: {
          description: "Venta eliminada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Sale soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Venta no encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "User not found" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar la venta",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete sale",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
