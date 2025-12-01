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
      name: "Discount Codes",
      description: "Gestión de códigos de descuento"
    },
    {
      name: "Province X Store",
      description: "Gestión de relaciones entre provincias y tiendas"
    },
    {
      name: "Provincias",
      description: "Gestión de provincias"
    },
    {
      name: "Stores",
      description: "Gestión de tiendas"
    },
    {
      name: "Text Elements",
      description: "Gestión de elementos de texto de las tiendas"
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
      stores: {
        type: "object",
        required: [
          "id_user_responsible",
          "store_name",
          "category_id",
          "shop_type_id",
          "province_id",
          "store_img_card",
          "store_img_highlight",
          "store_img_banner",
          "start_date",
          "end_date",
          "reusable_code"
        ],
        properties: {
          id_user_responsible: {
            type: "integer",
            description: "ID del usuario responsable de la tienda",
          },
          store_name: {
            type: "string",
            description: "Nombre de la tienda",
            maxLength: 45,
          },
          category_id: {
            type: "integer",
            description: "ID de la categoría de la tienda",
          },
          shop_type_id: {
            type: "integer",
            description: "ID del tipo de tienda",
          },
          province_id: {
            type: "integer",
            description: "ID de la provincia donde se encuentra la tienda",
          },
          store_img_card: {
            type: "string",
            description: "URL de la imagen de tarjeta de la tienda",
            maxLength: 150,
          },
          store_img_highlight: {
            type: "string",
            description: "URL de la imagen destacada de la tienda",
            maxLength: 150,
          },
          store_img_banner: {
            type: "string",
            description: "URL de la imagen de banner de la tienda",
            maxLength: 150,
          },
          start_date: {
            type: "string",
            format: "date",
            description: "Fecha de inicio de la promoción (formato: YYYY-MM-DD)",
          },
          end_date: {
            type: "string",
            format: "date",
            description: "Fecha de fin de la promoción (formato: YYYY-MM-DD)",
          },
          reusable_code: {
            type: "boolean",
            description: "Indica si el código es reutilizable",
          },
        },
      },
      text_elements: {
        type: "object",
        required: [
          "store_id",
          "discount_description",
          "terms_conditions"
        ],
        properties: {
          id_text_element: {
            type: "integer",
            description: "ID del elemento de texto (generado automáticamente)",
          },
          store_id: {
            type: "integer",
            description: "ID de la tienda asociada",
          },
          discount_description: {
            type: "string",
            description: "Descripción del descuento",
            maxLength: 500,
          },
          description: {
            type: "string",
            description: "Descripción detallada del elemento",
            nullable: true,
          },
          terms_conditions: {
            type: "string",
            description: "Términos y condiciones",
          },
          url_terms_conditions: {
            type: "string",
            description: "URL de los términos y condiciones",
            maxLength: 255,
            nullable: true,
          },
          restrictions: {
            type: "string",
            description: "Restricciones del beneficio",
            nullable: true,
          },
        },
      },
      discount_codes: {
        type: "object",
        required: [
          "store_id",
          "codes"
        ],
        properties: {
          id_discout_codes: {
            type: "integer",
            description: "ID del código de descuento (generado automáticamente)",
          },
          store_id: {
            type: "integer",
            description: "ID de la tienda asociada",
          },
          codes: {
            type: "string",
            description: "Código de descuento",
            maxLength: 45,
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
