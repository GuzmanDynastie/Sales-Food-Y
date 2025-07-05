export const userDocs = {
  "/api/user": {
    get: {
      summary: "Obtener todos los usuarios",
      description:
        "Retorna todos los usuarios, filtrados opcionalmente por estado (`active`, `inactive`).",
      tags: ["Usuarios"],
      parameters: [
        {
          in: "query",
          name: "status",
          schema: {
            type: "string",
            enum: ["active", "inactive"],
          },
          required: false,
          description: "Filtra usuarios por estado",
        },
      ],
      responses: {
        200: {
          description: "Lista de usuarios",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Yolanda" },
                    last_name: { type: "string", example: "Covarrubias" },
                    email: { type: "string", example: "yolanda@example.com" },
                    phone: { type: "string", example: "3344334433" },
                    status: { type: "string", example: "active" },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Error al obtener usuarios",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to fetch usuarios",
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Crear un nuevo usuario",
      description: "Crea un usuario con estado `activo` por defecto.",
      tags: ["Usuarios"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "last_name", "phone", "email", "password"],
              properties: {
                name: { type: "string", example: "Yolanda" },
                last_name: { type: "string", example: "Covarrubias" },
                phone: { type: "string", example: "3344334433" },
                email: { type: "string", example: "yolanda@example.com" },
                password: { type: "string", example: "mypassword" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Usuario creado exitosamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User created successfully",
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
                    example: "Failed to create user",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/user/{id}": {
    get: {
      summary: "Obtener un usuario por su ID (solo activos)",
      description:
        "Retorna un usuario en estado `activo` según el ID proporcionado.",
      tags: ["Usuarios"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del usuario",
        },
      ],
      responses: {
        200: {
          description: "Usuario encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 1 },
                  name: { type: "string", example: "Yolanda" },
                  last_name: { type: "string", example: "Covarrubias" },
                  email: { type: "string", example: "yolanda@example.com" },
                  phone: { type: "string", example: "3344334433" },
                  status: { type: "string", example: "active" },
                },
              },
            },
          },
        },
        404: {
          description: "Usuario no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "User doesn't exist" },
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
                  error: { type: "string", example: "Failed to fetch user" },
                },
              },
            },
          },
        },
      },
    },

    put: {
      summary: "Actualizar un usuario por su ID",
      description: "Actualiza los datos de un usuario (`activo` o `inactivo`).",
      tags: ["Usuarios"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del usuario",
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
                "last_name",
                "phone",
                "email",
                "password",
                "status",
              ],
              properties: {
                name: { type: "string", example: "Yolanda" },
                last_name: { type: "string", example: "Covarrubias" },
                phone: { type: "string", example: "3344334433" },
                email: { type: "string", example: "yolanda@example.com" },
                password: { type: "string", example: "mypassword" },
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
          description: "Usuario actualizado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User updated successfully",
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
          description: "Error al actualizar usuario",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to update user",
                  },
                },
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Eliminar lógicamente un usuario (soft delete)",
      description: "Cambia el estado del usuario a `inactive`.",
      tags: ["Usuarios"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer", example: 1 },
          description: "ID del usuario",
        },
      ],
      responses: {
        200: {
          description: "Usuario eliminado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User soft deleted successfully",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Usuario no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "User doesn't exist" },
                },
              },
            },
          },
        },
        500: {
          description: "Error al eliminar usuario",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Failed to delete user",
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
