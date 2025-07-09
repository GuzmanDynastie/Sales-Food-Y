export const typeDocs = {
  "/api/types": {
    get: {
      summary: "Obtener todos los tipos",
      description:
        "Retorna todos los tipos, filtrados opcionalmente por estado (`active`, `inactive`).",
      tags: ["Tipos"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra tipos por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de tipos",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Salsa" },
                    status: { type: "string", example: "active" },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener tipos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch types",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear un nuevo tipo",
      description: "Crea un tipo con estado `activo` por defecto.",
      tags: ["Tipos"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Salsa" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Tipo creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Type created successfully",
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
                    example: "Failed to create type",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/types/{id}": {
    get: {
      summary: "Obtener un tipo por su ID (solo activos)",
      description:
        "Retorna un tipo en estado `activo` según el ID proporcionado.",
      tags: ["Tipos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del tipo",
        },
      ],
      responses: {
        200: {
          description: "Tipo encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Salsa" },
                  status: { type: "string", example: "active" },
                },
              },
            },
          },
        },
        404: {
          description: "Tipo no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Type not found" },
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
                  error: { type: "string", example: "Failed to fetch type" },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar un tipo por su ID",
      description: "Actualiza los datos de un tipo (`activo` o `inactivo`).",
      tags: ["Tipos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del tipo",
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
                name: { type: "string", example: "Salsa" },
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
          description: "Tipo actualizado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Type updated successfully",
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
          description: "Error al actualizar tipo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update type",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente un tipo (soft delete)",
      description: "Cambia el estado del tipo a `inactive`.",
      tags: ["Tipos"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del tipo",
        },
      ],
      responses: {
        200: {
          description: "Tipo eliminado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Type soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Tipo no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Type not found" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar tipo",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete type",
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
