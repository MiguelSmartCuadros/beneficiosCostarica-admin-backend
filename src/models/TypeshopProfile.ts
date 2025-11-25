import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const TypeshopProfile = dbConnection.define(
    "typeshop_profile",
    {
        id_typeshop_profile: {
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
        tableName: "typeshop_profile",
    }
);
