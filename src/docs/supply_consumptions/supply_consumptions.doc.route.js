export const supplyConsumptionsDocs = {
  "/api/supply-consumptions": {
    get: {
      summary: "Obtener todos los consumos de insumos",
      description:
        "Retorna todos los consumos de insumos, filtradas opcionalmente por estado (`active`, `inactive`).",
      tags: ["Consumos de insumos"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra consumos de insumos por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de consumos de insumos",
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
                    date: {
                      type: "string",
                      format: "date",
                      example: "2025-04-28",
                    },
                    reason: {
                      type: "string",
                      example: "Preparacion salsa",
                    },
                    status: { type: "string", example: "active" },
                    cancelled_at: { type: "string", example: "NULL" },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener consumos de insumos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch supply consumptions",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear un nuevo consumo de insumo",
      description:
        "Crea un nuevo consumo de insumo con estado `activo` por defecto.",
      tags: ["Consumos de insumos"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["supply_id", "quantity", "reason"],
              properties: {
                supply_id: { type: "integer", example: 1 },
                quantity: { type: "number", format: "float", example: 20.0 },
                reason: { type: "string", example: "Preparacion de Salsa" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Consumo de insumo creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply consumption created successfully",
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
                    example: "Failed to create supply consumption",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/supply-consumptions/{id}": {
    get: {
      summary: "Obtener un consumo de insumo por su ID (solo activos)",
      description:
        "Retorna un consumo de insumo en estado `activo` según el ID proporcionado.",
      tags: ["Consumos de insumos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del consumo de insumo",
        },
      ],
      responses: {
        200: {
          description: "Consumo de insumo encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  supply_id: { type: "integer", example: 1 },
                  quantity: { type: "number", format: "float", example: 20.0 },
                  date: {
                    type: "string",
                    format: "date",
                    example: "2025-04-28",
                  },
                  reason: {
                    type: "string",
                    example: "Preparacion salsa",
                  },
                  status: { type: "string", example: "active" },
                  cancelled_at: { type: "string", example: "NULL" },
                },
              },
            },
          },
        },
        404: {
          description: "Consumo de insumo no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Supply consumption not found",
                  },
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
                    example: "Failed to fetch supply consumption",
                  },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar un consumo de insumo por su ID",
      description:
        "Actualiza los datos de un consumo de insumo (`activo` o `inactivo`).",
      tags: ["Consumos de insumos"],
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
              required: ["supply_id", "quantity", "date", "reason", "status"],
              properties: {
                supply_id: { type: "integer", example: 1 },
                quantity: {
                  type: "number",
                  format: "float",
                  example: 20.0,
                },
                date: {
                  type: "string",
                  format: "date",
                  example: "2025-04-28",
                },
                reason: {
                  type: "string",
                  example: "Preparacion Salsa",
                },
                status: { type: "string", example: "active" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Consumo de insumo actualizada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply consumption updated successfully",
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
          description: "Error al actualizar consumo de insumo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update supply consumption",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente un consumo de insumo (soft delete)",
      description: "Cambia el estado del consumo de insumo a `inactive`.",
      tags: ["Consumos de insumos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del consumo de insumo",
        },
      ],
      responses: {
        200: {
          description: "Consumo de insumo eliminada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply consumption soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Consumo de insumo no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Supply consumption not found",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar el consumo de insumo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete supply consumption",
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
