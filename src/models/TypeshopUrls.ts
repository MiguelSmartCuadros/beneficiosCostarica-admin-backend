import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const TypeshopUrls = dbConnection.define(
    "typeshop_urls",
    {
        id_typeshop_urls: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        typeshop_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        url_store: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "typeshop_urls",
    }
);
