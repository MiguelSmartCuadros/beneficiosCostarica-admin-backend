import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const UserRoles = dbConnection.define(
  "user_roles",
  {
    user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    role: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "user_roles",
  }
);
