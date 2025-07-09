export const presentationDocs = {
  "/api/presentations": {
    get: {
      summary: "Obtener todos las presentaciones",
      description:
        "Retorna todas las presentaciones, filtrados opcionalmente por estado (`active`, `inactive`).",
      tags: ["Presentaciones"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra presentaciones por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de presentaciones",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    description: { type: "string", example: "1/4" },
                    status: { type: "string", example: "active" },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener las presentaciones",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch presentations",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear una nueva presentaciones",
      description: "Crea una presentaciones con estado `activo` por defecto.",
      tags: ["Presentaciones"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                description: { type: "string", example: "1/4" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Presentacion creada exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Presentation created successfully",
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
                    example: "Failed to create presentation",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/presentations/{id}": {
    get: {
      summary: "Obtener una presentation por su ID (solo activos)",
      description:
        "Retorna una presentacion en estado `activo` según el ID proporcionado.",
      tags: ["Presentaciones"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la presentacion",
        },
      ],
      responses: {
        200: {
          description: "Presentacion encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  description: { type: "string", example: "1/4" },
                  status: { type: "string", example: "active" },
                },
              },
            },
          },
        },
        404: {
          description: "Presentacion no encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Presentation not found" },
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
                  error: { type: "string", example: "Failed to fetch presentation" },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar una presentacion por su ID",
      description: "Actualiza los datos de una presentacion (`activo` o `inactivo`).",
      tags: ["Presentaciones"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la presentacion",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["description", "status"],
              properties: {
                description: { type: "string", example: "1/4" },
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
          description: "Presentacion actualizada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Presentation updated successfully",
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
          description: "Error al actualizar la presentacion",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update presentation",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente una presentation (soft delete)",
      description: "Cambia el estado de la presentacion a `inactive`.",
      tags: ["Presentaciones"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID de la presentacion",
        },
      ],
      responses: {
        200: {
          description: "Presentacion eliminada correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Presentation soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Presentacion no encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Presentation not found" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar presentation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete presentation",
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
