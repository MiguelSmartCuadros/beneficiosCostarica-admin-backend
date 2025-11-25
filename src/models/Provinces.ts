import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const Provinces = dbConnection.define(
  "provinces",
  {
    id_province: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    province_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "provinces",
  }
);

