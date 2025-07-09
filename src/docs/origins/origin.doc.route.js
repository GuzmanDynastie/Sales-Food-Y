export const originDocs = {
  "/api/origins": {
    get: {
      summary: "Obtener todos los origenes",
      description:
        "Retorna todos los origenes, filtrados opcionalmente por estado (`active`, `inactive`).",
      tags: ["Origenes"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra origenes por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de origenes",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 3 },
                    name: { type: "string", example: "Carniceria" },
                    status: { type: "string", example: "active" },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener origenes",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch origins",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear un nuevo origen",
      description: "Crea un origen con estado `activo` por defecto.",
      tags: ["Origenes"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Carniceria" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Origen creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Origin created successfully",
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

  "/api/origins/{id}": {
    get: {
      summary: "Obtener un origen por su ID (solo activos)",
      description:
        "Retorna un origen en estado `activo` según el ID proporcionado.",
      tags: ["Origenes"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 3 },
          description: "ID del origen",
        },
      ],
      responses: {
        200: {
          description: "Origen encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 3 },
                  name: { type: "string", example: "Carniceria" },
                  status: { type: "string", example: "active" },
                },
              },
            },
          },
        },
        404: {
          description: "Origen no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Origin not found" },
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
                  error: { type: "string", example: "Failed to fetch origin" },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar un origen por su ID",
      description: "Actualiza los datos de un origen (`activo` o `inactivo`).",
      tags: ["Origenes"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 3 },
          description: "ID del origen",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "status"],
              properties: {
                name: { type: "string", example: "Venta directa" },
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
          description: "Origen actualizado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Origin updated successfully",
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
          description: "Error al actualizar origen",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update origin",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente un origen (soft delete)",
      description: "Cambia el estado del origen a `inactive`.",
      tags: ["Origenes"],
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
          description: "Origen eliminado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Origin soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Origen no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Origin not found" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar origen",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete origin",
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
