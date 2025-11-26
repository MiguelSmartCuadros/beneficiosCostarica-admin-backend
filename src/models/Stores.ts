import { DataTypes } from "sequelize";
import { dbConnection } from "../connections/dbConnection";

export const Stores = dbConnection.define(
  "stores",
  {
    id_stores: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user_responsible: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    store_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shop_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    store_img_card: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    store_img_highlight: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    store_img_banner: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "stores",
  }
);

