import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const definition: OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "beneficios-admincr-back-code",
    version: "1.0.0",
    description: "API para la autenticación de usuarios y la gestión de beneficios.",
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
      afiliado: {
        type: "object",
        required: ["numero_doc"],
        properties: {
          id: {
            type: "integer",
          },
          tipo_documento: {
            type: "integer",
          },
          numero_doc: {
            type: "string",
          },
          nombre_completo: {
            type: "string",
          },
          fecha_nacimiento: {
            type: "string",
            format: "date",
          },
          email: {
            type: "string",
          },
          genero: {
            type: "string",
          },
          tarifa: {
            type: "string",
          },
          estado_afiliado: {
            type: "boolean",
          },
          descripcion_estado: {
            type: "string",
          },
        },
      },
      convenio: {
        type: "object",
        required: ["asignado", "codigo"],
        properties: {
          id: {
            type: "integer",
          },
          id_sede: {
            $ref: "#/components/schemas/sede/properties/id",
          },
          id_afiliado: {
            $ref: "#/components/schemas/afiliado/properties/id",
          },
          id_plan: {
            $ref: "#/components/schemas/planes/properties/idplanes",
          },
          asignado: {
            type: "boolean",
          },
          codigo: {
            type: "string",
          },
          liberado: {
            type: "boolean",
          },
          tipo_tarifa: {
            type: "string",
          },
          fecha_registro: {
            type: "string",
            format: "date",
          },
        },
      },
      planes: {
        type: "object",
        required: ["name"],
        properties: {
          idplanes: {
            type: "integer",
          },
          name: {
            type: "string",
          },
          Periodicidad: {
            type: "string",
          },
        },
      },
      sede: {
        type: "object",
        required: ["id_location"],
        properties: {
          id: {
            type: "integer",
          },
          descripcion: {
            type: "string",
          },
          id_location: {
            type: "integer",
          },
        },
      },
      tipo_documento_identidad: {
        type: "object",
        required: ["codigo", "descripcion"],
        properties: {
          id: {
            type: "integer",
          },
          codigo: {
            type: "string",
          },
          descripcion: {
            type: "string",
          },
        },
      },
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
      empresa_empleador: {
        type: "object",
        required: ["id", "nombre_empresa"],
        properties: {
          id: {
            type: "integer",
          },
          razon_social: {
            type: "string",
          },
          documento_tipo: {
            type: "number",
          },
          documento_numero: {
            type: "string",
          },
          telefono: {
            type: "string",
          },
          email: {
            type: "string",
          },
          activa: {
            type: "boolean",
          },
          representante_nombre: {
            type: "string",
          },
          fecha_creacion: {
            type: "string",
            format: "date-time",
          },
        },
      },
      empresa_afiliado: {
        type: "object",
        required: [
          "empresa_empleador",
          "documento_tipo",
          "documento_numero",
          "nombre",
          "email",
          "categoria",
          "fecha_creacion",
          "periodicidad",
        ],
        properties: {
          id: {
            type: "integer",
          },
          empresa_empleador: {
            $ref: "#/components/schemas/empresa_empleador/properties/id",
          },
          documento_tipo: {
            $ref: "#/components/schemas/tipo_documento_identidad/properties/id",
          },
          documento_numero: {
            type: "string",
          },
          nombre: {
            type: "string",
          },
          email: {
            type: "string",
          },
          categoria: {
            type: "string",
          },
          fecha_creacion: {
            type: "string",
            format: "date",
          },
        },
      },
      codigo_descuento: {
        type: "object",
        required: ["tarifa_descuento", "codigo", "asignado", "periodicidad"],
        properties: {
          id: {
            type: "integer",
          },
          id_plan: {
            $ref: "#/components/schemas/planes/properties/idplanes",
          },
          codigo: {
            type: "string",
          },
          asignado: {
            type: "boolean",
          },
        },
      },
      empresa_afiliado_x_codigo_descuento: {
        type: "object",
        required: ["empresa_afiliado", "codigo_descuento", "asignado"],
        properties: {
          id: {
            type: "integer",
          },
          empresa_afiliado: {
            $ref: "#/components/schemas/empresa_empleador/properties/id",
          },
          codigo_descuento: {
            $ref: "#/components/schemas/codigo_descuento/properties/id",
          },
          fecha_asignacion: {
            type: "string",
            format: "date",
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
