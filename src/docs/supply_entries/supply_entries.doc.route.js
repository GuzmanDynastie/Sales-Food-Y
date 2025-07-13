export const supplyEntryDocs = {
  "/api/supply-entries": {
    get: {
      summary: "Obtener todos las entradas de insumos",
      description:
        "Retorna todos las entradas de insumos, filtradas opcionalmente por estado (`active`, `inactive`).",
      tags: ["Entradas de insumos"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra entradas de insumos por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de entradas de insumos",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    supply_id: { type: "integer", example: 1 },
                    quantity: {
                      type: "number",
                      format: "float",
                      example: 20.0,
                    },
                    total_price: {
                      type: "number",
                      format: "float",
                      example: 100.0,
                    },
                    unit_cost: {
                      type: "number",
                      format: "float",
                      example: 5.0,
                    },
                    date: {
                      type: "string",
                      format: "date",
                      example: "2025-04-28",
                    },
                    status: { type: "string", example: "active" },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener entradas de insumos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch Supply entries",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear una nueva entrada insumo",
      description: "Crea una entrada insumo con estado `activo` por defecto.",
      tags: ["Entradas de insumos"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "supply_id",
                "quantity",
                "total_price",
                "unit_cost",
                "date",
              ],
              properties: {
                supply_id: { type: "integer", example: 1 },
                quantity: { type: "number", format: "float", example: 20.0 },
                total_price: {
                  type: "number",
                  format: "float",
                  example: 100.0,
                },
                unit_cost: { type: "number", format: "float", example: 5.0 },
                date: { type: "string", format: "date", example: "2025-04-28" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Entrada de insumo creada exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply entry created successfully",
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
                    example: "Failed to create Supply entry",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/supply-entries/{id}": {
    get: {
      summary: "Obtener una entrada de insumo por su ID (solo activos)",
      description:
        "Retorna una entrada de insumo en estado `activo` según el ID proporcionado.",
      tags: ["Entradas de insumos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la entrada de insumo",
        },
      ],
      responses: {
        200: {
          description: "Entrada de insumo encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  supply_id: { type: "integer", example: 1 },
                  quantity: { type: "number", format: "float", example: 20.0 },
                  total_price: {
                    type: "number",
                    format: "float",
                    example: 100.0,
                  },
                  unit_cost: { type: "number", format: "float", example: 5.0 },
                  date: {
                    type: "string",
                    format: "date",
                    example: "2025-04-28",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Entrada de insumo no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Supply entry not found" },
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
                    example: "Failed to fetch supply entry",
                  },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar una entrada de insumo por su ID",
      description:
        "Actualiza los datos de una entrada de insumo (`activo` o `inactivo`).",
      tags: ["Entradas de insumos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la entrada de insumo",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "supply_id",
                "quantity",
                "total_price",
                "unit_cost",
                "date",
                "status",
              ],
              properties: {
                supply_id: { type: "integer", example: 1 },
                quantity: { type: "number", format: "float", example: 20.0 },
                total_price: {
                  type: "number",
                  format: "float",
                  example: 100.0,
                },
                unit_cost: { type: "number", format: "float", example: 5.0 },
                date: { type: "string", format: "date", example: "2025-04-28" },
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
          description: "Entrada de insumo actualizada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply entry updated successfully",
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
          description: "Error al actualizar entrada de insumo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update supply entry",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente una entrada de insumo (soft delete)",
      description: "Cambia el estado de la entrada de insumo a `inactive`.",
      tags: ["Entradas de insumos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la entrad de insumo",
        },
      ],
      responses: {
        200: {
          description: "Entrad de insumo eliminada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply entry soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Entrada de insumo no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Supply not found" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar la entrada de insumo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete supply entry",
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
