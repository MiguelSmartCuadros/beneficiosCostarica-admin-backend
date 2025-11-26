import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const definition: OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "beneficios-admincr-back-code",
    version: "1.0.0",
    description: "API para la autenticación de usuarios y la gestión de beneficios para Smart Fit Costa Rica.",
  },
  servers: [
    {
      url: "http://localhost:3000/WebServicesSite",
    },
    {
      url: "https://wqk4w3fs-3001.use2.devtunnels.ms/WebServices",
    }
  ],
  tags: [
    {
      name: "ProjectInfo",
      description: "Información del proyecto"
    },
    {
      name: "AsignedCodesUser",
      description: "Gestión de códigos asignados a usuarios"
    },
    {
      name: "Autenticacion",
      description: "Endpoints de autenticación y gestión de usuarios"
    },
    {
      name: "Categorias",
      description: "Gestión de categorías"
    },
    {
      name: "Provincias",
      description: "Gestión de provincias"
    },
    {
      name: "Tipo Documento Identidad",
      description: "Gestión de tipos de documento de identidad"
    },
    {
      name: "Typeshop Profile",
      description: "Gestión de perfiles de tipo de tienda"
    },
    {
      name: "Typeshops",
      description: "Gestión de tipos de tienda"
    },
    {
      name: "User Roles",
      description: "Gestión de roles de usuario"
    },
    {
      name: "Users",
      description: "Gestión de usuarios"
    }
  ],
  components: {
    securitySchemes: {
      "x-access-token": {
        type: "apiKey",
        in: "header",
        name: "x-access-token",
        description: "Token de autenticación JWT. Se debe obtener mediante el endpoint /auth/login. Ingrese el token completo sin comillas ni espacios adicionales.",
      },
    },
    schemas: {
      user_roles: {
        type: "object",
        required: ["role"],
        properties: {
          user_role_id: {
            type: "integer",
          },
          role: {
            type: "string",
          },
        },
      },
      users: {
        type: "object",
        required: ["username", "password", "id_user_role", "enabled"],
        properties: {
          id_user: {
            type: "integer",
          },
          username: {
            type: "string",
          },
          password: {
            type: "string",
          },
          id_user_role: {
            $ref: "#/components/schemas/user_roles/properties/user_role_id",
          },
          enabled: {
            type: "integer",
          },
        },
      },
    },
  },
};

const options: OAS3Options = {
  definition,
  apis: ["./src/routes/*.ts"],
};

export default swaggerJSDoc(options);
