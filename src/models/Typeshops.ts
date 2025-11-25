import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const Typeshops = dbConnection.define(
  "typeshops",
  {
    id_type_shop: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    shop_type_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "typeshops",
  }
);

