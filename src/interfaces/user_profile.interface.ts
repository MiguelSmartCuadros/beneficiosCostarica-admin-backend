import { Optional } from "sequelize";

export interface UserProfileAttributes {
    id: number;
    tipo_documento: number;
    numero_doc: string;
    nombre_completo: string;
    email: string;
    user_id: number;
}

export type UserProfileCreationAttributes = Optional<UserProfileAttributes, "id">;
