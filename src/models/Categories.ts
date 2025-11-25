import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const Categories = dbConnection.define(
  "categories",
  {
    id_category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name_category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "categories",
  }
);

