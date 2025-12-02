import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const TextElements = dbConnection.define(
    "text_elements",
    {
        id_text_element: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        discount_description: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        },
        terms_conditions: {
            type: DataTypes.TEXT("long"),
            allowNull: false,
        },
        url_terms_conditions: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        restrictions: {
            type: DataTypes.TEXT("long"),
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: "text_elements",
    }
);
