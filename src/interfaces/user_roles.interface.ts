import { Optional } from "sequelize";

export interface UserRolesAttributes {
    user_role_id: number;
    role: string;
}

export type UserRolesCreationAttributes = Optional<UserRolesAttributes, "user_role_id">;
