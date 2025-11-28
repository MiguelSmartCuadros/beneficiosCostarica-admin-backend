import { dbConnection } from "./dbConnection";
import { UserRoles } from "../models/UserRoles";
import { Users } from "../models/Users";
import { UserProfile } from "../models/UserProfile";
import { Categories } from "../models/Categories";
import { Stores } from "../models/Stores";
import { Typeshops } from "../models/Typeshops";
import { Provinces } from "../models/Provinces";
import { TipoDocumentoIdentidad } from "../models/TipoDocumentoIdentidad";
import { TypeshopProfile } from "../models/TypeshopProfile";
import { AsignedCodesUser } from "../models/AsignedCodesUser";
import { TextElements } from "../models/TextElements";
import { ProvinceXStore } from "../models/ProvinceXStore";
import { logger } from "../logger/logger";

Users.belongsTo(UserRoles, {
  foreignKey: "id_user_role",
  constraints: true,
  foreignKeyConstraint: true,
});

Users.hasOne(UserProfile, {
  foreignKey: "user_id",
  sourceKey: "id_user",
  constraints: true,
  foreignKeyConstraint: true,
});

UserProfile.belongsTo(Users, {
  foreignKey: "user_id",
  targetKey: "id_user",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre Stores y Users (Responsable)
Stores.belongsTo(Users, {
  foreignKey: "id_user_responsible",
  targetKey: "id_user",
  constraints: true,
  foreignKeyConstraint: true,
});

Users.hasOne(Stores, {
  foreignKey: "id_user_responsible",
  sourceKey: "id_user",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre Stores y Categories
Stores.belongsTo(Categories, {
  foreignKey: "category_id",
  targetKey: "id_category",
  constraints: true,
  foreignKeyConstraint: true,
});

Categories.hasMany(Stores, {
  foreignKey: "category_id",
  sourceKey: "id_category",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre Stores y Typeshops
Stores.belongsTo(Typeshops, {
  foreignKey: "shop_type_id",
  targetKey: "id_type_shop",
  constraints: true,
  foreignKeyConstraint: true,
});

Typeshops.hasMany(Stores, {
  foreignKey: "shop_type_id",
  sourceKey: "id_type_shop",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre Stores y Provinces
Stores.belongsTo(Provinces, {
  foreignKey: "province_id",
  targetKey: "id_province",
  constraints: true,
  foreignKeyConstraint: true,
});

Provinces.hasMany(Stores, {
  foreignKey: "province_id",
  sourceKey: "id_province",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre TypeshopProfile y Stores
TypeshopProfile.belongsTo(Stores, {
  foreignKey: "store_id",
  targetKey: "id_stores",
  constraints: true,
  foreignKeyConstraint: true,
});

Stores.hasMany(TypeshopProfile, {
  foreignKey: "store_id",
  sourceKey: "id_stores",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre TypeshopProfile y Typeshops
TypeshopProfile.belongsTo(Typeshops, {
  foreignKey: "typeshop_id",
  targetKey: "id_type_shop",
  constraints: true,
  foreignKeyConstraint: true,
});

Typeshops.hasMany(TypeshopProfile, {
  foreignKey: "typeshop_id",
  sourceKey: "id_type_shop",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre AsignedCodesUser y Stores
AsignedCodesUser.belongsTo(Stores, {
  foreignKey: "store_id",
  targetKey: "id_stores",
  constraints: true,
  foreignKeyConstraint: true,
});

Stores.hasMany(AsignedCodesUser, {
  foreignKey: "store_id",
  sourceKey: "id_stores",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre TextElements y Stores
TextElements.belongsTo(Stores, {
  foreignKey: "store_id",
  targetKey: "id_stores",
  constraints: true,
  foreignKeyConstraint: true,
});

Stores.hasMany(TextElements, {
  foreignKey: "store_id",
  sourceKey: "id_stores",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre ProvinceXStore y Provinces
ProvinceXStore.belongsTo(Provinces, {
  foreignKey: "province_id",
  targetKey: "id_province",
  constraints: true,
  foreignKeyConstraint: true,
});

Provinces.hasMany(ProvinceXStore, {
  foreignKey: "province_id",
  sourceKey: "id_province",
  constraints: true,
  foreignKeyConstraint: true,
});

// Relación entre ProvinceXStore y Stores
ProvinceXStore.belongsTo(Stores, {
  foreignKey: "store_id",
  targetKey: "id_stores",
  constraints: true,
  foreignKeyConstraint: true,
});

Stores.hasMany(ProvinceXStore, {
  foreignKey: "store_id",
  sourceKey: "id_stores",
  constraints: true,
  foreignKeyConstraint: true,
});

// Many-to-Many: Provinces <-> Stores through ProvinceXStore
Provinces.belongsToMany(Stores, {
  through: ProvinceXStore,
  foreignKey: "province_id",
  otherKey: "store_id",
  as: "associatedStores",
});

Stores.belongsToMany(Provinces, {
  through: ProvinceXStore,
  foreignKey: "store_id",
  otherKey: "province_id",
  as: "associatedProvinces",
});


// Sincroniza los modelos con la base de datos
export async function modelRelations(): Promise<void> {
  try {
    await dbConnection.sync();
    logger.info("Database synchronized successfully");
  } catch (error) {
    logger.error("Error synchronizing the database: " + error);
  }
}
