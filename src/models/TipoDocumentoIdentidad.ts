import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const TipoDocumentoIdentidad = dbConnection.define(
    "tipo_documento_identidad",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        codigo: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "tipo_documento_identidad",
    }
);
