export const supplyDocs = {
  "/api/supplies": {
    get: {
      summary: "Obtener todos los insumos",
      description:
        "Retorna todos los insumos, filtrados opcionalmente por estado (`active`, `inactive`).",
      tags: ["Insumos"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra insumos por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de insumos",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Chile Yahualica" },
                    unit: { type: "string", example: "kg" },
                    status: { type: "string", example: "active" },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener insumos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch supplies",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear un nuevo insumo",
      description: "Crea un insumo con estado `activo` por defecto.",
      tags: ["Insumos"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "unit"],
              properties: {
                name: { type: "string", example: "Chile Yahualica" },
                unit: { type: "string", example: "kg" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Insumo creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply created successfully",
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
                    example: "Failed to create origin",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/supplies/{id}": {
    get: {
      summary: "Obtener un insumo por su ID (solo activos)",
      description:
        "Retorna un insumo en estado `activo` según el ID proporcionado.",
      tags: ["Insumos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del insumo",
        },
      ],
      responses: {
        200: {
          description: "Insumo encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Chile Yahualica" },
                  unit: { type: "string", example: "kg" },
                  status: { type: "string", example: "active" },
                },
              },
            },
          },
        },
        404: {
          description: "Insumo no encontrado",
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
          description: "Error del servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Failed to fetch supply" },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar un insumo por su ID",
      description: "Actualiza los datos de un insumo (`activo` o `inactivo`).",
      tags: ["Insumos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del insumo",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "unit", "status"],
              properties: {
                name: { type: "string", example: "Frijol" },
                unit: { type: "string", example: "kg" },
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
          description: "Insumo actualizado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply updated successfully",
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
          description: "Error al actualizar insumo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update supply",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente un insumo (soft delete)",
      description: "Cambia el estado del insumo a `inactive`.",
      tags: ["Insumos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del origen",
        },
      ],
      responses: {
        200: {
          description: "Insumo eliminado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Supply soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Insumo no encontrado",
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
          description: "Error al eliminar insumo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete supply",
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
