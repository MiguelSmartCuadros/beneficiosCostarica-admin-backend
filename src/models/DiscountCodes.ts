import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const DiscountCodes = dbConnection.define(
    "discount_codes",
    {
        id_discout_codes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        codes: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "discount_codes",
    }
);
