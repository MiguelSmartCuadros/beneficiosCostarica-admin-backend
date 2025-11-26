import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const AsignedCodesUser = dbConnection.define(
    "asigned_codes_user",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        code_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        document_number: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        is_black: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "asigned_codes_user",
    }
);
