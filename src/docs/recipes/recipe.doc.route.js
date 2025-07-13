export const recipeDocs = {
  "/api/recipes": {
    get: {
      summary: "Obtener todos las recetas",
      description:
        "Retorna todas las recetas, filtradas opcionalmente por estado (`active`, `inactive`).",
      tags: ["Recetas"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra recetas de insumos por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de recetas",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    product_id: { type: "integer", example: 1 },
                    supply_id: { type: "integer", example: 1 },
                    quantity_per_unit: {
                      type: "number",
                      format: "float",
                      example: 15.0,
                    },
                    status: { type: "string", example: "active" },
                    cancelled_at: {
                      type: "string",
                      format: "date",
                      example: "NULL",
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener recetas",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch recipes",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear una nueva receta",
      description: "Crea una receta con estado `activo` por defecto.",
      tags: ["Recetas"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["product_id", "supply_id", "quantity_per_unit"],
              properties: {
                product_id: { type: "integer", example: 1 },
                supply_id: { type: "number", format: "float", example: 20.0 },
                quantity_per_unit: {
                  type: "number",
                  format: "float",
                  example: 5.0,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Entrada de receta creada exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Recipe created successfully",
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
                    example: "Failed to create recipe",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/recipes/{id}": {
    get: {
      summary: "Obtener una receta por su ID (solo activos)",
      description:
        "Retorna una receta en estado `activo` según el ID proporcionado.",
      tags: ["Recetas"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la receta",
        },
      ],
      responses: {
        200: {
          description: "Receta encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  product_id: { type: "integer", example: 1 },
                  supply_id: { type: "integer", example: 1 },
                  quantity_per_unit: {
                    type: "number",
                    format: "float",
                    example: 15.0,
                  },
                  status: { type: "string", example: "active" },
                  cancelled_at: {
                    type: "string",
                    format: "date",
                    example: "NULL",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Receta no encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Recipe not found" },
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
                  error: {
                    type: "string",
                    example: "Failed to fetch recipe",
                  },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar una receta por su ID",
      description: "Actualiza los datos de una receta (`activo` o `inactivo`).",
      tags: ["Recetas"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la receta",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "product_id",
                "supply_id",
                "quanity_per_unit",
                "status",
              ],
              properties: {
                product_id: { type: "integer", example: 1 },
                supply_id: { type: "integer", example: 1 },
                quantity_per_unit: {
                  type: "number",
                  format: "float",
                  example: 15.0,
                },
                status: { type: "string", example: "active" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Receta actualizada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Recipe updated successfully",
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
          description: "Error al actualizar receta",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update recipe",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente una receta (soft delete)",
      description: "Cambia el estado de la receta a `inactive`.",
      tags: ["Recetas"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la receta",
        },
      ],
      responses: {
        200: {
          description: "Receta eliminada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Recipe soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Receta no encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Recipe not found" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar la receta",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete recipe",
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
