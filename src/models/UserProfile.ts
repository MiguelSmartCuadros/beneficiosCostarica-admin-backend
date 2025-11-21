import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const UserProfile = dbConnection.define(
    "user_profile",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        tipo_documento: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        numero_doc: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        nombre_completo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "user_profile",
    }
);
