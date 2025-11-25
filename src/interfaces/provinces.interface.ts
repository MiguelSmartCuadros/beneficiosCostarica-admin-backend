import { Optional } from "sequelize";

export interface ProvincesAttributes {
    id_province: number;
    province_name: string;
}

export type ProvincesCreationAttributes = Optional<ProvincesAttributes, "id_province">;

