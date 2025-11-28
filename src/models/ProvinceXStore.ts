import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const ProvinceXStore = dbConnection.define(
    "province_x_store",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        province_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "province_x_store",
    }
);
