import { dbConnection } from "./dbConnection";
import { UserRoles } from "../models/UserRoles";
import { Users } from "../models/Users";
import { UserProfile } from "../models/UserProfile";
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

// Sincroniza los modelos con la base de datos
export async function modelRelations(): Promise<void> {
  try {
    await dbConnection.sync();
    logger.info("Database synchronized successfully");
  } catch (error) {
    logger.error("Error synchronizing the database: " + error);
  }
}
