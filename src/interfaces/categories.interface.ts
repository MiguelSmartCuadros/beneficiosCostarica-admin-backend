import { Optional } from "sequelize";

export interface CategoriesAttributes {
    id_category: number;
    name_category: string;
}

export type CategoriesCreationAttributes = Optional<CategoriesAttributes, "id_category">;

