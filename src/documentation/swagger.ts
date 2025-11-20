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
  ],
  components: {
    securitySchemes: {
      "x-access-token": {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
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
