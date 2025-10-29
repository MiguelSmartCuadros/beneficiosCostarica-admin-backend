import { Optional } from "sequelize";

export interface UsersAttributes {
    id_user: number;
    username: string;
    password: string;
    id_user_role: number;
    enabled: number;
}

export type UsersCreationAttributes = Optional<UsersAttributes, "id_user" | "enabled">;
